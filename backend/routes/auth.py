from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta
import bcrypt, jwt, os
from database import get_db
import models

router     = APIRouter()
SECRET_KEY = os.getenv("SECRET_KEY", "disaster-ai-secret-change-in-prod")
ALGORITHM  = "HS256"

# ── Schemas ──────────────────────────────────────────────────
class RegisterIn(BaseModel):
    name: str
    username: str
    email: EmailStr
    password: str
    role: Optional[str] = "citizen"
    location: Optional[str] = None

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int; name: str; username: str; email: str
    role: str; location: Optional[str]; created_at: datetime
    class Config: from_attributes = True

class TokenOut(BaseModel):
    access_token: str; token_type: str; user: UserOut

# ── Helpers ──────────────────────────────────────────────────
def hash_pw(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()

def verify_pw(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())

def make_token(user_id: int, role: str) -> str:
    payload = {"sub": str(user_id), "role": role,
               "exp": datetime.utcnow() + timedelta(hours=24)}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

# ── Routes ───────────────────────────────────────────────────
@router.post("/register", response_model=TokenOut, status_code=201)
def register(data: RegisterIn, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == data.email).first():
        raise HTTPException(400, "Email already registered")
    if db.query(models.User).filter(models.User.username == data.username).first():
        raise HTTPException(400, "Username already taken")
    if data.role not in ["citizen", "volunteer", "admin"]:
        raise HTTPException(400, "Invalid role")
    user = models.User(
        name=data.name, username=data.username, email=data.email,
        password=hash_pw(data.password), role=data.role, location=data.location
    )
    db.add(user); db.commit(); db.refresh(user)
    return TokenOut(access_token=make_token(user.id, user.role),
                    token_type="bearer", user=UserOut.from_orm(user))

@router.post("/login", response_model=TokenOut)
def login(data: LoginIn, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user or not verify_pw(data.password, user.password):
        raise HTTPException(401, "Invalid email or password")
    if not user.is_active:
        raise HTTPException(403, "Account deactivated")
    return TokenOut(access_token=make_token(user.id, user.role),
                    token_type="bearer", user=UserOut.from_orm(user))

@router.get("/me")
def me(token: str, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user = db.query(models.User).filter(models.User.id == int(payload["sub"])).first()
        if not user: raise HTTPException(404, "Not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except Exception:
        raise HTTPException(401, "Invalid token")
