from werkzeug.datastructures import FileStorage
from langchain.docstore.document import Document
from langchain.document_loaders import (
    PyPDFLoader,
    JSONLoader,
    PyPDFium2Loader,
    PDFMinerLoader,
    PyMuPDFLoader,
)
from langchain.text_splitter import RecursiveCharacterTextSplitter
from typing import Any, Dict, List, IO

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)

loaders = {
    "pdf": lambda file: PyPDFium2Loader(file),
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
