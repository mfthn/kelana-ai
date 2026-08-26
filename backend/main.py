import sys
from pathlib import Path
from typing import List

from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

# Menyesuaikan path import
sys.path.append(str(Path(__file__).resolve().parent))

import models
import schemas
from database import engine, get_db
from services.trip_service import (
    get_trip_category,
    get_travel_season,
    calculate_daily_budget
)

# Membuat tabel di database otomatis jika belum ada
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="KelanaAI API",
    description="Backend REST API dengan database PostgreSQL",
    version="0.1.0"
)

# izinkan request dari frontend Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Endpoint ===
@app.get("/api/v1/recommendations", response_model=List[str])
def get_recommendations():
    return ["Tokyo Tower", "Mount Fuji", "Shibuya"]


@app.get("/api/v1/transportations", response_model=List[str])
def get_transportations():
    return ["Bus", "Train", "Flight"]


# === Endpoint CRUD Trips ===
@app.post("/api/v1/trips", response_model=schemas.TripResponse, status_code=status.HTTP_201_CREATED)
def create_trip(trip: schemas.TripCreate, db: Session = Depends(get_db)):
    """Menyimpan data perjalanan baru ke database."""
    category = get_trip_category(trip.budget)
    season = get_travel_season(trip.travel_month)
    daily_budget = calculate_daily_budget(trip.budget, trip.days)

    db_trip = models.Trip(
        destination=trip.destination,
        days=trip.days,
        budget=trip.budget,
        currency=trip.currency,
        travel_month=trip.travel_month,
        category=category,
        daily_budget=daily_budget,
        season=season
    )
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip


@app.get("/api/v1/trips", response_model=List[schemas.TripResponse])
def get_all_trips(db: Session = Depends(get_db)):
    """Mengambil semua daftar trip dari database."""
    return db.query(models.Trip).all()


# Endpoint PUT & DELETE ===

@app.put("/api/v1/trips/{trip_id}", response_model=schemas.TripResponse)
def update_trip_budget(trip_id: int, payload: schemas.TripUpdateBudget, db: Session = Depends(get_db)):
    """Memperbarui budget dan menghitung ulang category serta daily_budget."""
    trip = db.query(models.Trip).filter(models.Trip.id == trip_id).first()
    
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID {trip_id} not found"
        )

    # 1. Update budget baru
    trip.budget = payload.budget

    # 2. Recalculate nilai category dan daily_budget berdasarkan budget baru
    trip.category = get_trip_category(trip.budget)
    trip.daily_budget = calculate_daily_budget(trip.budget, trip.days)

    # 3. Simpan perubahan ke database
    db.commit()
    db.refresh(trip)
    return trip


@app.delete("/api/v1/trips/{trip_id}", status_code=status.HTTP_200_OK)
def delete_trip(trip_id: int, db: Session = Depends(get_db)):
    """Menghapus data trip berdasarkan ID."""
    trip = db.query(models.Trip).filter(models.Trip.id == trip_id).first()
    
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID {trip_id} not found"
        )

    db.delete(trip)
    db.commit()
    return {"message": f"Trip with ID {trip_id} successfully deleted"}


