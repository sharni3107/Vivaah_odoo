from pydantic import BaseModel
from typing import Optional

class QuotationRequestCreate(BaseModel):
    wedding_id: str = "wed-001"
    category: str
    title: str
    description: Optional[str] = None

class QuotationSubmit(BaseModel):
    request_id: str
    wedding_id: str = "wed-001"
    vendor_id: str
    price_per_plate_or_service: float
    total_quoted_amount: float
    service_inclusions: str
    additional_charges: float = 0.0
    notes: Optional[str] = None
    proposal_pdf_url: Optional[str] = None

class QuotationFeedback(BaseModel):
    feedback: Optional[str] = "Approved by client."
