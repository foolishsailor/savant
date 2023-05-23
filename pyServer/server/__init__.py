from flask import Flask
from .routes.collections.routes import collections
from .routes.documents.routes import documents


def create_server():
    server = Flask(__name__)
    server.register_blueprint(collections)
    server.register_blueprint(documents)

    return server


if __name__ == "__main__":
    server = create_server
