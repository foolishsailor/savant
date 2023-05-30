import os
from typing import Dict, Any, Tuple, List
from server.services.request_service import RequestService

available_models = [
    "gpt-4",
    # "gpt-4-0314",
    # "gpt-4-32k",
    # "gpt-4-32k-0314",
    "gpt-3.5-turbo",
    # "gpt-3.5-turbo-0301",
]


def filter_models(
    all_models: List[Dict[str, Any]], available_models: List[str]
) -> List[str]:
    model_ids = []
    for item in all_models:
        if item["id"] in available_models:
            model_ids.append(item["id"])
    return model_ids


class ModelService:
    def get_models(self) -> List[str]:
        open_ai_url = os.getenv("OPENAI_API_HOST")
        open_ai_key = os.getenv("OPENAI_API_KEY")

        headers: Dict[str, str] = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {open_ai_key}",
        }

        service = RequestService(
            f"{open_ai_url}/v1/models", method="GET", headers=headers
        )

        all_models = service.request()

        return filter_models(all_models["data"], available_models)
