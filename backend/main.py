from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.routers import (
    auth,
    enquiries,
    weddings,
    tasks,
    vendors,
    guests,
    finance,
    documents,
    reports
)

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Unified API for Vivaah Luxury Wedding Platform — Managing Enquiries, Task Checklists, Quotation Workflows, Guest Attendance, and Escrow Finance."
)

# CORS Middleware for React Vite Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health Check & Supabase Status
@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "version": settings.app_version,
        "supabase_connected": settings.is_supabase_configured,
        "database_mode": "Live Supabase Database" if settings.is_supabase_configured else "Standby Mode (Aarav & Meera Seed Data Active)"
    }

# Register API Routers under /api
app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(enquiries.router, prefix=settings.api_prefix)
app.include_router(weddings.router, prefix=settings.api_prefix)
app.include_router(tasks.router, prefix=settings.api_prefix)
app.include_router(vendors.router, prefix=settings.api_prefix)
app.include_router(guests.router, prefix=settings.api_prefix)
app.include_router(finance.router, prefix=settings.api_prefix)
app.include_router(documents.router, prefix=settings.api_prefix)
app.include_router(reports.router, prefix=settings.api_prefix)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
