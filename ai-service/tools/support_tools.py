import requests

BACKEND_URL = "http://localhost:8080"


def create_support_ticket(
    user_id: int,
    conversation_id: int,
    subject: str,
    description: str,
    priority: str = "MEDIUM",
) -> dict:

    response = requests.post(
        f"{BACKEND_URL}/api/tickets/ai",
        json={
            "user_id": user_id,
            "conversation_id": conversation_id,
            "subject": subject,
            "description": description,
            "priority": priority,
        },
        timeout=10,
    )

    response.raise_for_status()

    ticket = response.json()

    return {
        "success": True,
        "ticket_id": ticket["id"],
        "subject": ticket["subject"],
        "priority": ticket["priority"],
        "status": ticket["status"],
    }


def get_support_ticket(ticket_id: int) -> dict:
    response = requests.get(
        f"{BACKEND_URL}/api/tickets/{ticket_id}",
        timeout=10,
    )

    if response.status_code == 404:
        return {
            "found": False,
            "ticket_id": ticket_id,
        }

    response.raise_for_status()

    ticket = response.json()

    return {
        "found": True,
        "ticket_id": ticket["id"],
        "subject": ticket["subject"],
        "description": ticket["description"],
        "priority": ticket["priority"],
        "status": ticket["status"],
    }


def escalate_support_ticket(ticket_id: int) -> dict:
    response = requests.put(
        f"{BACKEND_URL}/api/tickets/{ticket_id}/escalate",
        timeout=10,
    )

    if response.status_code == 404:
        return {
            "success": False,
            "ticket_id": ticket_id,
            "message": "Support ticket not found.",
        }

    if response.status_code == 500:
        try:
            message = response.json().get(
                "message",
                "Ticket cannot be escalated."
            )
        except ValueError:
            message = "Ticket cannot be escalated."

        return {
            "success": False,
            "ticket_id": ticket_id,
            "message": message,
        }

    response.raise_for_status()

    ticket = response.json()

    return {
        "success": True,
        "ticket_id": ticket["id"],
        "status": ticket["status"],
        "priority": ticket["priority"],
    }