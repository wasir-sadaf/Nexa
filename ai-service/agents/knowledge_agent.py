from config.llm import llm
from graph.state import NexaState
from prompt.knowledge_prompt import KNOWLEDGE_PROMPT


KNOWLEDGE_BASE = {
    "refund": "Customers can request a refund within 30 days of receiving an order.",
    "return": "Customers can return eligible products within 30 days of delivery.",
    "shipping": "Standard shipping usually takes 3-5 business days.",
}


def knowledge_agent(state: NexaState) -> dict:
    user_message = state["messages"][-1].content

    knowledge = "\n".join(
        f"- {key}: {value}"
        for key, value in KNOWLEDGE_BASE.items()
    )

    response = llm.invoke(
        [
            ("system", KNOWLEDGE_PROMPT),
            (
                "human",
                f"""
User request:
{user_message}

Knowledge base:
{knowledge}
""",
            ),
        ]
    )

    return {
        "response": response.content,
        "tool_results": {
            "knowledge": knowledge
        },
    }