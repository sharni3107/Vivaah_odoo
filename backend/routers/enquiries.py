import uuid
from datetime import datetime, date, timedelta
from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Dict, Any, Optional
from backend.database import db_store, DEFAULT_TASKS_TEMPLATE
from backend.schemas.enquiry import EnquiryCreate, EnquiryUpdate, EnquiryConvert
from backend.dependencies import get_current_user, require_agency_user
from backend.supabase_client import get_supabase_client

router = APIRouter(prefix="/enquiries", tags=["Enquiries"])

@router.get("", response_model=List[Dict[str, Any]])
async def list_enquiries(user: Dict[str, Any] = Depends(require_agency_user)):
    client = get_supabase_client()
    if client:
        try:
            res = client.table("enquiries").select("*").order("created_at", desc=True).execute()
            if res.data:
                return res.data
        except Exception as e:
            print(f"Supabase fetch error: {e}")
    return db_store.enquiries

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_public_enquiry(payload: EnquiryCreate):
    client = get_supabase_client()
    new_enquiry = {
        "id": f"enq-{str(uuid.uuid4())[:8]}",
        "client_names": payload.client_names,
        "email": payload.email,
        "phone": payload.phone,
        "wedding_date": payload.wedding_date,
        "destination": payload.destination,
        "expected_guests": payload.expected_guests,
        "package_type": payload.package_type,
        "estimated_budget": payload.estimated_budget,
        "preferred_theme": payload.preferred_theme,
        "additional_requirements": payload.additional_requirements,
        "status": "New",
        "assigned_executive": "Vikram Sen",
        "converted_wedding_id": None,
        "created_at": datetime.utcnow().isoformat() + "Z",
        "notes": []
    }

    if client:
        try:
            client.table("enquiries").insert({
                "client_names": payload.client_names,
                "email": payload.email,
                "phone": payload.phone,
                "wedding_date": payload.wedding_date,
                "destination": payload.destination,
                "expected_guests": payload.expected_guests,
                "package_type": payload.package_type,
                "estimated_budget": payload.estimated_budget,
                "preferred_theme": payload.preferred_theme,
                "additional_requirements": payload.additional_requirements,
                "status": "New"
            }).execute()
        except Exception as e:
            print(f"Supabase insert error: {e}")

    # Also keep in local runtime store
    db_store.enquiries.insert(0, new_enquiry)
    return {"success": True, "message": "Enquiry registered successfully.", "enquiry": new_enquiry}

@router.patch("/{enquiry_id}")
async def update_enquiry(
    enquiry_id: str,
    payload: EnquiryUpdate,
    user: Dict[str, Any] = Depends(require_agency_user)
):
    enq = next((e for e in db_store.enquiries if str(e["id"]) == str(enquiry_id)), None)
    if not enq:
        client = get_supabase_client()
        if client:
            try:
                res = client.table("enquiries").select("*").eq("id", enquiry_id).execute()
                if res.data and len(res.data) > 0:
                    enq = res.data[0]
                    db_store.enquiries.insert(0, enq)
            except Exception as e:
                print(f"Supabase fallback enquiry error: {e}")

    if not enq:
        raise HTTPException(status_code=404, detail="Enquiry not found.")

    if payload.status:
        enq["status"] = payload.status
    if payload.assigned_executive:
        enq["assigned_executive"] = payload.assigned_executive
    if payload.note_content:
        if "notes" not in enq or not isinstance(enq["notes"], list):
            enq["notes"] = []
        enq["notes"].append({
            "date": datetime.utcnow().strftime("%Y-%m-%d"),
            "author": user.get("name", "Staff Member"),
            "content": payload.note_content
        })

    client = get_supabase_client()
    if client:
        try:
            client.table("enquiries").update({"status": enq["status"]}).eq("id", enquiry_id).execute()
        except Exception as e:
            print(f"Supabase update error: {e}")

    return {"success": True, "enquiry": enq}

