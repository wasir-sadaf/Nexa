from fastapi import FastAPI
from pydantic import BaseModel
from langchain_core.messages import HumanMessage

from graph.workflow import graph


app = FastAPI(title="Nexa AI Service")


class ChatRequest(BaseModel):
    user_id: int
    conversation_id: int
    message: str


class ChatResponse(BaseModel):
    intent: str | None
    selected_agent: str | None
    order_id: int | None
    response: str | None
    needs_human: bool


@app.get("/health")
def health_check():
    return {"status": "AI service is running"}


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    state = {
        "messages": [
            HumanMessage(content=request.message)
        ],
        "user_id": request.user_id,
        "conversation_id": request.conversation_id,
        "needs_human": False,
    }

    result = graph.invoke(state)

    return ChatResponse(
        intent=result.get("intent"),
        selected_agent=result.get("selected_agent"),
        order_id=result.get("order_id"),
        response=result.get("response"),
        needs_human=result.get("needs_human", False),
    )