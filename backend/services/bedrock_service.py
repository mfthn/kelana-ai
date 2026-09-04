import os
import boto3
from dotenv import load_dotenv

load_dotenv()

client = boto3.client(
    service_name="bedrock-runtime",
    region_name=os.getenv("AWS_REGION", "ap-southeast-2")
)

def generate_travel_recommendation(destination: str, days: int, budget: float, currency: str, category: str) -> str:
    prompt = f"""You are an experienced travel planner.
Create a detailed {days}-day itinerary for {destination}.
Budget: {budget} {currency}
Travel Style/Category: {category}

Please provide:
- Daily itinerary with morning, afternoon, and evening activities
- Local food recommendations
- Transportation suggestions

Format your response nicely as Markdown with headers (##) and bullet lists (-)."""

    model_id = os.getenv("MODEL_ID", "amazon.nova-lite-v1:0")

    response = client.converse(
        modelId=model_id,
        messages=[
            {
                "role": "user",
                "content": [{"text": prompt}]
            }
        ]
    )

    return response["output"]["message"]["content"][0]["text"]


# ==========================================
# TAMBAHAN UNTUK SESI 10: CONVERSATION MEMORY
# ==========================================
def invoke_bedrock_with_history(history: list) -> str:
    """
    Menyusun ulang konteks percakapan dengan format API AWS Bedrock Converse 
    lalu meminta balasan dari AI.
    """
    
    formatted_messages = []
    
    # Looping seluruh riwayat pesan (dari object SQLAlchemy Message)
    for msg in history:
        formatted_messages.append({
            "role": msg.role, # Pastikan ini berisi 'user' atau 'assistant'
            "content": [{"text": msg.content}]
        })

    model_id = os.getenv("MODEL_ID", "amazon.nova-lite-v1:0")

    # AWS Bedrock akan melihat riwayat utuh sehingga bisa memahami konteks percakapan
    response = client.converse(
        modelId=model_id,
        messages=formatted_messages
    )

    # Mengembalikan teks jawaban dari AI
    return response["output"]["message"]["content"][0]["text"]