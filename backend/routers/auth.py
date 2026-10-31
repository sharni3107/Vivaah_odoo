from fastapi import APIRouter, Depends
from typing import Dict, Any
from backend.dependencies import get_current_user
from backend.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.get("/me")
async def get_my_profile(current_user: Dict[str, Any] = Depends(get_current_user)):
    return {
        "user": current_user,
        "supabase_connected": settings.is_supabase_configured
    }

@router.get("/status")
async def get_auth_status():
    return {
        "status": "ready",
        "supabase_configured": settings.is_supabase_configured,
        "mode": "Live Supabase Database" if settings.is_supabase_configured else "Standby Mode (Aarav & Meera Seed Data Active)"
    }
