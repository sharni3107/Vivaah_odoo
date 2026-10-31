from pydantic import BaseModel
from typing import Optional, List

class GuestCreate(BaseModel):
    wedding_id: str = "wed-001"
    name: str
    family_group: str = "General"
    plus_ones: int = 0
    invitation_category: str = "Standard"
    functions_attending: List[str] = ["All"]
    table_assigned: Optional[str] = None

class GuestCheckIn(BaseModel):
    qr_code_or_id: str
    wedding_id: str = "wed-001"
