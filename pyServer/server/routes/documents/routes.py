from flask import Blueprint, jsonify, request
import json
import os
from typing import List

from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage
from server.services.loaders import LoaderResult
from server.services.vector_store import VectorStore

from .service import DocumentService

documents = Blueprint("documents", __name__)

document_service = DocumentService()


@documents.route("/documents", methods=["GET"])
def get_documents_route():
    collection_name = request.args.get("collectionName")

    if not collection_name:
        return jsonify({"error": "collectionName is required"})

    return json.dumps(document_service.get_documents(collection_name))


@documents.route("/documents", methods=["POST"])
def post_documents_route():
    if "collectionName" not in request.form:
        return jsonify({"error": "collectionName is required"}), 400

    collection_name = request.form["collectionName"]

    documents: List[FileStorage] = request.files.getlist("documents")

    if documents is None:
        return jsonify({"error": "no files attached"}), 400

    return json.dumps(document_service.add_documents(collection_name, documents))


@documents.route("/documents/<collection_name>", methods=["DELETE"])
def delete_document_route(collection_name):
    if not collection_name:
        return jsonify({"error": "collectionName is required"})

    return json.dumps(document_service.delete_documents(collection_name))
