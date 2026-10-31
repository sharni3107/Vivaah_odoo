import uuid
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Dict, Any, Optional
from backend.database import db_store
from backend.schemas.task import TaskCreate, TaskUpdate
from backend.dependencies import get_current_user
from backend.supabase_client import get_supabase_client

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.get("", response_model=List[Dict[str, Any]])
async def list_tasks(
    wedding_id: Optional[str] = Query(None),
    user: Dict[str, Any] = Depends(get_current_user)
):
    target_wedding_id = wedding_id or "wed-001"
    
    # If client, only allow their wedding
    if user.get("role") == "client":
        target_wedding_id = "wed-001"

    client = get_supabase_client()
    if client:
        try:
            res = client.table("tasks").select("*").eq("wedding_id", target_wedding_id).execute()
            if res.data:
                return res.data
        except Exception as e:
            print(f"Supabase tasks error: {e}")

    filtered = [t for t in db_store.tasks if t.get("wedding_id") == target_wedding_id]
    return filtered

@router.post("")
async def create_task(payload: TaskCreate, user: Dict[str, Any] = Depends(get_current_user)):
    new_task = {
        "id": f"task-{str(uuid.uuid4())[:8]}",
        "wedding_id": payload.wedding_id,
        "title": payload.title,
        "category": payload.category,
        "assigned_member": payload.assigned_member,
        "due_date": payload.due_date,
        "priority": payload.priority,
        "status": "To Plan",
        "notes": payload.notes or ""
    }
    db_store.tasks.append(new_task)

    client = get_supabase_client()
    if client:
        try:
            client.table("tasks").insert(new_task).execute()
        except Exception as e:
            print(f"Supabase task insert error: {e}")

    return {"success": True, "task": new_task}

@router.patch("/{task_id}")
async def update_task(task_id: str, payload: TaskUpdate, user: Dict[str, Any] = Depends(get_current_user)):
    task = next((t for t in db_store.tasks if t["id"] == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")

    if payload.status:
        task["status"] = payload.status
    if payload.priority:
        task["priority"] = payload.priority
    if payload.assigned_member:
        task["assigned_member"] = payload.assigned_member
    if payload.notes is not None:
        task["notes"] = payload.notes

    client = get_supabase_client()
    if client:
        try:
            client.table("tasks").update({"status": task["status"], "priority": task["priority"]}).eq("id", task_id).execute()
        except Exception as e:
            print(f"Supabase task update error: {e}")

    return {"success": True, "task": task}
