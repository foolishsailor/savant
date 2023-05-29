import queue
import threading
from flask import (
    stream_with_context,
    Blueprint,
    jsonify,
    request,
    Response,
    make_response,
)
from server.services.vector_store import VectorStore

from .service import CollectionService
import json


collections = Blueprint("collections", __name__)

collection_service = CollectionService()


@collections.route("/collections", methods=["GET"])
def get_collections_route():
    collection_name = request.args.get("collectionName")

    return json.dumps(
        collection_service.get_collection(str(collection_name))
        if collection_name is not None
        else collection_service.get_collection()
    )


@collections.route("/collections", methods=["POST"])
def post_collections_route():
    data = request.get_json()
    collection_name = data.get("collectionName")

    if not collection_name:
        return jsonify({"error": "collectionName is required"})

    return json.dumps(collection_service.create_collection(collection_name))


@collections.route("/collections/<collection_name>", methods=["DELETE"])
def delete_collection_route(collection_name):
    print("DELETE collection_name: ", collection_name)
    if not collection_name:
        return jsonify({"error": "collectionName is required"})

    return json.dumps(collection_service.delete_collection(collection_name))


@collections.route("/collections/question", methods=["POST"])
def question_route():
    data = request.get_json()
    question = data.get("question")
    model_name = data.get("model")
    system_prompt = data.get("systemPrompt")
    query_type = data.get("queryType")
    temperature = data.get("temperature")
    collection_name = data.get("collectionName")
    vector_store = VectorStore()
    q = queue.Queue()

    def stream_callback(token):
        q.put(token)

    def generate():
        while True:
            token: str = q.get()  # This will block until a new item is available.
            if token is None:
                break
            yield token  # Serialize individual item

    threading.Thread(
        target=lambda: vector_store.ask_question(
            question,
            model_name,
            system_prompt,
            query_type,
            temperature,
            collection_name,
            stream_callback,
        )
    ).start()

    return Response(stream_with_context(generate()), mimetype="application/json")
