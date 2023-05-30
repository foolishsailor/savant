from flask_socketio import SocketIO, emit
from server.services.vector_store import VectorStore

socketio = SocketIO()

vector_store = VectorStore()


@socketio.on("ask_question", namespace="/openai")
def handle_ask_question(json):
    question = json.get("question")
    model_name = json.get("model")
    system_prompt = json.get("systemPrompt")
    query_type = json.get("queryType")
    temperature = json.get("temperature")
    collection_name = json.get("collectionName")

    def stream_callback(token):
        emit("my_response", {"data": token}, namespace="/openai")

    vector_store.ask_question(
        question,
        model_name,
        system_prompt,
        query_type,
        temperature,
        collection_name,
        stream_callback,
    )


# @socketio.on('stop_question', namespace='/openai')
# def handle_stop_question(json):
#     vector_store.stop_question()
