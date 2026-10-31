from pydantic import BaseModel
from typing import Optional

class TaskCreate(BaseModel):
    wedding_id: str = "wed-001"
    title: str
    category: str = "Decoration"
    assigned_member: str = "Priya Sharma"
    due_date: str
    priority: str = "Medium"
    notes: Optional[str] = None

class TaskUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_member: Optional[str] = None
    notes: Optional[str] = None
