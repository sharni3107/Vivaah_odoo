import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import List, Dict, Any, Optional
from backend.database import db_store
from backend.schemas.finance import ClientPaymentRecord, VendorPaymentRecord, ExpenseCreate
from backend.dependencies import get_current_user, require_agency_user

router = APIRouter(prefix="/finance", tags=["Finance & Payments"])

@router.get("/client-payments", response_model=List[Dict[str, Any]])
async def list_client_payments(
    wedding_id: Optional[str] = Query("wed-001"),
    user: Dict[str, Any] = Depends(get_current_user)
):
    target_wedding_id = wedding_id or "wed-001"
    return [p for p in db_store.client_payments if p.get("wedding_id") == target_wedding_id]

@router.post("/client-payments")
async def record_client_payment(
    payload: ClientPaymentRecord,
    user: Dict[str, Any] = Depends(require_agency_user)
):
    payment = next((p for p in db_store.client_payments if p["id"] == payload.payment_id), None)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment record not found.")

    # Prevent duplicate payment recording
    if payment.get("status") == "Paid":
        return {
            "success": False,
            "duplicate": True,
            "message": f"Payment {payload.payment_id} was already marked as Paid on {payment.get('paid_date')} with Ref {payment.get('reference_no')}.",
            "payment": payment
        }

    payment["status"] = "Paid"
    payment["paid_date"] = payload.paid_date or datetime.utcnow().strftime("%Y-%m-%d")
    payment["payment_method"] = payload.payment_method
    payment["reference_no"] = payload.reference_no

    db_store.activity_logs.insert(0, {
        "id": f"act-{str(uuid.uuid4())[:8]}",
        "wedding_id": payment["wedding_id"],
        "action": "Client Payment Recorded",
        "actor_name": user.get("name", "Finance Director"),
        "details": f"Recorded payment of ₹{payment['amount']:,} for {payment['milestone_name']}.",
        "created_at": datetime.utcnow().isoformat() + "Z"
    })

    return {"success": True, "duplicate": False, "payment": payment}

@router.get("/vendor-payments", response_model=List[Dict[str, Any]])
async def list_vendor_payments(
    wedding_id: Optional[str] = Query("wed-001"),
    user: Dict[str, Any] = Depends(get_current_user)
):
    # Security: Clients must NEVER see vendor payments or internal margins
    if user.get("role") == "client":
        raise HTTPException(status_code=403, detail="Forbidden: Clients cannot access internal vendor disbursement records.")

    payments = [v for v in db_store.vendor_payments if v.get("wedding_id") == wedding_id]
    
    # Vendors only see their own payment records
    if user.get("role") == "vendor":
        return [v for v in payments if v.get("vendor_id") == "ven-001"]

    return payments

@router.post("/vendor-payments")
async def record_vendor_disbursement(
    payload: VendorPaymentRecord,
    user: Dict[str, Any] = Depends(require_agency_user)
):
    vp = next((v for v in db_store.vendor_payments if v["id"] == payload.vendor_payment_id), None)
    if not vp:
        raise HTTPException(status_code=404, detail="Vendor payment record not found.")

    vp["amount_paid"] = vp.get("amount_paid", 0) + payload.amount_paying
    vp["balance_due"] = max(0, (vp["agreed_amount"] + vp.get("additional_charges", 0)) - vp["amount_paid"])
    
    if vp["balance_due"] == 0:
        vp["status"] = "Settled"
    else:
        vp["status"] = "Partial Paid"

    return {"success": True, "vendor_payment": vp}

@router.get("/expenses", response_model=List[Dict[str, Any]])
async def list_expenses(
    wedding_id: Optional[str] = Query("wed-001"),
    user: Dict[str, Any] = Depends(require_agency_user)
):
    return [e for e in db_store.expenses if e.get("wedding_id") == wedding_id]

@router.post("/expenses")
async def record_expense(
    payload: ExpenseCreate,
    user: Dict[str, Any] = Depends(require_agency_user)
):
    new_expense = {
        "id": f"exp-{str(uuid.uuid4())[:8]}",
        "wedding_id": payload.wedding_id,
        "category": payload.category,
        "description": payload.description,
        "amount": payload.amount,
        "recorded_by": user.get("name", payload.recorded_by),
        "created_at": datetime.utcnow().strftime("%Y-%m-%d")
    }
    db_store.expenses.append(new_expense)
    return {"success": True, "expense": new_expense}

@router.get("/summary")
async def get_finance_summary(
    wedding_id: Optional[str] = Query("wed-001"),
    user: Dict[str, Any] = Depends(require_agency_user)
):
    wedding = next((w for w in db_store.weddings if w["id"] == wedding_id), None)
    contract_amount = wedding["contract_amount"] if wedding else 18000000

    # Total Revenue = Contract Amount + any approved additional charges
    approved_quotes = [q for q in db_store.quotations if q.get("wedding_id") == wedding_id and q.get("status") in ["Client Approved", "Confirmed"]]
    additional_client_charges = sum(q.get("additional_charges", 0) for q in approved_quotes)
    total_revenue = contract_amount + additional_client_charges

    # Total Expenses = Vendor Agreed Costs + Operational Expenses
    total_vendor_costs = sum(vp.get("agreed_amount", 0) for vp in db_store.vendor_payments if vp.get("wedding_id") == wedding_id)
    total_operational_expenses = sum(exp.get("amount", 0) for exp in db_store.expenses if exp.get("wedding_id") == wedding_id)
    total_expenses = total_vendor_costs + total_operational_expenses

    # Profit
    estimated_profit = total_revenue - total_expenses
    profit_margin_pct = round((estimated_profit / total_revenue) * 100, 1) if total_revenue > 0 else 0

    # Collections
    client_paid = sum(cp.get("amount", 0) for cp in db_store.client_payments if cp.get("wedding_id") == wedding_id and cp.get("status") == "Paid")
    client_pending = total_revenue - client_paid

    # Disbursements
    vendor_paid = sum(vp.get("amount_paid", 0) for vp in db_store.vendor_payments if vp.get("wedding_id") == wedding_id)
    vendor_pending = total_vendor_costs - vendor_paid

    return {
        "wedding_id": wedding_id,
        "contract_amount": contract_amount,
        "additional_charges": additional_client_charges,
        "total_revenue": total_revenue,
        "total_vendor_costs": total_vendor_costs,
        "total_operational_expenses": total_operational_expenses,
        "total_expenses": total_expenses,
        "estimated_profit": estimated_profit,
        "profit_margin_percentage": profit_margin_pct,
        "client_collected": client_paid,
        "client_outstanding": max(0, client_pending),
        "vendor_disbursed": vendor_paid,
        "vendor_outstanding": max(0, vendor_pending)
    }
