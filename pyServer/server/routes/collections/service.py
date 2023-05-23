from server.services.vector_store import VectorStore
from chromadb.api.models.Collection import Collection
from typing import Sequence


class CollectionService:
    vector_store = VectorStore()

    def get_collection(self, collection_name):
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

    def create_collection(self, collection_name):
        CollectionService.vector_store.create_collection(collection_name)

        # Add error trapping here

        collections = CollectionService.vector_store.list_collections()

        result = [
            {"name": collection.name, "metadata": collection.metadata}
            for collection in collections
        ]
        return result

    def delete_collection(self, collection_name):
        CollectionService.vector_store.delete_collection(collection_name)

        collections = CollectionService.vector_store.list_collections()

        result = [
            {"name": collection.name, "metadata": collection.metadata}
            for collection in collections
        ]
        return result
