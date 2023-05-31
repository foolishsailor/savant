from fastapi import FastAPI
from socketio.asgi import ASGIApp
from starlette.middleware.cors import CORSMiddleware
from .routes.collections.routes import collections_router
from .routes.documents.routes import documents_router
from .routes.models.routes import models_router
from .routes.question.routes import socketio


def create_server() -> FastAPI:
    server = FastAPI()

    server.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    server.include_router(collections_router)
    server.include_router(documents_router)
    server.include_router(models_router)

    server.mount("/ws", ASGIApp(socketio))

    return server
