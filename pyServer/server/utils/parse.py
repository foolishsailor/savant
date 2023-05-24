from chromadb.api.types import (
    Embedding,
    Metadata,
    Metadata,
    Document,
    GetResult,
)
from typing import Optional, Dict


class DocumentsObjectInterface:
    def __init__(
        self,
        id: str,
        document: Optional[Document] = None,
        metadata: Optional[Metadata] = None,
        embedding: Optional[Embedding] = None,
    ):
        self.metadata = metadata or None
        self.embedding = embedding or None
        self.document = document or None
        self.id = id

    def to_dict(self):
        return {
            "metadata": self.metadata,
            "embedding": self.embedding,
            "document": self.document,
            "id": self.id,
        }


class ProcessedDocumentReturnObject:
    id: str
    document: Optional[Document]
    metadata: Optional[Metadata]
    embedding: Optional[Embedding]


def process_documents_into_objects(
    documents: GetResult,
) -> Dict[str, list[ProcessedDocumentReturnObject]]:
    objects = {}
    docs = documents.get("documents", [])
    metadatas = documents.get("metadatas", [])
    embeddings = documents.get("embeddings", [])
    ids = documents.get("ids", [])

    if not docs:
        return {}

    for i, document in enumerate(docs):
        metadata = metadatas[i] if metadatas else None
        embedding = embeddings[i] if embeddings else None
        doc_id = ids[i]
        filename = (
            str(metadata.get("filename"))
            if metadata and "filename" in metadata
            else "unknown"
        )

        if filename not in objects:
            objects[str(filename)] = []
        else:
            objects[filename].append(
                DocumentsObjectInterface(
                    id=doc_id, document=document, metadata=metadata, embedding=embedding
                ).to_dict()
            )

    return objects
