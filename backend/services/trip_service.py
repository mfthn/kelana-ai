import httpx

# Dictionary fallback jika API gagal atau dijalankan secara offline (Base: 1 USD)
DEFAULT_RATES_TO_USD = {
    "USD": 1.0,
    "IDR": 15500.0,
    "EUR": 0.92,
    "SGD": 1.35,
    "JPY": 150.0,
    "MYR": 4.40,
    "THB": 35.0,
    "KRW": 1330.0,
}


def get_realtime_exchange_rates() -> dict:
    """Mengambil kurs mata uang real-time dari API publik gratis (fallback ke static rates jika error)."""
    try:
        response = httpx.get(
            "https://api.exchangerate-api.com/v4/latest/USD", timeout=3.0
        )
        if response.status_code == 200:
            return response.json().get("rates", DEFAULT_RATES_TO_USD)
    except Exception:
        pass
    return DEFAULT_RATES_TO_USD


def get_trip_category(
    budget: float, currency: str = "IDR", use_realtime: bool = False
) -> str:
    """Menentukan kategori perjalanan berdasarkan anggaran dan mata uang (IDR, USD, EUR, JPY, SGD, MYR, THB, KRW)."""
    if budget <= 0:
        return "Invalid Budget"

    curr_upper = currency.strip().upper()
    rates = (
        get_realtime_exchange_rates() if use_realtime else DEFAULT_RATES_TO_USD
    )

    # Ambil nilai konversi ke USD
    rate = rates.get(curr_upper, rates.get("IDR", 15500.0))
    budget_usd = budget / rate

    if budget_usd < 500:
        return "Extreme Backpacker"
    elif 500 <= budget_usd < 1500:
        return "Backpacker / Budget"
    elif 1500 <= budget_usd < 3500:
        return "Standard / Mid-Range"
    elif 3500 <= budget_usd < 7000:
        return "Premium / Comfort"
    else:
        return "Luxury / VIP"


def get_travel_season(month: str) -> str:
    """Menentukan kategori musim berdasarkan bulan keberangkatan."""
    clean_month = month.strip().capitalize()

    peak_months = ["December", "January", "June", "July"]
    shoulder_months = ["April", "May", "August", "September", "October"]
    low_months = ["February", "March", "November"]

    if clean_month in peak_months:
        return "Peak Season"
    elif clean_month in shoulder_months:
        return "Shoulder Season"
    elif clean_month in low_months:
        return "Low / Saver Season"
    else:
        return "Regular Season"


def calculate_daily_budget(budget: float, days: int) -> float:
    """Menghitung pembagian anggaran harian."""
    if days <= 0 or budget <= 0:
        return 0.0
    return round(budget / days, 2)


def get_recommended_places(destination: str) -> list:
    """Menyimpan daftar tempat rekomendasi statis (dapat diintegrasikan dengan Bedrock KB untuk hasil AI dinamis)."""
    dest_lower = destination.strip().lower()

    recommendations = {
        "japan": [
            "Tokyo Tower",
            "Shibuya Crossing",
            "Mount Fuji",
            "Kyoto Fushimi Inari",
            "Universal Studios Japan",
        ],
        "indonesia": [
            "Bali (Ubud & Uluwatu)",
            "Labuan Bajo",
            "Candi Borobudur",
            "Taman Nasional Bromo",
            "Raja Ampat",
        ],
        "singapore": [
            "Marina Bay Sands",
            "Gardens by the Bay",
            "Sentosa Island",
            "Jewel Changi",
        ],
        "thailand": [
            "Grand Palace Bangkok",
            "Phi Phi Islands",
            "Chiang Mai Old City",
            "Ayutthaya Historical Park",
        ],
        "south korea": [
            "N Seoul Tower",
            "Gyeongbokgung Palace",
            "Jeju Island",
            "Myeongdong Shopping Street",
        ],
        "malaysia": [
            "Petronas Twin Towers",
            "Batu Caves",
            "Langkawi Cable Car",
            "Penang Heritage Trail",
        ],
        "eurozone": [
            "Eiffel Tower",
            "Colosseum Rome",
            "Louvre Museum",
            "Canals of Amsterdam",
        ],
    }

    return recommendations.get(
        dest_lower,
        [
            "Central City Landmark",
            "Historical Old Town",
            "Local Nature Park",
            "Cultural Heritage Museum",
        ],
    )