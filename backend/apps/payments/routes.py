from fastapi import APIRouter, HTTPException
from apps.payments.razorpay_client import client

router = APIRouter(prefix="/payments", tags=["Payments"])

@router.post("/create-order")
def create_order(amount: int):
    order = client.order.create({
        "amount": amount * 100,
        "currency": "INR"
    })
    return {
        "order_id": order["id"],
        "amount": order["amount"]
    }

@router.post("/verify")
def verify_payment(payload: dict):
    try:
        client.utility.verify_payment_signature(payload)
        return {"status": "success"}
    except:
        raise HTTPException(status_code=400, detail="Invalid payment")
