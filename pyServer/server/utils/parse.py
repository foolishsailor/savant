from chromadb.api.types import (
    Embedding,
    Metadata,
    Include,
    Metadata,
    Document,
    Where,
    IDs,
    EmbeddingFunction,
    GetResult,
    QueryResult,
    ID,
    OneOrMany,
    WhereDocument,
    maybe_cast_one_to_many,
    validate_ids,
    validate_include,
    validate_metadatas,
    validate_where,
    validate_where_document,
    validate_embeddings,
)
from typing import Optional, Any, Dict, List
from mypy_extensions import TypedDict


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


def process_documents_into_objects(
    documents: GetResult,
) -> Dict[str, list[DocumentsObjectInterface]]:
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
            metadata.get("filename")
            if metadata and hasattr(metadata, "filename")
            else "unknown"
        )

        if filename not in objects:
            objects[filename] = []

        objects[filename].append(
            DocumentsObjectInterface(
                id=doc_id, document=document, metadata=metadata, embedding=embedding
            )
        )

    return objects
