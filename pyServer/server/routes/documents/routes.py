from flask import Blueprint, jsonify, request
import json
from werkzeug.utils import secure_filename
import os

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

    data = request.get_json()

    if "files[]" not in request.files:
        return "No file part", 400

    files = request.files.getlist("files[]")

    if not files or files[0].filename == "":
        return "No selected file", 400

    for file in files:
        if file.filename:
            filename = secure_filename(file.filename)  # make sure the filename is safe
            file_path = os.path.join(save_temp_folder, filename)
            file.save(file_path)  # save the file to your desired folder

            vector_store.add_documents(
                file_path, filename
            )  # pass the file path instead of the file object
            os.remove(file_path)  # delete the file once it has been added

    collection = vector_store.get_collection(data.collection_name)
    documents = vector_store.get_documents(collection)

    return json.dumps(documents)


@documents.route("/documents/<id>", methods=["DELETE"])
def delete_document_route(id):
    result = delete_document(id)
    return jsonify(result)
