from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any

class EnquiryCreate(BaseModel):
    client_names: str
    email: EmailStr
    phone: str
    wedding_date: str
    destination: str
    expected_guests: int = 200
    package_type: str = "Full-Service Wedding Planning"
    estimated_budget: float = 15000000.0
    preferred_theme: Optional[str] = None
    additional_requirements: Optional[str] = None

class EnquiryUpdate(BaseModel):
    status: Optional[str] = None
    assigned_executive: Optional[str] = None
    note_content: Optional[str] = None

class EnquiryConvert(BaseModel):
    assigned_planner: Optional[str] = "Priya Sharma"
