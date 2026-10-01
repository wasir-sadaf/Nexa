from config.llm import llm
from graph.state import NexaState
from prompt.support_prompt import SUPPORT_PROMPT
from tools.support_tools import (
    create_support_ticket,
    get_support_ticket,
)


def support_agent(state: NexaState) -> dict:
    user_message = state["messages"][-1].content

    user_id = state["user_id"]
    conversation_id = state["conversation_id"]
    ticket_id = state.get("ticket_id")
    intent = state.get("intent", "").lower()

    # Check an existing ticket
    if ticket_id is not None or "ticket" in intent and (
        "status" in intent
        or "check" in intent
        or "track" in intent
    ):
        if ticket_id is None:
            return {
                "response": "Sure. Please provide your ticket ID.",
                "needs_human": False,
            }

        result = get_support_ticket(ticket_id)

        if not result["found"]:
            return {
                "response": f"Support ticket {ticket_id} was not found.",
                "tool_results": result,
                "needs_human": False,
            }

        return {
            "response": (
                f"Ticket #{ticket_id} is currently {result['status']}. "
                f"Subject: {result['subject']}. "
                f"Priority: {result['priority']}."
            ),
            "tool_results": result,
            "needs_human": False,
        }

    # Create a new support ticket
    response = llm.invoke(
        [
            ("system", SUPPORT_PROMPT),
            (
                "human",
                f"""
User request:
{user_message}

Create a support ticket for this request.

Return exactly:
SUBJECT: <short subject>
DESCRIPTION: <clear description>
PRIORITY: <LOW, MEDIUM, or HIGH>
""",
            ),
        ]
    )

    content = response.content

    subject = ""
    description = ""
    priority = "MEDIUM"

    for line in content.splitlines():
        if line.startswith("SUBJECT:"):
            subject = line.replace("SUBJECT:", "", 1).strip()

        elif line.startswith("DESCRIPTION:"):
            description = line.replace("DESCRIPTION:", "", 1).strip()

        elif line.startswith("PRIORITY:"):
            priority = line.replace("PRIORITY:", "", 1).strip().upper()

    if not subject:
        subject = "Customer support request"

    if not description:
        description = user_message

    if priority not in {"LOW", "MEDIUM", "HIGH"}:
        priority = "MEDIUM"

    result = create_support_ticket(
        user_id=user_id,
        conversation_id=conversation_id,
        subject=subject,
        description=description,
        priority=priority,
    )

    return {
        "response": f"Support ticket #{result['ticket_id']} has been created successfully.",
        "tool_results": result,
        "needs_human": False,
    }