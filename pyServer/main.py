from server import create_server

server = create_server()

if __name__ == "__main__":
    server.run(debug=True, port=4000)
