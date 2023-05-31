from typing import Optional
from fastapi import APIRouter, HTTPException
from .service import CollectionService
from server.services.vector_store import VectorStore
import os
import queue
import json

collections_router = APIRouter()

collection_service = CollectionService()
vector_store = VectorStore()
q = queue.Queue()


def get_stream():
    def event_stream():
        while True:
            token: str = q.get()
            if token is None:
                break
            yield token

    return event_stream


async def query_and_signal_end(
    question: str,
    model_name: str,
    system_prompt: str,
    query_type: str,
    temperature: int,
    collection_name: str,
):
    vector_store.ask_question(
        question,
        model_name,
        system_prompt,
        query_type,
        temperature,
        collection_name,
        lambda token: q.put(token),
    )
    q.put(os.getenv("CHAT_END_TRIGGER_MESSAGE"))


@collections_router.get("/collections")
def get_collections_route(collection_name: Optional[str] = None):
    return (
        collection_service.get_collection(str(collection_name))
        if collection_name is not None
        else collection_service.get_collection()
    )


@collections_router.post("/collections")
def post_collections_route(collection_name: str):
    if not collection_name:
        raise HTTPException(status_code=400, detail="collectionName is required")

    return collection_service.create_collection(collection_name)


@collections_router.delete("/collections/{collection_name}")
def delete_collection_route(collection_name: str):
    if not collection_name:
        raise HTTPException(status_code=400, detail="collectionName is required")

    return collection_service.delete_collection(collection_name)
