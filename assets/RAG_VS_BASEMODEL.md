# 📊 Perbandingan RAG System vs Base Model

Berikut adalah evaluasi perbandingan kualitas jawaban antara sistem **RAG (KelanaAI)** yang terhubung ke Knowledge Base AWS Bedrock dengan **Base Model (LLM Murni)** tanpa konteks dokumen.

![Perbandingan RAG vs Base Model 1](/assets/rag_vs_basemodel_1.png)

![Perbandingan RAG vs Base Model 2](/assets/rag_vs_basemodel_2.png)

---

### 🔍 Ringkasan Hasil Evaluasi

| Parameter Evaluasi | Base Model (LLM Murni) | RAG System (KelanaAI) |
| :--- | :--- | :--- |
| **Konteks Dokumen Internal** | ❌ Tidak memiliki akses ke dokumen lokal | ✅ Terhubung ke dokumen internal di AWS S3 |
| **Presisi Informasi** | General (Jawaban umum/standar) | Spesifik sesuai aturan & panduan lokal |
| **Sitasi & Sumber Referensi** | ❌ Tidak menyediakan rujukan | ✅ Menampilkan sumber file (`.md` / `.pdf`) |
| **Risiko Halusinasi Teks** | Sedang - Tinggi (Cenderung berasumsi) | Rendah (Tersaring oleh *retrieval context*) |

---

> **Kesimpulan:** Penggunaan arsitektur RAG pada KelanaAI secara signifikan meningkatkan presisi jawaban operasional perjalanan (seperti bea cukai, QRIS, dan panduan halal) serta menghilangkan risiko informasi palsu dengan menyertakan bukti sumber dokumen rujukan.