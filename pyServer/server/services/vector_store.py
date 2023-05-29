import os
from dotenv import load_dotenv

import chromadb
from chromadb.config import Settings
from chromadb.api.models.Collection import Collection
from chromadb.api.types import GetResult

from langchain.chat_models import ChatOpenAI

from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Chroma

from langchain.chains import ConversationalRetrievalChain, LLMChain
from langchain.chains.summarize import load_summarize_chain
from langchain.chains.conversational_retrieval.prompts import CONDENSE_QUESTION_PROMPT

from server.services.loaders import LoaderResult

from server.langchain.callbacks.streaming_callback_handler import (
    StreamingCallbackHandler,
)
from server.langchain.callbacks.console_callback_handler import (
    ConsoleCallbackHandler,
)


from server.services.loaders import loader
from server.utils.parse import process_documents_into_objects

from typing import List, Dict, Optional

load_dotenv()


class VectorStore:
    store: Optional[Chroma] = None
    client = chromadb.Client(
        Settings(
            chroma_api_impl="rest",
            chroma_server_host="localhost",
            chroma_server_http_port="8000",
        )
    )

    chain: ConversationalRetrievalChain
    chat_history = []

    @classmethod
    def set_create_chroma_store(cls, name: str):
        VectorStore.store = Chroma(
            embedding_function=OpenAIEmbeddings(
                client="Test", openai_api_key=os.getenv("OPENAI_API_KEY")
            ),
            collection_name=name,
            client=VectorStore.client,
        )

    def list_collections(self):
        return self.client.list_collections()

    def delete_collection(self, name: str):
        self.client.delete_collection(name)

    def get_collection(self, name: str):
        return self.client.get_collection(name)

    def create_collection(self, name: str):
        result = self.client.create_collection(name=name, get_or_create=True)
        return result

    def get_documents(self, collection: Collection, query: Dict = {}):
        documents: GetResult = collection.get(where_document=query)

        return process_documents_into_objects(documents)

    def add_documents(
        self, collection_name: str, file_path: str, filename: str
    ) -> LoaderResult:
        results = loader(file_path, filename)

        print(f"Adding {results} to {results}")

        if not VectorStore.store:
            VectorStore.set_create_chroma_store(collection_name)

        if VectorStore.store and len(results.documents) > 0:
            VectorStore.store.add_documents(results.documents)

        return results

    def delete_documents(self, collection_name: str, filename: str):
        collection = self.get_collection(collection_name)

        print(f"Deleting {filename} from {collection_name}")
        print(f"Collection: {collection}")

        collection.delete(where={"filename": filename})

        documents: GetResult = collection.get()

        return process_documents_into_objects(documents)

    def clear_chat_history(self):
        self.chat_history = []

    def ask_question(
        self,
        question: str,
        system_prompt: str,
        query_type: str,
        temperature: int,
        collection_name: str,
        callback,
    ):
        openai_org_id = os.getenv("OPENAI_ORG_ID")
        openai_api_key = os.getenv("OPENAI_API_KEY")
        default_model = os.getenv("DEFAULT_OPENAI_MODEL") or "gpt-3.5-turbo"

        model_args = {
            "client": "Test",
            "openai_api_key": openai_api_key,
            "model": default_model,
            "callbacks": [StreamingCallbackHandler(), ConsoleCallbackHandler()],
            "streaming": True,
            "verbose": True,
            "temperature": temperature,
        }

        if openai_org_id:
            model_args["openai_organization"] = openai_org_id

        model = ChatOpenAI(**model_args)

        StreamingCallbackHandler.set_stream_callback(callback)

        if not VectorStore.store:
            VectorStore.set_create_chroma_store(collection_name)

        if VectorStore.store:
            if query_type == "refine":
                chain = ConversationalRetrievalChain(
                    question_generator=LLMChain(
                        llm=model, prompt=CONDENSE_QUESTION_PROMPT
                    ),
                    combine_docs_chain=load_summarize_chain(
                        model,
                        chain_type="refine",
                    ),
                    retriever=VectorStore.store.as_retriever(),
                )

            else:
                chain = ConversationalRetrievalChain.from_llm(
                    llm=model,
                    retriever=VectorStore.store.as_retriever(),
                    verbose=True,
                )

            res = chain.run(
                {
                    "question": question,
                    "chat_history": self.chat_history,
                }
            )
            self.chat_history.append((question, res))

        else:
            raise ValueError(
                "Collection is not selected",
            )
