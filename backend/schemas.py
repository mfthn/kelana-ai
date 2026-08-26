from typing import Optional
from pydantic import BaseModel


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
    category: str
    daily_budget: float
    season: str
    ai_recommendation: Optional[str] = None  

    class Config:
        from_attributes = True