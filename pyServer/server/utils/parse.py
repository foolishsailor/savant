from typing import Optional, Any, Dict, List, Union


class DocumentsObjectInterface:
    def __init__(
        self,
        id: str,
        document: str,
        metadata: Optional[Dict[str, Any]] = None,
        embedding: Optional[Dict[str, Any]] = None,
    ):
        self.metadata = metadata
        self.embedding = embedding
        self.document = document
        self.id = id


class DocumentsInterface:
    def __init__(
        self,
        ids: List[str],
        documents: List[str],
        embeddings: Optional[List[Any]] = None,
        metadatas: Optional[List[Any]] = None,
    ):
        self.ids = ids
        self.embeddings = embeddings
        self.documents = documents
        self.metadatas = metadatas


def process_documents_into_objects(
    documents: DocumentsInterface,
) -> Dict[str, List[DocumentsObjectInterface]]:
    objects = {}

    for i, document in enumerate(documents.documents):
        metadata = documents.metadatas[i] if documents.metadatas else None
        embedding = documents.embeddings[i] if documents.embeddings else {}
        doc_id = documents.ids[i]
        filename = (
            metadata.get("filename")
            if metadata and "filename" in metadata
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
