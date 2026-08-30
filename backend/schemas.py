from typing import Optional
from pydantic import BaseModel, EmailStr

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