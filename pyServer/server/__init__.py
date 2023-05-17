from flask import Flask
from .routes.collections.routes import collections
from .routes.documents.routes import documents
from .routes.interact.routes import interact

def create_server():
    server = Flask(__name__)
    server.register_blueprint(collections)
    server.register_blueprint(documents)
    server.register_blueprint(interact)

    return server

if __name__ == "__main__":
    server = create_server