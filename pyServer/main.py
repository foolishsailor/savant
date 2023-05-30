from server import create_server  # type: ignore

server = create_server()

if __name__ == "__main__":
    server.run(debug=True, port=4000)
