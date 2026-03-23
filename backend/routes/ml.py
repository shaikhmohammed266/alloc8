from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class TextIn(BaseModel):
    text: str

class ResourceIn(BaseModel):
    disaster_type: str
    severity: str

@router.post("/predict-text")
def predict_text(data: TextIn):
    from ml_integration import predict_disaster_text
    return predict_disaster_text(data.text)

@router.post("/predict-resources")
def predict_resources(data: ResourceIn):
    from ml_integration import predict_resources as pr
    return pr(data.disaster_type, data.severity)

@router.get("/status")
def status():
    return {
        "tweet_model":    "dummy placeholder",
        "image_model":    "dummy placeholder",
        "resource_model": "dummy placeholder",
        "note":           "Replace with real models in /ml_models"
    }
