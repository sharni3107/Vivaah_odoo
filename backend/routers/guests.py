import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import List, Dict, Any, Optional
from backend.database import db_store
from backend.schemas.guest import GuestCreate, GuestCheckIn
from backend.dependencies import get_current_user

router = APIRouter(prefix="/guests", tags=["Guests & Events"])

@router.get("", response_model=List[Dict[str, Any]])
async def list_guests(
    wedding_id: Optional[str] = Query("wed-001"),
    user: Dict[str, Any] = Depends(get_current_user)
):
    target_wedding_id = wedding_id or "wed-001"
    if user.get("role") == "client":
        target_wedding_id = "wed-001"

    guests = [g for g in db_store.guests if g.get("wedding_id") == target_wedding_id]
    return guests

@router.post("")
async def create_guest(
    payload: GuestCreate,
    user: Dict[str, Any] = Depends(get_current_user)
):
    new_guest_id = f"gst-{str(uuid.uuid4())[:6]}"
    new_guest = {
        "id": new_guest_id,
        "wedding_id": payload.wedding_id,
        "name": payload.name,
        "family_group": payload.family_group,
        "plus_ones": payload.plus_ones,
        "invitation_category": payload.invitation_category,
        "functions_attending": payload.functions_attending,
        "rsvp_status": "Pending",
        "checked_in": False,
        "checked_in_at": None,
        "qr_code": f"VIVAAH-{payload.wedding_id.upper()}-{new_guest_id.upper()}",
        "table_assigned": payload.table_assigned or "Unassigned"
    }
    db_store.guests.append(new_guest)
    return {"success": True, "guest": new_guest}

@router.post("/check-in")
async def check_in_guest(
    payload: GuestCheckIn,
    user: Dict[str, Any] = Depends(get_current_user)
):
    search_term = payload.qr_code_or_id.strip()
    
    # Locate guest by QR code or ID
    guest = next((g for g in db_store.guests if (g["id"] == search_term or g["qr_code"] == search_term) and g["wedding_id"] == payload.wedding_id), None)
    
    if not guest:
        # Check by name match fallback
        guest = next((g for g in db_store.guests if g["name"].lower() == search_term.lower() and g["wedding_id"] == payload.wedding_id), None)

    if not guest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Guest with identifier '{search_term}' not found for wedding."
        )

    # 1. Prevent duplicate check-ins
    if guest.get("checked_in"):
        return {
            "success": False,
            "duplicate": True,
            "message": f"Duplicate Check-In Alert: {guest['name']} was already checked in at {guest.get('checked_in_at')}.",
            "guest": guest
        }

    # 2. Perform Check-In
    now_time = datetime.utcnow().isoformat() + "Z"
    guest["checked_in"] = True
    guest["checked_in_at"] = now_time

    # Update wedding total checkins
    wedding = next((w for w in db_store.weddings if w["id"] == payload.wedding_id), None)
    total_checked_in = sum(1 + g.get("plus_ones", 0) for g in db_store.guests if g["wedding_id"] == payload.wedding_id and g.get("checked_in"))
    
    if wedding:
        wedding["actual_checkins"] = total_checked_in
        expected_guests = wedding.get("expected_guests", 400)
    else:
        expected_guests = 400

    over_capacity = total_checked_in > expected_guests
    additional_count = max(0, total_checked_in - expected_guests)

    # 3. Log activity
    db_store.activity_logs.insert(0, {
        "id": f"act-{str(uuid.uuid4())[:8]}",
        "wedding_id": payload.wedding_id,
        "action": "Guest Checked In",
        "actor_name": user.get("name", "Concierge Coordinator"),
        "details": f"{guest['name']} (+{guest['plus_ones']}) verified at entrance.",
        "created_at": now_time
    })

    return {
        "success": True,
        "duplicate": False,
        "message": f"Welcome, {guest['name']}! Check-in confirmed.",
        "guest": guest,
        "total_checked_in": total_checked_in,
        "expected_guests": expected_guests,
        "over_capacity_alert": over_capacity,
        "additional_guests_count": additional_count
    }

@router.get("/events", response_model=List[Dict[str, Any]])
async def list_events(
    wedding_id: Optional[str] = Query("wed-001"),
    user: Dict[str, Any] = Depends(get_current_user)
):
    return [e for e in db_store.events if e.get("wedding_id") == wedding_id]

@router.get("/vendor-arrivals", response_model=List[Dict[str, Any]])
async def list_vendor_arrivals(
    wedding_id: Optional[str] = Query("wed-001"),
    user: Dict[str, Any] = Depends(get_current_user)
):
    arrivals = [a for a in db_store.vendor_arrivals if a.get("wedding_id") == wedding_id]
    
    # If vendor role, only return their arrivals
    if user.get("role") == "vendor":
        return [a for a in arrivals if a.get("vendor_id") == "ven-001"]

    return arrivals

@router.patch("/vendor-arrivals/{arrival_id}")
async def update_vendor_arrival(
    arrival_id: str,
    status: str = Query(...),
    notes: Optional[str] = Query(None),
    user: Dict[str, Any] = Depends(get_current_user)
):
    arr = next((a for a in db_store.vendor_arrivals if a["id"] == arrival_id), None)
    if not arr:
        raise HTTPException(status_code=404, detail="Vendor arrival record not found.")

    arr["arrival_status"] = status
    if status == "Arrived" and not arr.get("actual_arrival_time"):
        arr["actual_arrival_time"] = datetime.utcnow().strftime("%H:%M")
    if notes:
        arr["coordinator_notes"] = notes

    return {"success": True, "arrival": arr}
