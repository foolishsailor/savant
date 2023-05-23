from server.services.vector_store import VectorStore
from typing import Collection
from typing import List


class CollectionService:
    vector_store = VectorStore()

    def __init__(self):
        self.collections = [{"name": "Coll 1"}, {"name": "Coll 2"}, {"name": "Coll 3"}]

    def get_collection(self, collection_name):
        collections: List[Collection] = []

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
