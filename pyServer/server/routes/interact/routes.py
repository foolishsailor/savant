from flask import Blueprint, jsonify, request
from .service import ask_question

interact = Blueprint('interact', __name__)

@interact.route('/question', methods=['POST'])
def question_route():
    data = request.get_json()
    result = ask_question(data)
    return jsonify(result)

