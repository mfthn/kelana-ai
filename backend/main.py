import sys
from pathlib import Path
from typing import List

from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session

sys.path.append(str(Path(__file__).resolve().parent))

import models
import schemas
from database import engine, get_db
from services.trip_service import (
    get_trip_category,
    get_travel_season,
    calculate_daily_budget
)
from services.bedrock_service import generate_travel_recommendation

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="KelanaAI API",
    description="Backend REST API with Amazon Bedrock integration",
    version="0.2.0"
)

# --- static recommendations ---
@app.get("/api/v1/recommendations", response_model=List[str])
def get_recommendations():
    return ["Tokyo Tower", "Mount Fuji", "Shibuya"]

@app.get("/api/v1/transportations", response_model=List[str])
def get_transportations():
    return ["Bus", "Train", "Flight"]

# --- trip CRUD ---
@app.post("/api/v1/trips", response_model=schemas.TripResponse, status_code=status.HTTP_201_CREATED)
def create_trip(trip: schemas.TripCreate, db: Session = Depends(get_db)):
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
    return db.query(models.Trip).all()

@app.get("/api/v1/trips/{trip_id}", response_model=schemas.TripResponse)
def get_trip(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(models.Trip).filter(models.Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Trip with ID {trip_id} not found")
    return trip

@app.put("/api/v1/trips/{trip_id}", response_model=schemas.TripResponse)
def update_trip_budget(trip_id: int, payload: schemas.TripUpdateBudget, db: Session = Depends(get_db)):
    trip = db.query(models.Trip).filter(models.Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Trip with ID {trip_id} not found")

    trip.budget = payload.budget
    # recalculate business rules
    trip.category = get_trip_category(trip.budget)
    trip.daily_budget = calculate_daily_budget(trip.budget, trip.days)
    
    db.commit()
    db.refresh(trip)
    return trip

@app.delete("/api/v1/trips/{trip_id}", status_code=status.HTTP_200_OK)
def delete_trip(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(models.Trip).filter(models.Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Trip with ID {trip_id} not found")
    db.delete(trip)
    db.commit()
    return {"message": f"Trip with ID {trip_id} successfully deleted"}

# --- AI itinerary generation ---
@app.post("/api/v1/trips/{trip_id}/generate")
def generate_trip_plan(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(models.Trip).filter(models.Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Trip with ID {trip_id} not found")

    ai_output = generate_travel_recommendation(
        destination=trip.destination,
        days=trip.days,
        budget=trip.budget,
        currency=trip.currency,
        category=trip.category
    )

    # cache recommendation to database
    trip.ai_recommendation = ai_output
    db.commit()
    db.refresh(trip)

    return {
        "trip_id": trip.id,
        "destination": trip.destination,
        "recommendation": trip.ai_recommendation
    }
