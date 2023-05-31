from typing import List
from fastapi import APIRouter
from .service import ModelService

models_router = APIRouter()

model_service = ModelService()


@models_router.get("/models")
def get_models_route():
    return model_service.get_models()
