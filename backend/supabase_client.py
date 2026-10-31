from typing import Optional
from supabase import create_client, Client
from backend.config import settings

_supabase_client: Optional[Client] = None

def get_supabase_client() -> Optional[Client]:
    """
    Returns an authenticated Supabase Client using the service/secret key.
    If Supabase is not configured, returns None so callers can use the in-memory store.
    """
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client
    
    if settings.is_supabase_configured:
        try:
            _supabase_client = create_client(settings.supabase_url, settings.supabase_secret_key)
            print("Successfully initialized Supabase Client.")
            return _supabase_client
        except Exception as e:
            print(f"Warning: Failed to initialize Supabase client: {e}")
            return None
    return None
