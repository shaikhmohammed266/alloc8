from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from database import get_db
import models

router = APIRouter()

class UserOut(BaseModel):
    id: int; name: str; username: str; email: str
    role: str; is_active: bool; created_at: datetime
    class Config: from_attributes = True

@router.get("/", response_model=List[UserOut])
def all_users(db: Session = Depends(get_db)):
    return db.query(models.User).order_by(models.User.created_at.desc()).all()

@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    u = db.query(models.User).filter(models.User.id == user_id).first()
    if not u: raise HTTPException(404, "Not found")
    return u

@router.patch("/{user_id}/deactivate")
def deactivate(user_id: int, db: Session = Depends(get_db)):
    u = db.query(models.User).filter(models.User.id == user_id).first()
    if not u: raise HTTPException(404, "Not found")
    u.is_active = False; db.commit()
    return {"message": "User deactivated"}

@router.delete("/{user_id}")
def delete(user_id: int, db: Session = Depends(get_db)):
    u = db.query(models.User).filter(models.User.id == user_id).first()
    if not u: raise HTTPException(404, "Not found")
    db.delete(u); db.commit()
    return {"message": "User deleted"}
