from flask import Blueprint, jsonify, request
from .service import get_documents, create_document, delete_document

documents = Blueprint('documents', __name__)

@documents.route('/documents', methods=['GET'])
def get_documents_route():
    result = get_documents()
    return jsonify(result)

@documents.route('/documents', methods=['POST'])
def post_documents_route():
    data = request.get_json()
    result = create_document(data)
    return jsonify(result)

@documents.route('/documents/<id>', methods=['DELETE'])
def delete_document_route(id):
    result = delete_document(id)
    return jsonify(result)