from socketio import AsyncServer
from server.services.vector_store import VectorStore

socketio = AsyncServer(async_mode="asgi")

vector_store = VectorStore()


@socketio.event
async def connect(sid, environ):
    print("Client connected")


@socketio.on("query_documents", namespace="/openai")
async def handle_ask_question(sid, json):
    question = json.get("question")
    model_name = json.get("model")
    system_prompt = json.get("systemPrompt")
    query_type = json.get("queryType")
    temperature = json.get("temperature")
    collection_name = json.get("collectionName")

    async def stream_callback(token):
        await socketio.emit(
            "query_document_stream", {"data": token}, namespace="/openai"
        )

    await vector_store.ask_question(
        question,
        model_name,
        system_prompt,
        query_type,
        temperature,
        collection_name,
        stream_callback,
    )


# @sio.on('stop_question', namespace='/openai')
# async def handle_stop_question(sid, json):
#     await vector_store.stop_question()
