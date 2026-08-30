import sys
from pathlib import Path
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

# Menyesuaikan path import
sys.path.append(str(Path(__file__).resolve().parent))

import models
import schemas
import auth
from database import engine, get_db
from services.trip_service import (
    get_trip_category,
    get_travel_season,
    calculate_daily_budget
)
from services.bedrock_service import generate_travel_recommendation

# Membuat tabel di database otomatis jika belum ada
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="KelanaAI API",
    description="Backend REST API dengan database PostgreSQL",
    version="0.1.0"
)

# Izinkan request dari frontend Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# === Pydantic Schemas Auth ===
class UserRegister(BaseModel):
    name: Optional[str] = None
    username: Optional[str] = None
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str


# === Endpoint Auth (Register & Login) ===
@app.post("/api/v1/auth/register", status_code=status.HTTP_201_CREATED, tags=["Auth"])
def register_user(user_data: UserRegister, db: Session = Depends(get_db)):
    """Mendaftarkan akun pengguna baru."""
    existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email sudah terdaftar"
        )
    
    # Fleksibel menerima input 'username' dari frontend Next.js maupun 'name'
    display_name = user_data.username or user_data.name or user_data.email.split("@")[0]
    
    hashed_pwd = auth.hash_password(user_data.password)
    new_user = models.User(
        name=display_name,
        email=user_data.email,
        password_hash=hashed_pwd
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Registrasi berhasil", "user_id": new_user.id}


@app.post("/api/v1/auth/login", tags=["Auth"])
def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    """Autentikasi login pengguna dan mengembalikan JWT access token."""
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if not user or not auth.verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah"
        )
    
    access_token = auth.create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/api/v1/auth/me", tags=["Auth"])
def get_current_user_profile(current_user: models.User = Depends(auth.get_current_user)):
    """Mengambil informasi profil user yang sedang login."""
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    }


# === Endpoint Recommendations & Transportations ===
@app.get("/api/v1/recommendations", response_model=List[str], tags=["Recommendations"])
def get_recommendations():
    return ["Tokyo Tower", "Mount Fuji", "Shibuya"]


@app.get("/api/v1/transportations", response_model=List[str], tags=["Transportations"])
def get_transportations():
    return ["Bus", "Train", "Flight"]


# === Endpoint CRUD Trips (Protected) ===

@app.post("/api/v1/trips", response_model=schemas.TripResponse, status_code=status.HTTP_201_CREATED, tags=["Trips"])
def create_trip(
    trip: schemas.TripCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Menyimpan data perjalanan baru milik pengguna yang login dan memanggil AWS Bedrock."""
    category = get_trip_category(trip.budget)
    season = get_travel_season(trip.travel_month)
    daily_budget = calculate_daily_budget(trip.budget, trip.days)

    try:
        ai_rec = generate_travel_recommendation(
            destination=trip.destination,
            days=trip.days,
            budget=trip.budget,
            currency=trip.currency,
            category=category
        )
    except Exception as e:
        ai_rec = f"Gagal membuat rekomendasi AI: {str(e)}"

    db_trip = models.Trip(
        user_id=current_user.id,
        destination=trip.destination,
        days=trip.days,
        budget=trip.budget,
        currency=trip.currency,
        travel_month=trip.travel_month,
        category=category,
        daily_budget=daily_budget,
        season=season,
        ai_recommendation=ai_rec
    )
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip


@app.get("/api/v1/trips", response_model=List[schemas.TripResponse], tags=["Trips"])
def get_all_trips(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Mengambil daftar trip khusus milik user yang sedang login."""
    return db.query(models.Trip).filter(models.Trip.user_id == current_user.id).all()


@app.get("/api/v1/trips/{trip_id}", response_model=schemas.TripResponse, tags=["Trips"])
def get_trip_by_id(
    trip_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Mengambil detail satu trip berdasarkan ID (Hanya pemilik yang diizinkan)."""
    trip = db.query(models.Trip).filter(models.Trip.id == trip_id).first()
    
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID {trip_id} not found"
        )
        
    if trip.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Anda tidak memiliki akses ke trip ini"
        )

    return trip


@app.put("/api/v1/trips/{trip_id}", response_model=schemas.TripResponse, tags=["Trips"])
def update_trip_budget(
    trip_id: int, 
    payload: schemas.TripUpdateBudget, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Memperbarui budget (Hanya pemilik trip yang diizinkan)."""
    trip = db.query(models.Trip).filter(models.Trip.id == trip_id).first()
    
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID {trip_id} not found"
        )

    if trip.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Anda tidak berhak mengubah perjalanan milik orang lain"
        )

    trip.budget = payload.budget
    trip.category = get_trip_category(trip.budget)
    trip.daily_budget = calculate_daily_budget(trip.budget, trip.days)

    db.commit()
    db.refresh(trip)
    return trip


@app.delete("/api/v1/trips/{trip_id}", status_code=status.HTTP_200_OK, tags=["Trips"])
def delete_trip(
    trip_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Menghapus trip (Hanya pemilik trip yang diizinkan)."""
    trip = db.query(models.Trip).filter(models.Trip.id == trip_id).first()
    
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID {trip_id} not found"
        )

    if trip.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Anda tidak berhak menghapus perjalanan milik orang lain"
        )

    db.delete(trip)
    db.commit()
    return {"message": f"Trip with ID {trip_id} successfully deleted"}