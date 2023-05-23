from flask import Blueprint, jsonify, request
import json
from werkzeug.utils import secure_filename
import os
from server.services.loaders import LoaderResult

from server.services.vector_store import VectorStore
from .service import get_documents, create_document, delete_document
from typing import List


documents = Blueprint("documents", __name__)


@documents.route("/documents", methods=["GET"])
def get_documents_route():
    result = get_documents()
    return jsonify(result)


@documents.route("/documents", methods=["POST"])
def post_documents_route():
    vector_store = VectorStore()
    save_temp_folder = "../save_temp_files"
    results: List[LoaderResult] = []

    data = request.get_json()

    if "files[]" not in request.files:
        return "No file part", 400

    files = request.files.getlist("files[]")

    if not files or files[0].filename == "":
        return "No selected file", 400

    for file in files:
        if file.filename:
            filename = secure_filename(file.filename)
            file_path = os.path.join(save_temp_folder, filename)
            file.save(file_path)

            results.append(vector_store.add_documents(file_path, filename))
            os.remove(file_path)

    collection = vector_store.get_collection(data.collection_name)
    documents = vector_store.get_documents(collection)

    return json.dumps(documents, errors=results.errors)


@documents.route("/documents/<id>", methods=["DELETE"])
def delete_document_route(id):
    result = delete_document(id)
    return jsonify(result)
