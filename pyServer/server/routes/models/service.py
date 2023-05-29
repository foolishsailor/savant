import os
from typing import Dict, Any, Tuple
from server.services.request_service import RequestService


class ModelService:
    def get_models(self) -> Dict[str, Any] | Tuple[int, str]:
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

        return all_models
