# ✈️ KelanaAI - Smart Travel Planner & AI Assistant

**KelanaAI** adalah platform perencana perjalanan cerdas berbasis AI yang membantu pengguna merencanakan *itinerary* liburan secara otomatis serta menyediakan asisten AI interaktif untuk menjawab pertanyaan seputar operasional perjalanan (seperti aturan bea cukai, transaksi QRIS antarnegara, hingga panduan kuliner halal).

---

## 🛠️ Tech Stack

### **Frontend**
* **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **UI Components**: Custom Reusable Components

### **Backend**
* **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
* **Database & ORM**: SQLAlchemy & PostgreSQL / SQLite
* **AI & RAG Engine**: AWS Bedrock (LLM & Knowledge Base RAG)
* **Authentication**: JWT (JSON Web Tokens) & Passlib (Bcrypt)

---

## 📁 Struktur Repositori (Monorepo)

```text
kelana-ai/
├── backend/                  # REST API Service (FastAPI)
│   ├── services/             # Logic Service (Bedrock, KB, Trip)
│   ├── auth.py               # Autentikasi & Handling JWT
│   ├── database.py           # Koneksi Database
│   ├── main.py               # Entry Point FastAPI
│   ├── models.py             # Tabel DB (SQLAlchemy)
│   ├── schemas.py            # Validasi Data (Pydantic)
│   ├── .env                  # Environment Variables Backend
│   └── requirements.txt      # Dependensi Python
│
├── frontend/                 # User Interface (Next.js)
│   ├── app/                  # Next.js App Router Pages
│   │   ├── assistant/        # Halaman AI Assistant Chat
│   │   ├── generate/         # Form Generator Itinerary
│   │   ├── trips/            # Daftar & Detail Trip Pengguna
│   │   ├── login/            # Halaman Masuk
│   │   └── register/         # Halaman Pendaftaran
│   ├── components/           # Komponen UI Reusable (Navbar, Card, dll)
│   ├── services/             # Handler Pemanggilan API Backend
│   └── public/               # Aset Statis (Gambar, SVG, Logo)
│
├── .gitignore                # Aturan Ignore Git Root
└── README.md                 # Dokumentasi Proyek

## ✨ Fitur Utama

1. **Perencana Trip Cerdas (`/generate`)**: Membuat rekomendasi *itinerary* perjalanan otomatis berdasarkan destinasi, durasi, dan preferensi budget pengguna.
2. **Asisten AI Perjalanan (`/assistant`)**: Chatbot RAG terverifikasi yang terhubung ke AWS Bedrock Knowledge Base untuk menjawab pertanyaan seputar dokumen, regulasi, dan tips perjalanan.
3. **Riwayat & Manajemen Trip (`/trips`)**: Menyimpan dan mengelola seluruh rencana perjalanan yang telah dibuat oleh pengguna yang sedang login.
4. **Sistem Pengguna (`/login` & `/register`)**: Autentikasi aman berbasis JWT untuk menjaga isolasi data *trip* masing-masing pengguna.

---
---

## ?? Perbandingan RAG System vs Base Model

Berikut adalah evaluasi perbandingan kualitas jawaban antara sistem **RAG (KelanaAI)** yang terhubung ke Knowledge Base AWS Bedrock dengan **Base Model (LLM Murni)** tanpa konteks dokumen.

![Perbandingan RAG vs Base Model](./assets/rag-vs-basemodel.png)

### ?? Ringkasan Hasil Evaluasi

| Parameter Evaluasi | Base Model (LLM Murni) | RAG System (KelanaAI) |
| :--- | :--- | :--- |
| **Konteks Dokumen Internal** | ? Tidak memiliki akses ke dokumen lokal | ? Terhubung ke dokumen internal di AWS S3 |
| **Presisi Informasi** | General (Jawaban umum/standar) | Spesifik sesuai aturan & panduan lokal |
| **Sitasi & Sumber Referensi** | ? Tidak menyediakan rujukan | ? Menampilkan sumber file (.md / .pdf) |
| **Risiko Halusinasi Teks** | Sedang - Tinggi (Cenderung berasumsi) | Rendah (Tersaring oleh *retrieval context*) |

> **Kesimpulan:** Penggunaan arsitektur RAG pada KelanaAI secara signifikan meningkatkan presisi jawaban operasional perjalanan (seperti bea cukai, QRIS, dan panduan halal) serta menghilangkan risiko informasi palsu dengan menyertakan bukti sumber dokumen rujukan.
