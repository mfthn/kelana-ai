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