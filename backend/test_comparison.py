import os
import sys
import boto3
from dotenv import load_dotenv

# Memastikan direktori backend terdaftar dalam PATH Python
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.kb_service import ask_knowledge_base

load_dotenv()

AWS_REGION = os.getenv("AWS_REGION", "ap-southeast-2")
MODEL_ARN = os.getenv("KNOWLEDGE_BASE_MODEL_ARN")

# Client Bedrock Runtime untuk pemanggilan Base Model secara langsung
bedrock_runtime = boto3.client(
    service_name="bedrock-runtime",
    region_name=AWS_REGION,
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)

def ask_base_model(question: str) -> str:
    """
    Memanggil LLM secara langsung tanpa konteks Knowledge Base (Base Model Murni).
    """
    if not MODEL_ARN:
        raise ValueError("KNOWLEDGE_BASE_MODEL_ARN belum diatur di file .env")

    response = bedrock_runtime.converse(
        modelId=MODEL_ARN,
        messages=[
            {
                "role": "user",
                "content": [{"text": question}]
            }
        ],
        inferenceConfig={
            "maxTokens": 500,
            "temperature": 0.5
        }
    )
    return response["output"]["message"]["content"][0]["text"]

def run_comparison(question: str):
    """
    Menjalankan pengetesan komparasi dan mencetak output secara berdampingan.
    """
    print("\n" + "=" * 80)
    print(f"📌 PERTANYAAN: {question}")
    print("=" * 80)

    # 1. Eksekusi Base Model
    print("\n🤖 [1] BASE MODEL (Tanpa Dokumen Knowledge Base):")
    try:
        base_answer = ask_base_model(question)
        print(base_answer)
    except Exception as e:
        print(f"❌ Error Base Model: {e}")

    # 2. Eksekusi RAG System
    print("\n📚 [2] RAG SYSTEM (AWS Bedrock Knowledge Base + Context):")
    try:
        rag_result = ask_knowledge_base(question)
        print(rag_result["answer"])
        print(f"\n📎 Sumber Referensi: {rag_result.get('sources', [])}")
    except Exception as e:
        print(f"❌ Error RAG System: {e}")

    print("=" * 80 + "\n")

if __name__ == "__main__":
    # Daftar pertanyaan pengujian komparasi
    test_questions = [
        "Penyajian makanan Jepang yang halal seperti apa?",
        "Berapa batas pembebasan bea cukai & registrasi IMEI?",
        "Bagaimana cara pakai QRIS Antarnegara di Thailand & Malaysia?"
    ]

    print("🚀 MEMULAI PENGUJIAN KOMPARASI: BASE MODEL VS RAG SYSTEM\n")
    for q in test_questions:
        run_comparison(q)