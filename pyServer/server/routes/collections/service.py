import queue
import threading
from server.services.vector_store import VectorStore
from chromadb.api.models.Collection import Collection
from typing import Sequence


class CollectionService:
    vector_store = VectorStore()

    def get_collection(self, collection_name: str = ""):
        collections: Sequence[Collection] = []

        if collection_name:
            CollectionService.vector_store.set_create_chroma_store(collection_name)

            collection = CollectionService.vector_store.get_collection(collection_name)
            collections = [collection] if collection else []
        else:
            collections = CollectionService.vector_store.list_collections()

        result = [
            {"name": collection.name, "metadata": collection.metadata}
            for collection in collections
        ]
        return result

    def create_collection(self, collection_name: str):
        CollectionService.vector_store.create_collection(collection_name)

        # Add error trapping here

        collections = CollectionService.vector_store.list_collections()

        result = [
            {"name": collection.name, "metadata": collection.metadata}
            for collection in collections
        ]
        return result

    def delete_collection(self, collection_name: str):
        CollectionService.vector_store.delete_collection(collection_name)

        collections = CollectionService.vector_store.list_collections()

        result = [
            {"name": collection.name, "metadata": collection.metadata}
            for collection in collections
        ]
        return result

    def query_collection(self, data):
        question = data.get("question")
        system_prompt = data.get("systemPrompt")
        query_type = data.get("queryType")
        temperature = data.get("temperature")

        q = queue.Queue()

        def stream_callback(token):
            q.put(token)

        def generate():
            while True:
                token = q.get()  # This will block until a new item is available.
                if token is None:
                    break
                yield token

        threading.Thread(
            target=lambda: CollectionService.vector_store.ask_question(
                question, system_prompt, query_type, temperature, stream_callback
            )
        ).start()

        return generate
