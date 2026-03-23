from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import os, shutil, uuid
from database import get_db
import models

router    = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class DisasterOut(BaseModel):
    id: int; disaster_type: str; severity: str; status: str
    title: Optional[str]; description: Optional[str]; location: Optional[str]
    latitude: Optional[float]; longitude: Optional[float]
    image_path: Optional[str]; ai_prediction: Optional[str]
    ai_confidence: Optional[float]; reporter_id: Optional[int]; created_at: datetime
    class Config: from_attributes = True

@router.get("/", response_model=List[DisasterOut])
def get_all(db: Session = Depends(get_db)):
    return db.query(models.DisasterReport).order_by(
        models.DisasterReport.created_at.desc()).all()

@router.get("/active", response_model=List[DisasterOut])
def get_active(db: Session = Depends(get_db)):
    return db.query(models.DisasterReport).filter(
        models.DisasterReport.status == "active").all()

@router.get("/{disaster_id}", response_model=DisasterOut)
def get_one(disaster_id: int, db: Session = Depends(get_db)):
    d = db.query(models.DisasterReport).filter(models.DisasterReport.id == disaster_id).first()
    if not d: raise HTTPException(404, "Not found")
    return d

@router.post("/report", response_model=DisasterOut, status_code=201)
async def report(
    disaster_type: str = Form(...),
    severity: str = Form(...),
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    reporter_id: Optional[int] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    image_path = None
    if image and image.filename:
        ext = image.filename.rsplit(".", 1)[-1]
        fname = f"{uuid.uuid4()}.{ext}"
        fpath = os.path.join(UPLOAD_DIR, fname)
        with open(fpath, "wb") as f:
            shutil.copyfileobj(image.file, f)
        image_path = fpath

    from ml_integration import predict_disaster_type
    ai_pred, ai_conf = predict_disaster_type(disaster_type, description or "")

    rec = models.DisasterReport(
        disaster_type=disaster_type, severity=severity, status="pending",
        title=title or f"{disaster_type.title()} in {location or 'Unknown'}",
        description=description, location=location,
        latitude=latitude, longitude=longitude,
        image_path=image_path, ai_prediction=ai_pred,
        ai_confidence=ai_conf, reporter_id=reporter_id
    )
    db.add(rec); db.commit(); db.refresh(rec)

    from ml_integration import predict_resources
    r = predict_resources(disaster_type, severity)
    alloc = models.ResourceAllocation(
        disaster_id=rec.id, food_kits=r["food_kits"],
        medical_kits=r["medical_kits"], shelters=r["shelters"],
        water_units=r["water_units"], volunteers_needed=r["volunteers_needed"]
    )
    db.add(alloc); db.commit()
    return rec

@router.patch("/{disaster_id}/status")
def update_status(disaster_id: int, new_status: str, db: Session = Depends(get_db)):
    valid = ["pending","active","resolved","rejected"]
    if new_status not in valid: raise HTTPException(400, "Invalid status")
    d = db.query(models.DisasterReport).filter(models.DisasterReport.id == disaster_id).first()
    if not d: raise HTTPException(404, "Not found")
    d.status = new_status; db.commit()
    return {"message": f"Status updated to {new_status}"}

@router.delete("/{disaster_id}")
def delete(disaster_id: int, db: Session = Depends(get_db)):
    d = db.query(models.DisasterReport).filter(models.DisasterReport.id == disaster_id).first()
    if not d: raise HTTPException(404, "Not found")
    db.delete(d); db.commit()
    return {"message": "Deleted"}

@router.get("/user/{user_id}", response_model=List[DisasterOut])
def user_reports(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.DisasterReport).filter(
        models.DisasterReport.reporter_id == user_id).all()
