from server import create_server  # type: ignore
import uvicorn

server = create_server()

if __name__ == "__main__":
    uvicorn.run("main:server", host="0.0.0.0", port=4000, reload=True)
