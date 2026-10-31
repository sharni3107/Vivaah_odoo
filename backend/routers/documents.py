import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from backend.database import db_store
from backend.dependencies import get_current_user

router = APIRouter(prefix="/documents", tags=["Documents"])

class DocumentCreate(BaseModel):
    wedding_id: str = "wed-001"
    file_name: str
    file_url: str
    category: str
    file_size: str

@router.get("", response_model=List[Dict[str, Any]])
async def list_documents(
    wedding_id: Optional[str] = Query("wed-001"),
    user: Dict[str, Any] = Depends(get_current_user)
):
    target_wedding_id = wedding_id or "wed-001"
    if user.get("role") == "client":
        target_wedding_id = "wed-001"

    docs = [d for d in db_store.documents if d.get("wedding_id") == target_wedding_id]
    
    # If client, only show Client Agreement, Invoices, Receipts (hide private internal agency notes)
    if user.get("role") == "client":
        return [d for d in docs if d.get("category") in ["Client Agreement", "Invoices", "Receipts", "Vendor Quotation"]]

    return docs

@router.post("")
async def register_document(
    payload: DocumentCreate,
    user: Dict[str, Any] = Depends(get_current_user)
):
    new_doc = {
        "id": f"doc-{str(uuid.uuid4())[:8]}",
        "wedding_id": payload.wedding_id,
        "file_name": payload.file_name,
        "file_url": payload.file_url,
        "category": payload.category,
        "file_size": payload.file_size,
        "uploaded_by": user.get("name", "Staff Member"),
        "created_at": datetime.utcnow().strftime("%Y-%m-%d")
    }
    db_store.documents.append(new_doc)
    return {"success": True, "document": new_doc}
