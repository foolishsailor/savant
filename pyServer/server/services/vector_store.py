import os
from dotenv import load_dotenv

import chromadb
from chromadb.config import Settings
from chromadb.api.models.Collection import Collection
from chromadb.api.types import GetResult


from langchain.chat_models import ChatOpenAI
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from langchain.chains.summarize import load_summarize_chain

from server.langchain.callbacks.streaming_callback_handler import (
    StreamingCallbackHandler,
)
from server.langchain.callbacks.console_callback_handler import (
    ConsoleCallbackHandler,
)

from server.services.loaders import loader
from server.utils.parse import process_documents_into_objects

from typing import List, Dict, IO

load_dotenv()


class VectorStore:
    store: Chroma = None
    client = chromadb.Client()
    model = ChatOpenAI(
        openai_api_key=os.getenv("OPENAI_API_KEY"),
        model_name=os.getenv("DEFAULT_OPENAI_MODEL") or "gpt-3.5-turbo",
        streaming=True,
        verbose=True,
        temperature=0.5,
    )
    chat_history: List[str] = []

    @classmethod
    def set_create_chroma_store(cls, name: str):
        cls.store = Chroma(
            embedding_function=OpenAIEmbeddings(
                openai_api_key=os.getenv("OPENAI_API_KEY")
            ),
            collection_name=name,
        )

    def list_collections(self):
        return self.client.list_collections()

    def delete_collection(self, name: str):
        self.client.delete_collection(name)

    def get_collection(self, name: str):
        return self.client.get_collection(name)

    def get_documents(self, collection: Collection, query: Dict = {}):
        documents: GetResult = collection.get(where_document=query)
        return process_documents_into_objects(documents)

    def add_documents(self, file_path: str, filename: str):
        docs = loader(file_path, filename)
        if self.store:
            self.store.add_documents(docs)
        return docs

    def delete_documents(self, collection_name: str, filename: str):
        collection = self.get_collection(collection_name)
        collection.delete(where={filename: filename})
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
        callback,
    ):
        StreamingCallbackHandler.set_stream_callback(callback)

        chat_prompt = PromptTemplate.from_template(
            """{system_prompt}
            You are an AI assistant. You will be asked questions about the given documents, you can only use the given documents for information.  You can use your
            memory to help with context or analysis of the documents and to understand the information and question, but you cant make things up. 
            Provide answers in a conversational manner.
            Dont answer with anything like 'Based on the provided context' or 'Based on Additional Context'

            Answer like a human would.
            If you don't know the answer, don't try to make up an answer 
            Follow the user's instructions carefully. 
            ALWAYS respond using markdown.
            
            Chat History for context:
            {chat_history}

            The Question to be answered: {question}"""
        )

        prompt = chat_prompt.format(
            system_prompt=system_prompt,
            question=question,
            chat_history=self.chat_history,
        )

        if self.store and query_type == "refine":
            chain = RetrievalQA(
                combine_documents_chain=load_summarize_chain(
                    self.model, chain_type="refine"
                ),
                retriever=self.store.asRetriever(),
            )

            res = chain.call(
                {"chainType": "stuff", "query": prompt, "temperature": temperature},
                [StreamingCallbackHandler(), ConsoleCallbackHandler()],
            )

            self.chat_history.append(res.output_text)
        else:
            if VectorStore.store:
                chain = RetrievalQA.fromLLM(self.model, VectorStore.store.asRetriever())

                res = chain.call(
                    {"chainType": "stuff", "query": prompt, "temperature": temperature},
                    [StreamingCallbackHandler(), ConsoleCallbackHandler()],
                )

                self.chat_history.append(res.text)
