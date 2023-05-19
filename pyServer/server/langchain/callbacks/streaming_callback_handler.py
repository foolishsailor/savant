import os
from dotenv import load_dotenv
from langchain.callbacks.base import BaseCallbackHandler
from typing import Dict, Any

load_dotenv()


class StreamingCallbackHandler(BaseCallbackHandler):
    _stream_callback = None

    @staticmethod
    def stream_callback(function):
        StreamingCallbackHandler._stream_callback = staticmethod(function)

    @property
    def stream_callback(self):
        return self._stream_callback

    @stream_callback.setter
    def stream_callback(self, function):
        StreamingCallbackHandler.stream_callback(function)

    def on_llm_new_token(self, token: str, **kwargs: Any) -> Any:
        if self.stream_callback:
            self.stream_callback(token)

    def on_chain_end(self, outputs: Dict[str, Any], **kwargs: Any) -> Any:
        if self.stream_callback:
            self.stream_callback(os.getenv("CHAIN_END_TRIGGER_MESSAGE"))
