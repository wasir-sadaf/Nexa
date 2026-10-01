import requests


BACKEND_URL = "http://localhost:8080"


def get_order_status(order_id: int) -> dict:
    response = requests.get(
        f"{BACKEND_URL}/api/orders/{order_id}",
        timeout=10,
    )

    if response.status_code == 404:
        return {
            "found": False,
            "order_id": order_id,
        }

    response.raise_for_status()

    order = response.json()

    return {
        "found": True,
        "order_id": order["id"],
        "status": order["status"],
        "total_amount": order["totalAmount"],
        "created_at": order["createdAt"],
    }

def cancel_order(order_id: int) -> dict:
    response = requests.put(
        f"{BACKEND_URL}/api/orders/{order_id}/cancel",
        timeout=10,
    )

    if response.status_code == 404:
        return {
            "success": False,
            "order_id": order_id,
            "message": "Order not found.",
        }

    if response.status_code == 500:
        return {
            "success": False,
            "order_id": order_id,
            "message": response.json().get("message", "Order cannot be cancelled."),
        }

    response.raise_for_status()

    order = response.json()

    return {
        "success": True,
        "order_id": order["id"],
        "status": order["status"],
    }