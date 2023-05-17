from flask import Blueprint, jsonify, request
from .service import get_collections, create_collection, delete_collection

collections = Blueprint('collections', __name__)

@collections.route('/collections', methods=['GET'])
def get_collections_route():
    result = get_collections()
    return jsonify(result)

@collections.route('/collections', methods=['POST'])
def post_collections_route():
    data = request.get_json()
    result = create_collection(data)
    return jsonify(result)

@collections.route('/collections/<name>', methods=['DELETE'])
def delete_collection_route(name):
    result = delete_collection(name)
    return jsonify(result)
