from config.llm import llm
from graph.state import NexaState
from prompt.order_prompt import ORDER_PROMPT
from tools.order_tools import get_order_status, cancel_order


def order_agent(state: NexaState) -> dict:
    order_id = state.get("order_id")
    intent = state.get("intent")

    if order_id is None:
        return {
            "response": "Sure. Please provide your order ID.",
            "needs_human": False,
        }

    if intent == "Order cancellation":
        result = cancel_order(order_id)

        if not result["success"]:
            return {
                "response": result["message"],
                "tool_results": result,
                "needs_human": False,
            }

        return {
            "response": f"Order {order_id} has been successfully cancelled.",
            "tool_results": result,
            "needs_human": False,
        }

    order = get_order_status(order_id)

    if not order["found"]:
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
        "tool_results": order,
        "needs_human": False,
    }