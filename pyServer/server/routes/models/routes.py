from flask import Blueprint, jsonify, request
import json

from typing import List

from .service import ModelService

models = Blueprint("models", __name__)

model_service = ModelService()


@models.route("/models", methods=["GET"])
# `${OPENAI_API_HOST}/v1/models`
def get_models_route():
    return json.dumps(model_service.get_models())
