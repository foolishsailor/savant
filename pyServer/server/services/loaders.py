from werkzeug.datastructures import FileStorage
from langchain.docstore.document import Document
from langchain.document_loaders import (
    PyPDFLoader,
    JSONLoader,
    TextLoader,
    CSVLoader,
    Docx2txtLoader,
)
from langchain.text_splitter import RecursiveCharacterTextSplitter
from typing import Any, Dict, List, IO

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)

loaders = {
    "json": lambda file: JSONLoader(file, "/texts"),
    "pdf": lambda file: PyPDFLoader(file),
    "txt": lambda file: TextLoader(file),
    "tsx": lambda file: TextLoader(file),
    "ts": lambda file: TextLoader(file),
    "js": lambda file: TextLoader(file),
    "css": lambda file: TextLoader(file),
    "csv": lambda file: CSVLoader(file),
    "docx": lambda file: Docx2txtLoader(file),
}


def get_file_extension(filename: str) -> str:
    return filename.rsplit(".", 1)[-1].lower()


def loader(file_path: str, filename: str) -> List[Document]:
    if not filename or file_path:
        return []

    extension = get_file_extension(filename)
    load_fn = loaders.get(extension)

    if not load_fn:
        raise ValueError(f"Unsupported file extension: {extension}")

    file_loader = load_fn(file_path)

    docs: List[Document] = file_loader.load_and_split(text_splitter)

    for doc in docs:
        metadata = doc.metadata
        metadata["filename"] = filename

    return docs
