from flask import Blueprint, jsonify, request
from server.services.vector_store import VectorStore
from chromadb.api.models.Collection import Collection
from .service import get_collections, create_collection, delete_collection

from typing import List

collections = Blueprint("collections", __name__)


@collections.route("/collections", methods=["GET"])
def get_collections_route():
    vector_store = VectorStore()
    collection_name = request.args.get("collectionName")
    collections: List[Collection] = []

    if collection_name:
        vector_store.setCreateChromaStore(collection_name)
        collection = vector_store.getCollection(collection_name)
        collections = [collection] if collection else []
    else:
        collections = vector_store.listCollections()

    return jsonify(collections)


@collections.route("/collections", methods=["POST"])
def post_collections_route():
    data = request.get_json()
    result = create_collection(data)
    return jsonify(result)


@collections.route("/collections/<name>", methods=["DELETE"])
def delete_collection_route(name):
    result = delete_collection(name)
    return jsonify(result)
