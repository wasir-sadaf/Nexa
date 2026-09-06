from config.llm import llm
from graph.state import NexaState
from prompt.escalation_prompt import ESCALATION_PROMPT


def escalation_agent(state: NexaState) -> dict:
    user_message = state["messages"][-1].content

    response = llm.invoke(
        [
            ("system", ESCALATION_PROMPT),
            (
                "human",
                f"""
User request:
{user_message}
""",
            ),
        ]
    )

    return {
        "response": response.content,
        "needs_human": True,
    }