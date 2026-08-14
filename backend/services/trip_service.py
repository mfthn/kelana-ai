def get_trip_category(budget: float) -> str:
    """Menentukan kategori perjalanan berdasarkan anggaran."""
    if budget < 1000:
        return "Backpacker"
    elif 1000 <= budget <= 3000:
        return "Standard"
    else:
        return "Luxury"


def get_travel_season(month: str) -> str:
    """Menentukan kategori musim berdasarkan bulan keberangkatan."""
    clean_month = month.strip().capitalize()
    if clean_month == "December":
        return "Peak Season"
    elif clean_month == "June":
        return "Holiday Season"
    else:
        return "Regular Season"


def calculate_daily_budget(budget: float, days: int) -> float:
    """Menghitung pembagian anggaran harian."""
    if days <= 0:
        return 0.0
    return budget / days


def get_recommended_places(destination: str) -> list:
    """Menyimpan daftar tempat rekomendasi dalam tipe data list."""
    dest_lower = destination.strip().lower()
    
    recommendations = {
        "japan": ["Tokyo Tower", "Shibuya", "Mount Fuji"],
        "indonesia": ["Bali", "Labuan Bajo", "Candi Borobudur"],
        "singapore": ["Marina Bay Sands", "Gardens by the Bay", "Sentosa Island"]
    }
    
    # Mengembalikan rekomendasi sesuai destinasi atau tempat umum jika tidak ada di daftar
    return recommendations.get(
        dest_lower, 
        ["Central City Landmark", "Historical Old Town", "Local Nature Park"]
    )