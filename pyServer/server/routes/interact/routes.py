from flask import Blueprint, jsonify, request, Response
import queue
import threading
from server.services.vector_store import VectorStore
from .service import ask_question

interact = Blueprint("interact", __name__)


@interact.route("/question", methods=["POST"])
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