@router.post("/{enquiry_id}/convert")
async def convert_enquiry_to_wedding(
    enquiry_id: str,
    payload: EnquiryConvert,
    user: Dict[str, Any] = Depends(require_agency_user)
):
    enq = next((e for e in db_store.enquiries if str(e["id"]) == str(enquiry_id)), None)
    if not enq:
        client = get_supabase_client()
        if client:
            try:
                res = client.table("enquiries").select("*").eq("id", enquiry_id).execute()
                if res.data and len(res.data) > 0:
                    enq = res.data[0]
                    db_store.enquiries.insert(0, enq)
            except Exception as e:
                print(f"Supabase fallback enquiry error: {e}")

    if not enq:
        raise HTTPException(status_code=404, detail="Enquiry not found.")

    # 1. Prevent duplicate wedding creation from repeated clicks
    if enq.get("converted_wedding_id"):
        existing_wedding = next((w for w in db_store.weddings if w["id"] == enq["converted_wedding_id"]), None)
        if existing_wedding:
            return {
                "success": True,
                "message": "Enquiry has already been converted into a wedding.",
                "wedding": existing_wedding,
                "already_converted": True
            }

    # 2. Create the wedding record
    new_wedding_id = f"wed-{str(uuid.uuid4())[:8]}"
    wedding_record = {
        "id": new_wedding_id,
        "enquiry_id": enq["id"],
        "title": f"{enq['client_names']} — {enq['destination']} Wedding",
        "couple_names": enq["client_names"],
        "email": enq["email"],
        "phone": enq["phone"],
        "destination": f"{enq['destination']}, India",
        "dates": enq["wedding_date"],
        "start_date": enq["wedding_date"],
        "end_date": enq["wedding_date"],
        "package_tier": enq["package_type"],
        "expected_guests": enq["expected_guests"],
        "actual_checkins": 0,
        "contract_amount": enq["estimated_budget"],
        "assigned_planner": payload.assigned_planner or user.get("name", "Priya Sharma"),
        "status": "In Planning",
        "cover_image": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
        "notes": f"Converted from Enquiry {enquiry_id}. Requirements: {enq.get('additional_requirements', 'Standard')}."
    }
    db_store.weddings.append(wedding_record)

    # 3. Mark Enquiry as Confirmed and link
    enq["status"] = "Confirmed"
    enq["converted_wedding_id"] = new_wedding_id

    # 4. Generate 25+ default planning tasks with relative due dates
    try:
        w_date = datetime.strptime(enq["wedding_date"], "%Y-%m-%d").date()
    except Exception:
        w_date = date.today() + timedelta(days=180)

    generated_tasks = []
    for i, tpl in enumerate(DEFAULT_TASKS_TEMPLATE):
        t_due = w_date - timedelta(days=tpl["days_before"])
        task_obj = {
            "id": f"task-{new_wedding_id}-{i+1:03d}",
            "wedding_id": new_wedding_id,
            "title": tpl["title"],
            "category": tpl["category"],
            "assigned_member": tpl["assigned"],
            "due_date": t_due.strftime("%Y-%m-%d"),
            "priority": tpl["priority"],
            "status": "To Plan",
            "notes": f"Standard workflow generated task for {wedding_record['title']}."
        }
        db_store.tasks.append(task_obj)
        generated_tasks.append(task_obj)

    # 5. Create initial client payment milestones
    deposit = getattr(payload, 'deposit_received', None) or (wedding_record["contract_amount"] * 0.15)
    db_store.client_payments.extend([
        {
            "id": f"pay-c-{new_wedding_id}-01",
            "wedding_id": new_wedding_id,
            "milestone_name": "Date Reservation & Initial Retainer (15%)",
            "amount": deposit,
            "due_date": datetime.utcnow().strftime("%Y-%m-%d"),
            "paid_date": None,
            "status": "Pending",
            "payment_method": "RTGS Wire Transfer",
            "reference_no": f"TXN-RTGS-{new_wedding_id[-4:]}-01",
            "notes": "Initial reservation token milestone."
        },
        {
            "id": f"pay-c-{new_wedding_id}-02",
            "wedding_id": new_wedding_id,
            "milestone_name": "First Production Advance (Venue & Design Lock) (35%)",
            "amount": wedding_record["contract_amount"] * 0.35,
            "due_date": (w_date - timedelta(days=90)).strftime("%Y-%m-%d"),
            "paid_date": None,
            "status": "Pending",
            "payment_method": "RTGS Wire Transfer",
            "reference_no": f"TXN-RTGS-{new_wedding_id[-4:]}-02",
            "notes": "Advance for venue buyout and production staging."
        },
        {
            "id": f"pay-c-{new_wedding_id}-03",
            "wedding_id": new_wedding_id,
            "milestone_name": "Final Balance & Vendor Settlement (50%)",
            "amount": wedding_record["contract_amount"] * 0.50,
            "due_date": (w_date - timedelta(days=15)).strftime("%Y-%m-%d"),
            "paid_date": None,
            "status": "Pending",
            "payment_method": "RTGS Wire Transfer",
            "reference_no": f"TXN-RTGS-{new_wedding_id[-4:]}-03",
            "notes": "Final balance prior to event execution."
        }
    ])

    # 6. Record activity log
    db_store.activity_logs.insert(0, {
        "id": f"act-{str(uuid.uuid4())[:8]}",
        "wedding_id": new_wedding_id,
        "action": "Enquiry Converted to Wedding",
        "actor_name": user.get("name", "Staff Member"),
        "details": f"Created wedding {wedding_record['title']} and generated {len(generated_tasks)} initial tasks.",
        "created_at": datetime.utcnow().isoformat() + "Z"
    })

    client = get_supabase_client()
    if client:
        try:
            client.table("weddings").insert({
                "id": new_wedding_id,
                "title": wedding_record["title"],
                "couple_names": wedding_record["couple_names"],
                "email": wedding_record["email"],
                "phone": wedding_record["phone"],
                "destination": wedding_record["destination"],
                "start_date": wedding_record["start_date"],
                "end_date": wedding_record["end_date"],
                "contract_amount": wedding_record["contract_amount"],
                "package_tier": wedding_record["package_tier"]
            }).execute()
        except Exception as e:
            print(f"Supabase wedding insert error: {e}")

    return {
        "success": True,
        "message": f"Successfully converted enquiry to wedding project with {len(generated_tasks)} tasks generated.",
        "wedding": wedding_record,
        "tasks_generated": len(generated_tasks),
        "tasks_generated_count": len(generated_tasks)
    }
