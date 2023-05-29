import queue
import threading
from server.services.vector_store import VectorStore
from chromadb.api.models.Collection import Collection
from typing import Sequence


class ThreadWithException(threading.Thread):
    def __init__(self, target, *args, **kwargs):
        super().__init__(target=target, *args, **kwargs)
        self.error = None

    def run(self):
        try:
            super().run()
        except Exception as e:
            self.error = e


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

        collections = CollectionService.vector_store.list_collections()

        result = [
            {"name": collection.name, "metadata": collection.metadata}
            for collection in collections
        ]
        return result

    def delete_collection(self, collection_name: str):
        print("delete start", collection_name)
        CollectionService.vector_store.delete_collection(collection_name)

        print("delete complete", collection_name)

        collections = CollectionService.vector_store.list_collections()

        print("collections ============", collections)

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
        collection_name = data.get("collectionName")
        q = queue.Queue()

        def stream_callback(token):
            q.put(token)

        def generate():
            while True:
                token = q.get()  # This will block until a new item is available.
                if token is None:
                    break
                yield token

        thread = ThreadWithException(
            target=lambda: CollectionService.vector_store.ask_question(
                question,
                system_prompt,
                query_type,
                temperature,
                collection_name,
                stream_callback,
            )
        )
        thread.start()

        thread.join()  # Wait for the thread to finish
        if thread.error is not None:
            # Handle the error as needed
            print(f"An error occurred: {thread.error}")

        return generate
