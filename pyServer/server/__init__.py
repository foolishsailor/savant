from flask import Flask
from .routes.collections.routes import collections
from .routes.documents.routes import documents
from .routes.models.routes import models
from flask_cors import CORS


def create_server():
    server = Flask(__name__)
    server.register_blueprint(collections)
    server.register_blueprint(documents)
    server.register_blueprint(models)

    CORS(server)

    return server


if __name__ == "__main__":
    server = create_server
