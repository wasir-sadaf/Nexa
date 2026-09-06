from config.llm import llm
from graph.state import NexaState
from prompt.order_prompt import ORDER_PROMPT


MOCK_ORDERS = {
    1234: {
        "status": "shipped",
        "delivery_date": "September 8, 2026",
        "items": ["Wireless Mouse"],
    },
    5678: {
        "status": "processing",
        "delivery_date": "September 10, 2026",
        "items": ["Keyboard"],
    },
}


def order_agent(state: NexaState) -> dict:
    order_id = state.get("order_id")

    order = MOCK_ORDERS.get(order_id)

    if order is None:
        order_info = f"Order {order_id} was not found."
    else:
        order_info = str(order)

    response = llm.invoke(
        [
            ("system", ORDER_PROMPT),
            (
                "human",
                f"""
User request:
{state["messages"][-1].content}

Order ID:
{order_id}

Order information:
{order_info}
""",
            ),
        ]
    )

    return {
        "response": response.content,
    }