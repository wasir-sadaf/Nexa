from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from google import genai
from typing import Optional

app = FastAPI()

# Initialize the new Google GenAI Client
client = genai.Client(api_key="YOUR_GEMINI_API_KEY")
class AiRequest(BaseModel):
    user_id: int
    conversation_id: int
    message: str

class AiResponse(BaseModel):
    intent: str
    selected_agent: str
    order_id: Optional[int]
    response: str
    needs_human: bool

@app.post("/chat", response_model=AiResponse)
async def chat_endpoint(request: AiRequest):
    try:
        system_prompt = f"""
        You are an AI support agent for Nexa. A user says: "{request.message}"
        Respond helpfully and concisely.
        """

        # Call Gemini using the new SDK syntax
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=system_prompt,
        )

        return AiResponse(
            intent="general_support",
            selected_agent="ai_agent",
            order_id=None,
            response=response.text,
            needs_human=False
        )

    except Exception as e:
        print(f"Error calling Gemini: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")