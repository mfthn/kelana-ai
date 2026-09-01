import os
import boto3
from dotenv import load_dotenv

load_dotenv()

AWS_REGION = os.getenv("AWS_REGION", "ap-southeast-2")
KNOWLEDGE_BASE_ID = os.getenv("KNOWLEDGE_BASE_ID")
MODEL_ARN = os.getenv("KNOWLEDGE_BASE_MODEL_ARN")

# Client Bedrock Agent Runtime (Untuk RAG Retrieval)
bedrock_agent_runtime = boto3.client(
    service_name="bedrock-agent-runtime",
    region_name=AWS_REGION,
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)

# Client Bedrock Runtime (Untuk Inference Model LLM)
bedrock_runtime = boto3.client(
    service_name="bedrock-runtime",
    region_name=AWS_REGION,
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)

def ask_knowledge_base(question: str) -> dict:
    if not KNOWLEDGE_BASE_ID:
        raise ValueError("KNOWLEDGE_BASE_ID belum diatur di file .env")

    try:
        # Step 1: Retrieve context & sources dari Knowledge Base
        retrieval_response = bedrock_agent_runtime.retrieve(
            knowledgeBaseId=KNOWLEDGE_BASE_ID,
            retrievalQuery={'text': question}
        )

        results = retrieval_response.get("retrievalResults", [])
        
        contexts = []
        sources = set()

        for item in results:
            content = item.get("content", {}).get("text", "")
            if content:
                contexts.append(content)
            
            # Ekstrak nama file sumber dari S3 URI
            location = item.get("location", {})
            if location.get("type") == "S3":
                s3_uri = location.get("s3Location", {}).get("uri", "")
                filename = s3_uri.split("/")[-1]
                if filename:
                    sources.add(filename)

        context_str = "\n\n".join(contexts) if contexts else "Tidak ada dokumen spesifik yang ditemukan."

        # Step 2: Susun Prompt
        prompt = f"""Anda adalah Asisten Perjalanan KelanaAI yang ramah dan informatif.
Jawab pertanyaan pengguna berdasarkan konteks dari basis pengetahuan berikut.

[Konteks Basis Pengetahuan]
{context_str}

[Pertanyaan Pengguna]
{question}

Berikan jawaban yang ringkas, jelas, dan akurat berdasarkan konteks di atas. Jika konteks tidak memuat jawaban lengkap, berikan penjelasan umum yang relevan dan sopan."""

        # Step 3: Eksekusi LLM menggunakan Converse API (Unified Multi-Model)
        response = bedrock_runtime.converse(
            modelId=MODEL_ARN,
            messages=[
                {
                    "role": "user",
                    "content": [{"text": prompt}]
                }
            ],
            inferenceConfig={
                "maxTokens": 500,
                "temperature": 0.5
            }
        )

        # Ekstrak teks balasan dari struktur respons Converse API
        answer = response["output"]["message"]["content"][0]["text"]

        return {
            "answer": answer,
            "sources": list(sources)
        }

    except Exception as e:
        raise RuntimeError(f"Gagal menghubungi AWS Bedrock Knowledge Base: {str(e)}")