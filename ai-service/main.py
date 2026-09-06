from langchain_core.messages import HumanMessage

from graph.workflow import graph


def main():
    state = {
        "messages": [
            HumanMessage(content="I want to speak to a human support agent")
        ],
        "user_id": 1,
        "conversation_id": 1,
    }

    result = graph.invoke(state)

    print("Intent:", result["intent"])
    print("Selected Agent:", result["selected_agent"])
    print("Order ID:", result["order_id"])
    print("Response:", result["response"])


if __name__ == "__main__":
    main()