from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
import models

router = APIRouter()

@router.get("/summary")
def summary(db: Session = Depends(get_db)):
    total    = db.query(models.DisasterReport).count()
    active   = db.query(models.DisasterReport).filter(models.DisasterReport.status=="active").count()
    resolved = db.query(models.DisasterReport).filter(models.DisasterReport.status=="resolved").count()
    users    = db.query(models.User).count()
    vols     = db.query(models.User).filter(models.User.role=="volunteer").count()
    return {
        "total_reports": total, "active_disasters": active,
        "resolved_disasters": resolved, "total_users": users,
        "total_volunteers": vols,
        "response_rate": round((resolved/total*100) if total else 0, 1)
    }

@router.get("/by-type")
def by_type(db: Session = Depends(get_db)):
    rows = db.query(models.DisasterReport.disaster_type, func.count(models.DisasterReport.id))\
             .group_by(models.DisasterReport.disaster_type).all()
    return [{"type": r[0], "count": r[1]} for r in rows]

@router.get("/by-severity")
def by_severity(db: Session = Depends(get_db)):
    rows = db.query(models.DisasterReport.severity, func.count(models.DisasterReport.id))\
             .group_by(models.DisasterReport.severity).all()
    return [{"severity": r[0], "count": r[1]} for r in rows]
