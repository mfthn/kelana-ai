from typing import List
from fastapi import FastAPI

app = FastAPI(
    title="KelanaAI API",
    description="Backend REST API untuk layanan perjalanan KelanaAI",
    version="0.1.0"
)


@app.get("/")
def read_root():
    return {"message": "Welcome to KelanaAI API"}


@app.get("/api/v1/recommendations", response_model=List[str])
def get_recommendations():
    """Mengembalikan daftar rekomendasi tempat wisata."""
    return ["Tokyo Tower", "Mount Fuji", "Shibuya"]


@app.get("/api/v1/transportations", response_model=List[str])
def get_transportations():
    """Mengembalikan daftar pilihan moda transportasi."""
    return ["Bus", "Train", "Flight"]