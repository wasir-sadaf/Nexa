from langgraph.graph import StateGraph, START, END

from agents.supervisor import supervisor_agent
from agents.order_agent import order_agent
from agents.support_agent import support_agent
from agents.knowledge_agent import knowledge_agent
from agents.escalation_agent import escalation_agent
from graph.state import NexaState


def route_from_supervisor(state: NexaState):
    return state["selected_agent"]


builder = StateGraph(NexaState)

builder.add_node("supervisor", supervisor_agent)
builder.add_node("order_agent", order_agent)
builder.add_node("support_agent", support_agent)
builder.add_node("knowledge_agent", knowledge_agent)
builder.add_node("escalation_agent", escalation_agent)

builder.add_edge(START, "supervisor")

builder.add_conditional_edges(
    "supervisor",
    route_from_supervisor,
    {
        "order_agent": "order_agent",
        "support_agent": "support_agent",
        "knowledge_agent": "knowledge_agent",
        "escalation_agent": "escalation_agent",
    },
)

builder.add_edge("order_agent", END)
builder.add_edge("support_agent", END)
builder.add_edge("knowledge_agent", END)
builder.add_edge("escalation_agent", END)

graph = builder.compile()