from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Conversation, Message, User
from schemas import (
    ConversationCreate, 
    ConversationResponse, 
    ConversationUpdate, 
    MessageCreate, 
    MessageResponse
)
from auth import get_current_user 
from services.bedrock_service import invoke_bedrock_with_history 

# Sesuaikan prefix menjadi /conversations
router = APIRouter(
    prefix="/conversations",
    tags=["Conversations"]
)

@router.post("", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
def create_conversation(
    payload: ConversationCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Membuat percakapan baru untuk user yang sedang login"""
    new_conv = Conversation(
        title=payload.title,
        user_id=current_user.id
    )
    db.add(new_conv)
    db.commit()
    db.refresh(new_conv)
    return new_conv

@router.get("", response_model=List[ConversationResponse])
def list_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Menampilkan daftar percakapan milik user yang sedang login"""
    return db.query(Conversation).filter(Conversation.user_id == current_user.id)\
             .order_by(Conversation.created_at.desc()).all()

@router.patch("/{id}", response_model=ConversationResponse)
def rename_conversation(
    id: int, 
    payload: ConversationUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mengubah judul percakapan"""
    conv = db.query(Conversation).filter(
        Conversation.id == id, 
        Conversation.user_id == current_user.id
    ).first()
    
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    conv.title = payload.title
    db.commit()
    db.refresh(conv)
    return conv

# ==========================================
# ENDPOINT HAPUS PERCAKAPAN (ADDED)
# ==========================================
@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete_conversation(
    id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Menghapus percakapan beserta seluruh riwayat pesannya"""
    conv = db.query(Conversation).filter(
        Conversation.id == id, 
        Conversation.user_id == current_user.id
    ).first()
    
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    db.delete(conv)
    db.commit()
    return {"message": f"Conversation with ID {id} successfully deleted"}

# ==========================================
# ENDPOINT UNTUK MESSAGES
# ==========================================
@router.get("/{id}/messages", response_model=List[MessageResponse])
def get_messages(
    id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mengambil seluruh riwayat pesan dalam satu percakapan"""
    conv = db.query(Conversation).filter(
        Conversation.id == id, 
        Conversation.user_id == current_user.id
    ).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    return db.query(Message).filter(Message.conversation_id == id)\
             .order_by(Message.created_at.asc()).all()

@router.post("/{id}/messages", response_model=MessageResponse)
def send_message(
    id: int, 
    payload: MessageCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Orchestrator Utama: Simpan user msg -> Load history -> Invoke Bedrock -> Simpan AI msg"""
    conv = db.query(Conversation).filter(
        Conversation.id == id, 
        Conversation.user_id == current_user.id
    ).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # 1. Simpan pesan User
    user_msg = Message(conversation_id=id, role="user", content=payload.content)
    db.add(user_msg)
    db.commit()

    # 2. Load riwayat pesan
    history = db.query(Message).filter(Message.conversation_id == id)\
                .order_by(Message.created_at.asc()).all()

    # Auto-generate judul percakapan jika masih default
    if conv.title == "Percakapan Baru" and len(history) <= 2:
        conv.title = payload.content[:30] + "..." if len(payload.content) > 30 else payload.content
        db.commit()

    # 3. Kirim ke AWS Bedrock
    ai_response_text = invoke_bedrock_with_history(history)

    # 4. Simpan respon AI
    ai_msg = Message(conversation_id=id, role="assistant", content=ai_response_text)
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)

    return ai_msg