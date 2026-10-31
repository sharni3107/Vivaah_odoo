import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    app_name: str = "Vivaah Luxury Wedding Platform API"
    app_version: str = "2.0.0"
    api_prefix: str = "/api"
    
    # Supabase Configuration
    supabase_url: str = os.getenv("SUPABASE_URL", "")
    supabase_publishable_key: str = os.getenv("SUPABASE_PUBLISHABLE_KEY", "")
    supabase_secret_key: str = os.getenv("SUPABASE_SECRET_KEY", "")
    
    # JWT / Auth Secret (for local fallback token verification)
    jwt_secret: str = os.getenv("JWT_SECRET", "vivaah-luxury-secret-key-2026")
    jwt_algorithm: str = "HS256"

    @property
    def is_supabase_configured(self) -> bool:
        return bool(
            self.supabase_url 
            and self.supabase_secret_key 
            and self.supabase_url.startswith("http")
            and "your-" not in self.supabase_url
        )

settings = Settings()
