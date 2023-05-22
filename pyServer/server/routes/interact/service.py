from server.services.vector_store import VectorStore


def ask_question(data):
    vector_store = VectorStore()
    vector_store.ask_question(data)
    print(data)
    return "This is the answer to your question."
