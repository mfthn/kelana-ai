def print_trip_summary(destination, country, days, budget, currency, travel_month):
    """Membungkus logika pencetakan ringkasan perjalanan menggunakan f-strings."""
    print("==================")
    print("KelanaAI")
    print("==================")
    
    # Format budget agar angka bulat tidak menampilkan desimal .0 (contoh: 1500 bukan 1500.0)
    formatted_budget = int(budget) if budget.is_integer() else budget
    
    print(f"Destination : {destination}")
    print(f"Country : {country}")
    print(f"Days : {days}")
    print(f"Budget : {formatted_budget} {currency}")
    print(f"Currency : {currency}")
    print(f"Travel Month : {travel_month}")


def main():
    print("=== Masukkan Detail Perjalanan ===")
    
    # Input interaktif sesuai tipe data
    destination = input("Destination : ")
    country = input("Country : ")
    days = int(input("Days : "))  # Konversi tipe data ke int
    budget = float(input("Budget : "))  # Konversi tipe data ke float
    currency = input("Currency : ")
    travel_month = input("Travel Month : ")
    
    print()  # Baris kosong pemisah
    
    # Memanggil fungsi cetak
    print_trip_summary(destination, country, days, budget, currency, travel_month)


if __name__ == "__main__":
    main()