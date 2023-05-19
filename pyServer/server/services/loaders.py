import io
from langchain.document_loaders import (
    PyPDFLoader,
    JSONLoader,
    PyPDFium2Loader,
    PDFMinerLoader,
    PyMuPDFLoader,
)
from langchain.text_splitter import RecursiveCharacterTextSplitter
from typing import Any, Dict, Callable, List, Union

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=0)

loaders = {
    "json": lambda file: JSONLoader(file),
    "pdf": lambda file: PyPDFium2Loader(file, split_pages=False),
}


def get_file_extension(filename: str) -> str:
    return filename.rsplit(".", 1)[-1].lower()


def loader(file: io.BytesIO, filename: str) -> List[Dict[str, Any]]:
    extension = get_file_extension(filename)
    load_fn = loaders.get(extension)

    if not load_fn:
        raise ValueError(f"Unsupported file extension: {extension}")

    file_loader = load_fn(file)

    docs = file_loader.load_and_split(text_splitter)

    return [{"data": doc, "metadata": {"filename": filename}} for doc in docs]
