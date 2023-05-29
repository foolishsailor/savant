import requests
from typing import Dict, Optional, Union, Any, Tuple


class RequestService:
    def __init__(
        self,
        url: str,
        method: str = "GET",
        headers: Optional[Dict[str, str]] = None,
        params: Optional[Dict[str, str]] = None,
        data: Optional[Dict[str, str]] = None,
    ) -> None:
        self.url = url
        self.method = method
        self.headers = headers if headers else {}
        self.params = params if params else {}
        self.data = data if data else {}

    def request(self) -> Any:
        response = requests.request(
            self.method,
            self.url,
            headers=self.headers,
            params=self.params,
            data=self.data,
        )

        if response.status_code == 200:
            return response.json()
        else:
            return response.status_code, response.text
