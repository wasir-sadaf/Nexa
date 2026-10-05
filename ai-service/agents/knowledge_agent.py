from pathlib import Path


from config.llm import llm
from graph.state import NexaState
from prompt.knowledge_prompt import KNOWLEDGE_PROMPT




KNOWLEDGE_BASE_PATH = (
        Path(__file__).resolve().parent.parent
        / "knowledge"
        / "knowledge_base.md"
)




def load_knowledge_base() -> str:
    return KNOWLEDGE_BASE_PATH.read_text(encoding="utf-8")




def knowledge_agent(state: NexaState) -> dict:
    user_message = state["messages"][-1].content


    knowledge_base = load_knowledge_base()


    response = llm.invoke(
        [
            ("system", KNOWLEDGE_PROMPT),
            (
                "human",
                f"""
Knowledge Base:


{knowledge_base}


Customer Question:
{user_message}


Answer the customer using only the information from the Knowledge Base.
Keep the answer clear and concise.
""",
            ),
        ]
    )


    return {
        "response": response.content,
        "needs_human": False,
    }

