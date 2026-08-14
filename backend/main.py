import sys
from pathlib import Path

# Memastikan modul services dapat diimpor dengan aman
sys.path.append(str(Path(__file__).resolve().parent))

from services.trip_service import (
    get_trip_category,
    get_travel_season,
    calculate_daily_budget,
    get_recommended_places
)


def print_trip_summary(destination, days, budget, currency, travel_month):
    """Menampilkan hasil ringkasan perjalanan menggunakan f-strings dan looping."""
    # Memanggil logika bisnis dari services
    category = get_trip_category(budget)
    season = get_travel_season(travel_month)
    daily_budget = calculate_daily_budget(budget, days)
    places = get_recommended_places(destination)

    # Format angka agar tidak menampilkan desimal jika berupa bilangan bulat
    formatted_budget = int(budget) if budget.is_integer() else budget
    formatted_daily_budget = int(daily_budget) if daily_budget.is_integer() else round(daily_budget, 2)

    print("==================================")
    print("KelanaAI")
    print("==================================")
    print(f"Destination   : {destination}")
    print(f"Days          : {days}")
    print(f"Budget        : {formatted_budget} {currency}")
    print(f"Category      : {category}")
    print(f"Daily Budget  : {formatted_daily_budget} {currency}/Day")
    print(f"Travel Month  : {travel_month}")
    print(f"Season        : {season}")
    print()
    print("Recommended Places")
    
    # Melakukan iterasi menggunakan for loop
    for place in places:
        print(f"- {place}")


def main():
    print("=== Masukkan Detail Perjalanan ===")
    destination = input("Destination  : ")
    days = int(input("Days         : "))
    budget = float(input("Budget       : "))
    currency = input("Currency     : ")
    travel_month = input("Travel Month : ")
    
    print()
    print_trip_summary(destination, days, budget, currency, travel_month)


if __name__ == "__main__":
    main()