from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from google import genai
from google.genai import types
from typing import Optional
import json

app = FastAPI()

client = genai.Client(api_key="AIzaSyD8rSoK-THnzpNIE6ioGIk4JHmOFIzxv0A")

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
        You are an AI support agent for Nexa.
        Analyze the user's message: "{request.message}"
        
        Respond helpfully to the user in the 'response' field.
        Determine the 'intent' (e.g., 'password_reset', 'order_status', 'general').
        Set 'needs_human' to true ONLY if the user is highly frustrated or explicitly asks for a human agent.
        Extract any mentioned order ID into 'order_id' as an integer, or leave null.
        Set 'selected_agent' to 'ai_agent' (or 'human_support' if needs_human is true).
        """

        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=system_prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=AiResponse,
            ),
        )

        # Gemini returns a structured JSON string, parse it into the Pydantic model
        response_data = json.loads(response.text)
        return AiResponse(**response_data)

    except Exception as e:
        print(f"Error calling Gemini: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")