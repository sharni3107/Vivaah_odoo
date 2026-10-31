import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import List, Dict, Any, Optional
from backend.database import db_store
from backend.schemas.vendor import QuotationRequestCreate, QuotationSubmit, QuotationFeedback
from backend.dependencies import get_current_user, require_agency_user
from backend.supabase_client import get_supabase_client

router = APIRouter(prefix="/vendors", tags=["Vendors & Quotations"])

@router.get("", response_model=List[Dict[str, Any]])
async def list_vendors(user: Dict[str, Any] = Depends(get_current_user)):
    return db_store.vendors

@router.get("/quotation-requests", response_model=List[Dict[str, Any]])
async def list_quotation_requests(
    wedding_id: Optional[str] = Query("wed-001"),
    user: Dict[str, Any] = Depends(get_current_user)
):
    requests = [r for r in db_store.quotation_requests if r.get("wedding_id") == wedding_id]
    return requests

@router.post("/quotation-requests")
async def create_quotation_request(
    payload: QuotationRequestCreate,
    user: Dict[str, Any] = Depends(require_agency_user)
):
    new_rfp = {
        "id": f"rfp-{str(uuid.uuid4())[:8]}",
        "wedding_id": payload.wedding_id,
        "category": payload.category,
        "title": payload.title,
        "description": payload.description or "",
        "status": "Open",
        "created_at": datetime.utcnow().isoformat() + "Z"
    }
    db_store.quotation_requests.append(new_rfp)
    return {"success": True, "request": new_rfp}

@router.get("/quotations", response_model=List[Dict[str, Any]])
async def list_quotations(
    wedding_id: Optional[str] = Query("wed-001"),
    user: Dict[str, Any] = Depends(get_current_user)
):
    role = user.get("role")
    quotes = [q for q in db_store.quotations if q.get("wedding_id") == wedding_id]

    # Rule: Client ONLY sees quotations shared with them
    if role == "client":
        return [q for q in quotes if q.get("shared_with_client") is True]

    # Rule: Vendor ONLY sees their own quotations
    if role == "vendor":
        vendor_id = "ven-001" if "royalfeast" in user.get("email", "") else None
        return [q for q in quotes if q.get("vendor_id") == vendor_id]

    # Agency sees all
    return quotes

@router.post("/quotations")
async def submit_quotation(
    payload: QuotationSubmit,
    user: Dict[str, Any] = Depends(get_current_user)
):
    vendor = next((v for v in db_store.vendors if v["id"] == payload.vendor_id), None)
    new_quote = {
        "id": f"quote-{str(uuid.uuid4())[:8]}",
        "request_id": payload.request_id,
        "wedding_id": payload.wedding_id,
        "vendor_id": payload.vendor_id,
        "vendor_name": vendor["name"] if vendor else "Partner Vendor",
        "price_per_plate_or_service": payload.price_per_plate_or_service,
        "total_quoted_amount": payload.total_quoted_amount,
        "service_inclusions": payload.service_inclusions,
        "additional_charges": payload.additional_charges,
        "notes": payload.notes or "",
        "proposal_pdf_url": payload.proposal_pdf_url or "/documents/sample_quote.pdf",
        "status": "Submitted",
        "shared_with_client": False,
        "client_feedback": None,
        "created_at": datetime.utcnow().isoformat() + "Z"
    }
    db_store.quotations.append(new_quote)
    return {"success": True, "quotation": new_quote}

@router.post("/quotations/{quote_id}/share")
async def share_quotation_with_couple(
    quote_id: str,
    user: Dict[str, Any] = Depends(require_agency_user)
):
    quote = next((q for q in db_store.quotations if q["id"] == quote_id), None)
    if not quote:
        raise HTTPException(status_code=404, detail="Quotation not found.")

    quote["shared_with_client"] = True
    if quote["status"] == "Submitted":
        quote["status"] = "Shared with Client"

    db_store.activity_logs.insert(0, {
        "id": f"act-{str(uuid.uuid4())[:8]}",
        "wedding_id": quote["wedding_id"],
        "action": "Proposal Shared with Couple",
        "actor_name": user.get("name", "Planner"),
        "details": f"Shared {quote['vendor_name']} proposal for client review.",
        "created_at": datetime.utcnow().isoformat() + "Z"
    })

    return {"success": True, "message": "Proposal shared with client successfully.", "quotation": quote}

