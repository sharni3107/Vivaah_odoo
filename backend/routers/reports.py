from fastapi import APIRouter, Depends
from typing import Dict, Any
from backend.database import db_store
from backend.dependencies import require_agency_user

router = APIRouter(prefix="/reports", tags=["Reports & Analytics"])

@router.get("/summary")
async def get_agency_reports(user: Dict[str, Any] = Depends(require_agency_user)):
    active_weddings_count = len(db_store.weddings)
    new_enquiries_count = sum(1 for e in db_store.enquiries if e.get("status") in ["New", "Contacted", "Follow-up", "Consultation Scheduled"])
    
    total_revenue = sum(w.get("contract_amount", 0) for w in db_store.weddings)
    total_expenses = sum(vp.get("agreed_amount", 0) for vp in db_store.vendor_payments) + sum(exp.get("amount", 0) for exp in db_store.expenses)
    net_profit = total_revenue - total_expenses
    
    pending_client_payments = sum(1 for cp in db_store.client_payments if cp.get("status") == "Pending")
    overdue_tasks = sum(1 for t in db_store.tasks if t.get("status") != "Done")

    # Destination Breakdown
    dest_counts = {}
    for w in db_store.weddings:
        dest = w.get("destination", "India").split(",")[0].strip()
        dest_counts[dest] = dest_counts.get(dest, 0) + 1

    return {
        "active_weddings": active_weddings_count,
        "new_enquiries": new_enquiries_count,
        "total_revenue": total_revenue,
        "total_expenses": total_expenses,
        "net_profit": net_profit,
        "profit_margin": round((net_profit / total_revenue) * 100, 1) if total_revenue > 0 else 0,
        "pending_payments_count": pending_client_payments,
        "pending_tasks_count": overdue_tasks,
        "destinations": dest_counts,
        "recent_activities": db_store.activity_logs[:10]
    }
