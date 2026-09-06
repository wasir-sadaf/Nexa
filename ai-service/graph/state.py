from typing import Optional

from langgraph.graph import MessagesState


class NexaState(MessagesState):
    user_id: int
    conversation_id: int

    intent: Optional[str]
    selected_agent: Optional[str]

    order_id: Optional[int]

    tool_results: Optional[dict]

    response: Optional[str]

    needs_human: bool