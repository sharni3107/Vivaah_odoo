from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from backend.database import db_store
from backend.dependencies import get_current_user
from backend.supabase_client import get_supabase_client

router = APIRouter(prefix="/weddings", tags=["Weddings"])

@router.get("", response_model=List[Dict[str, Any]])
async def list_weddings(user: Dict[str, Any] = Depends(get_current_user)):
    # Role-based restriction: If client, only return their wedding!
    if user.get("role") == "client":
        client_weddings = [w for w in db_store.weddings if w.get("email") == user.get("email") or w.get("id") == "wed-001"]
        return client_weddings

    client = get_supabase_client()
    if client:
        try:
            res = client.table("weddings").select("*").execute()
            if res.data:
                return res.data
        except Exception as e:
            print(f"Supabase weddings fetch error: {e}")

    return db_store.weddings

@router.get("/{wedding_id}")
async def get_wedding_details(wedding_id: str, user: Dict[str, Any] = Depends(get_current_user)):
    # If client, verify wedding ownership
    if user.get("role") == "client" and wedding_id != "wed-001":
        wedding = next((w for w in db_store.weddings if w["id"] == wedding_id and w.get("email") == user.get("email")), None)
        if not wedding:
            raise HTTPException(status_code=403, detail="Forbidden: You can only view your own wedding.")
        return wedding

    wedding = next((w for w in db_store.weddings if w["id"] == wedding_id), None)
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding not found.")
    return wedding
