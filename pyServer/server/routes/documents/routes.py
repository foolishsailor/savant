from typing import List, Optional
from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from pydantic import BaseModel
from .service import DocumentService

documents_router = APIRouter()

document_service = DocumentService()


class DeleteDocumentInput(BaseModel):
    collection_name: str
    file_name: str


@documents_router.get("/documents")
def get_documents_route(collection_name: Optional[str] = None):
    print("get_documents_route", collection_name)
    if not collection_name:
        raise HTTPException(status_code=400, detail="collection_name is required")
    return document_service.get_documents(collection_name)


@documents_router.post("/documents")
async def post_documents_route(
    collection_name: str = Form(...), documents: List[UploadFile] = File(...)
):
    if not collection_name:
        raise HTTPException(status_code=400, detail="collection_name is required")

    if not documents:
        raise HTTPException(status_code=400, detail="no files attached")

    return document_service.add_documents(collection_name, documents)


@documents_router.post("/documents/delete")
def delete_document_route(data: DeleteDocumentInput):
    if not data.collection_name or not data.file_name:
        raise HTTPException(
            status_code=400, detail="collection_name and file_name is required"
        )

    return document_service.delete_documents(data.collection_name, data.file_name)
