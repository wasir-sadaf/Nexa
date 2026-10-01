from graph.state import NexaState
from tools.support_tools import (
    create_support_ticket,
    escalate_support_ticket,
)


def escalation_agent(state: NexaState) -> dict:
    user_message = state["messages"][-1].content

    user_id = state["user_id"]
    conversation_id = state["conversation_id"]
    ticket_id = state.get("ticket_id")

    # Existing ticket
    if ticket_id is not None:
        result = escalate_support_ticket(ticket_id)

        if not result["success"]:
            return {
                "response": result["message"],
                "tool_results": result,
                "needs_human": False,
            }

        return {
            "ticket_id": ticket_id,
            "response": (
                f"Your support ticket #{ticket_id} has been escalated "
                f"to a human support agent."
            ),
            "tool_results": result,
            "needs_human": True,
        }

    # No existing ticket → create one first
    result = create_support_ticket(
        user_id=user_id,
        conversation_id=conversation_id,
        subject="Customer requested human support",
        description=user_message,
        priority="HIGH",
    )

    ticket_id = result["ticket_id"]

    escalation_result = escalate_support_ticket(ticket_id)

    if not escalation_result["success"]:
        return {
            "ticket_id": ticket_id,
            "response": (
                f"Support ticket #{ticket_id} was created, "
                "but I could not escalate it."
            ),
            "tool_results": {
                "ticket": result,
                "escalation": escalation_result,
            },
            "needs_human": False,
        }

    return {
        "ticket_id": ticket_id,
        "response": (
            f"Support ticket #{ticket_id} has been created and "
            "escalated to a human support agent."
        ),
        "tool_results": {
            "ticket": result,
            "escalation": escalation_result,
        },
        "needs_human": True,
    }