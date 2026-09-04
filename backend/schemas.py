from typing import Optional, List
from pydantic import BaseModel, EmailStr
from datetime import datetime

# === User & Auth Schemas ===
class UserRegister(BaseModel):
    name: Optional[str] = None
    username: Optional[str] = None
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        from_attributes = True

# === Trip Schemas ===
class TripBase(BaseModel):
    destination: str
    days: int
    budget: float
    currency: str
    travel_month: str

class TripCreate(TripBase):
    pass

class TripUpdateBudget(BaseModel):
    budget: float

class TripResponse(TripBase):
    id: int
    category: Optional[str] = None
    daily_budget: Optional[float] = None
    season: Optional[str] = None
    ai_recommendation: Optional[str] = None  

    class Config:
        from_attributes = True

# ==========================================
# CONVERSATION & MESSAGE SCHEMAS 
# ==========================================

class MessageCreate(BaseModel):
    content: str

class MessageResponse(BaseModel):
    id: int
    conversation_id: int
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

class ConversationCreate(BaseModel):
    title: Optional[str] = "Percakapan Baru"

class ConversationUpdate(BaseModel):
    title: str

class ConversationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    created_at: datetime

    class Config:
        from_attributes = True