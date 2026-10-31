from pydantic import BaseModel
from typing import Optional

class ClientPaymentRecord(BaseModel):
    payment_id: str
    paid_date: str
    payment_method: str = "Wire Transfer"
    reference_no: str

class VendorPaymentRecord(BaseModel):
    vendor_payment_id: str
    amount_paying: float
    reference_no: str

class ExpenseCreate(BaseModel):
    wedding_id: str = "wed-001"
    category: str
    description: str
    amount: float
    recorded_by: str = "Siddharth Goenka"
