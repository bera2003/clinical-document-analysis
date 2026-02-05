from app.resend_email import send_reset_email
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import secrets

from app.database import get_db
from app.models import User
from app.schemas import ForgotPasswordRequest, ResetPasswordRequest
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    # bcrypt safety: limit to 72 bytes
    return pwd_context.hash(password[:72])

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password[:72], hashed_password)

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

@router.post("/forgot-password")
def forgot_password(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):

    # Check if user exists
    user = db.query(User).filter(User.email == data.email).first()

    # Security: don't reveal if email exists
    if not user:
        return {"message": "If email exists, reset link sent."}

    # Generate reset token
    token = secrets.token_urlsafe(32)

    # Save token + expiry in DB
    user.reset_token = token
    user.token_expiry = datetime.utcnow() + timedelta(minutes=15)

    db.commit()

    reset_link = f"http://localhost:3000/reset-password/{token}"

    send_reset_email(user.email, reset_link)

    return {"message": "Password reset link sent to your email"}

@router.post("/reset-password")
def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    if data.new_password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    if len(data.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    # Find user by token
    user = db.query(User).filter(
        User.reset_token == data.token
    ).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid token")

    if user.token_expiry < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token expired")

    # Update password (hashed)
    user.password = hash_password(data.new_password)

    # Remove token after use
    user.reset_token = None
    user.token_expiry = None

    db.commit()

    return {"message": "Password updated successfully"}

