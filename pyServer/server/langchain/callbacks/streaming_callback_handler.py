import os
from dotenv import load_dotenv
from langchain.callbacks.base import BaseCallbackHandler
from langchain.schema import LLMResult
from typing import Dict, Any, List

load_dotenv()


class StreamingCallbackHandler(BaseCallbackHandler):
    _stream_callback = None

    @classmethod
    def set_stream_callback(cls, function):
        StreamingCallbackHandler._stream_callback = staticmethod(function)

    @property
    def stream_callback(self):
        return self._stream_callback

    @stream_callback.setter
    def stream_callback(self, function):
        StreamingCallbackHandler.set_stream_callback(function)

    def on_llm_new_token(self, token: str, **kwargs: Any) -> Any:
        if self.stream_callback:
            self.stream_callback(token)

    def on_llm_start(
        self, serialized: Dict[str, Any], prompts: List[str], **kwargs: Any
    ) -> Any:
        if self.stream_callback:
            self.stream_callback(os.getenv("LLM_START_TRIGGER_MESSAGE"))

    def on_chain_end(self, outputs: Dict[str, Any], **kwargs: Any) -> Any:
        if self.stream_callback:
            self.stream_callback(os.getenv("CHAIN_END_TRIGGER_MESSAGE"))
