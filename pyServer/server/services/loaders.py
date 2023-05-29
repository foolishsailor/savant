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
from typing import Union, List, Optional

ALLOWED_EXTENSIONS = {
    "json",
    "txt",
    "pdf",
    "tsx",
    "ts",
    "js",
    "css",
    "csv",
    "docx",
}


class LoaderError:
    error: str
    item: str

    def __init__(self, error: str, item: str):
        self.error = error
        self.item = item


class LoaderResult:
    documents: List[Document]
    errors: List[LoaderError]

    def __init__(
        self, documents: List[Document], errors: Optional[List[LoaderError]] = None
    ):
        self.documents = documents
        self.errors = errors if errors is not None else []


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


def loader(file_path: str, filename: str) -> LoaderResult:
    if not filename or not file_path:
        return LoaderResult([], [])

    errors: List[LoaderError] = []

    extension = get_file_extension(filename)

    load_fn = loaders.get(extension)

    if not load_fn:
        print(f"==========================Unsupported file extension: {extension}")
        errors.append(
            (
                LoaderError(
                    error=f"Unsupported file extension: {extension}", item=filename
                )
            )
        )

        return LoaderResult([], errors)

    file_loader = load_fn(file_path)

    documents: List[Document] = file_loader.load_and_split(text_splitter)

    for doc in documents:
        metadata = doc.metadata
        metadata["filename"] = filename

    return LoaderResult(documents, errors)
