import queue
import threading
from flask import Blueprint, jsonify, request, Response
from server.services.vector_store import VectorStore
from chromadb.api.models.Collection import Collection
from .service import CollectionService
import json
from typing import List

collections = Blueprint("collections", __name__)

collecion_service = CollectionService()


@collections.route("/collections", methods=["GET"])
def get_collections_route():
    collection_name = request.args.get("collectionName")

    return json.dumps(collecion_service.get_collection(collection_name))


@collections.route("/collections", methods=["POST"])
def post_collections_route():
    data = request.get_json()
    collection_name = data.get("collectionName")

    if not collection_name:
        return jsonify({"error": "collectionName is required"})

    return json.dumps(collecion_service.create_collection(collection_name))


@collections.route("/collections/<collection_name>", methods=["DELETE"])
def delete_collection_route(collection_name):
    if not collection_name:
        return jsonify({"error": "collectionName is required"})

    return json.dumps(collecion_service.delete_collection(collection_name))


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
