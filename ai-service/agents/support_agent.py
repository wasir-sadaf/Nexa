from config.llm import llm
from graph.state import NexaState
from prompt.support_prompt import SUPPORT_PROMPT


def support_agent(state: NexaState) -> dict:
    user_message = state["messages"][-1].content

    mock_ticket = {
        "ticket_id": 1001,
        "status": "open",
        "issue": user_message,
    }

    response = llm.invoke(
        [
            ("system", SUPPORT_PROMPT),
            (
                "human",
                f"""
User request:
{user_message}

Support ticket information:
{mock_ticket}
""",
            ),
        ]
    )

    return {
        "response": response.content,
        "tool_results": mock_ticket,
    }