@router.post("/quotations/{quote_id}/approve")
async def client_approve_proposal(
    quote_id: str,
    payload: QuotationFeedback,
    user: Dict[str, Any] = Depends(get_current_user)
):
    quote = next((q for q in db_store.quotations if q["id"] == quote_id), None)
    if not quote:
        raise HTTPException(status_code=404, detail="Quotation not found.")

    quote["status"] = "Client Approved"
    quote["client_feedback"] = payload.feedback or "Approved by client."

    db_store.activity_logs.insert(0, {
        "id": f"act-{str(uuid.uuid4())[:8]}",
        "wedding_id": quote["wedding_id"],
        "action": "Client Approved Proposal",
        "actor_name": user.get("name", "The Couple"),
        "details": f"Couple approved {quote['vendor_name']} quotation (₹{quote['total_quoted_amount']:,}).",
        "created_at": datetime.utcnow().isoformat() + "Z"
    })

    return {"success": True, "message": "Proposal approved by client.", "quotation": quote}

@router.post("/quotations/{quote_id}/reject")
async def client_reject_proposal(
    quote_id: str,
    payload: QuotationFeedback,
    user: Dict[str, Any] = Depends(get_current_user)
):
    quote = next((q for q in db_store.quotations if q["id"] == quote_id), None)
    if not quote:
        raise HTTPException(status_code=404, detail="Quotation not found.")

    quote["status"] = "Client Rejected"
    quote["client_feedback"] = payload.feedback or "Revisions requested."

    return {"success": True, "message": "Feedback recorded.", "quotation": quote}

@router.post("/quotations/{quote_id}/confirm")
async def confirm_vendor_assignment(
    quote_id: str,
    user: Dict[str, Any] = Depends(require_agency_user)
):
    quote = next((q for q in db_store.quotations if q["id"] == quote_id), None)
    if not quote:
        raise HTTPException(status_code=404, detail="Quotation not found.")

    quote["status"] = "Confirmed"

    # Add to wedding_vendors if not already added
    exists = any(wv["vendor_id"] == quote["vendor_id"] and wv["wedding_id"] == quote["wedding_id"] for wv in db_store.wedding_vendors)
    if not exists:
        db_store.wedding_vendors.append({
            "id": f"wv-{str(uuid.uuid4())[:8]}",
            "wedding_id": quote["wedding_id"],
            "vendor_id": quote["vendor_id"],
            "category": "Catering",
            "vendor_name": quote["vendor_name"],
            "agreed_amount": quote["total_quoted_amount"],
            "contract_status": "Confirmed"
        })

    # Ensure vendor payment milestone exists
    vp_exists = any(vp["vendor_id"] == quote["vendor_id"] and vp["wedding_id"] == quote["wedding_id"] for vp in db_store.vendor_payments)
    if not vp_exists:
        db_store.vendor_payments.append({
            "id": f"vp-{str(uuid.uuid4())[:8]}",
            "wedding_id": quote["wedding_id"],
            "vendor_id": quote["vendor_id"],
            "vendor_name": quote["vendor_name"],
            "milestone_name": "Agreed Contract Milestone",
            "agreed_amount": quote["total_quoted_amount"],
            "amount_paid": 0,
            "additional_charges": 0,
            "balance_due": quote["total_quoted_amount"],
            "status": "Pending",
            "due_date": "2026-11-30"
        })

    db_store.activity_logs.insert(0, {
        "id": f"act-{str(uuid.uuid4())[:8]}",
        "wedding_id": quote["wedding_id"],
        "action": "Vendor Confirmed",
        "actor_name": user.get("name", "Planner"),
        "details": f"Contract locked with {quote['vendor_name']} for ₹{quote['total_quoted_amount']:,}.",
        "created_at": datetime.utcnow().isoformat() + "Z"
    })

    return {"success": True, "message": f"{quote['vendor_name']} successfully confirmed.", "quotation": quote}
