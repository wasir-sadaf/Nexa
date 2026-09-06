from typing import Optional

from pydantic import BaseModel, Field

from config.llm import llm
from graph.state import NexaState
from prompt.supervisor_prompt import SUPERVISOR_PROMPT


class SupervisorDecision(BaseModel):
    intent: str = Field(
        description="The primary intent of the user's request."
    )

    selected_agent: str = Field(
        description=(
            "The agent that should handle the request. "
            "Must be one of: order_agent, support_agent, "
            "knowledge_agent, escalation_agent."
        )
    )

    order_id: Optional[int] = Field(
        default=None,
        description="The order ID mentioned by the user, if any."
    )


supervisor_llm = llm.with_structured_output(SupervisorDecision)


def supervisor_agent(state: NexaState) -> dict:
    response = supervisor_llm.invoke(
        [
            (
                "system",
                SUPERVISOR_PROMPT
            ),
            (
                "human",
                state["messages"][-1].content
            ),
        ]
    )

    return {
        "intent": response.intent,
        "selected_agent": response.selected_agent,
        "order_id": response.order_id,
    }