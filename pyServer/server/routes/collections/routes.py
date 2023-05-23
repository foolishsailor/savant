import queue
import threading
from flask import Blueprint, jsonify, request, Response
from server.services.vector_store import VectorStore
from chromadb.api.models.Collection import Collection
from .service import get_collections, create_collection, delete_collection
import json
from typing import List

collections = Blueprint("collections", __name__)


@collections.route("/collections", methods=["GET"])
def get_collections_route():
    vector_store = VectorStore()
    collection_name = request.args.get("collectionName")
    collections: List[Collection] = []

    if collection_name:
        vector_store.set_create_chroma_store(collection_name)
        collection = vector_store.get_collection(collection_name)
        collections = [collection] if collection else []
    else:
        collections = vector_store.list_collections()

    result = [
        {"name": collection.name, "metadata": collection.metadata}
        for collection in collections
    ]

    return json.dumps(result)


@collections.route("/collections", methods=["POST"])
def post_collections_route():
    vector_store = VectorStore()
    data = request.get_json()
    collection_name = data.get("collectionName")

    if not collection_name:
        return jsonify({"error": "collectionName is required"})

    new_result = vector_store.create_collection(collection_name)

    if not new_result:
        return jsonify({"error": "Error creating collection"})

    collections = vector_store.list_collections()

    result = [
        {"name": collection.name, "metadata": collection.metadata}
        for collection in collections
    ]

    return json.dumps(result)


@collections.route("/collections/<name>", methods=["DELETE"])
def delete_collection_route(name):
    result = delete_collection(name)
    return jsonify(result)


@collections.route("/question", methods=["POST"])
def question_route():
    data = request.get_json()
    question = data.get("question")
    system_prompt = data.get("systemPrompt")
    query_type = data.get("queryType")
    temperature = data.get("temperature")

    vector_store = VectorStore()

    q = queue.Queue()

    def stream_callback(token):
        q.put(token)

    def generate():
        while True:
            token = q.get()  # This will block until a new item is available.
            if token is None:
                break
            yield token

    threading.Thread(
        target=lambda: vector_store.ask_question(
            question, system_prompt, query_type, temperature, stream_callback
        )
    ).start()

    return Response(generate(), mimetype="application/json")
