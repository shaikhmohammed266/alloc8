"""
ML Integration — Dummy Placeholder Functions
Replace these with real model calls when ready.

Models to build:
  1. predict_disaster_text  → BERT on Kaggle NLP Disaster tweets
  2. predict_disaster_image → ResNet-50 on CrisisMMD / MEDIC
  3. predict_resources      → Regression on historical disaster data
"""
import random

KEYWORDS = {
    "flood":      ["flood","water","rain","river","inundation","submerged"],
    "fire":       ["fire","flame","burn","blaze","smoke","wildfire"],
    "earthquake": ["earthquake","quake","tremor","seismic","aftershock"],
    "cyclone":    ["cyclone","hurricane","typhoon","storm","landfall"],
    "landslide":  ["landslide","mudslide","collapse","debris","rockfall"],
    "drought":    ["drought","dry","famine","crop failure","water shortage"],
}

RESOURCE_MULT = {
    "flood":{"high":3.0,"medium":2.0,"low":1.0},
    "fire": {"high":2.5,"medium":1.5,"low":0.8},
    "earthquake":{"high":4.0,"medium":2.5,"low":1.2},
    "cyclone":{"high":3.5,"medium":2.2,"low":1.1},
    "landslide":{"high":2.0,"medium":1.3,"low":0.6},
    "drought":{"high":2.0,"medium":1.2,"low":0.5},
}

BASE = {"food_kits":200,"medical_kits":100,"shelters":50,"water_units":300,"volunteers_needed":30}

def predict_disaster_text(text: str) -> dict:
    """Dummy text classifier — replace with BERT model"""
    tl = text.lower()
    for dtype, kws in KEYWORDS.items():
        if any(k in tl for k in kws):
            return {"is_disaster":True, "predicted_type":dtype,
                    "confidence": round(0.75+random.random()*0.2, 2), "model":"dummy-v0"}
    return {"is_disaster":False, "predicted_type":"non-disaster",
            "confidence": round(0.5+random.random()*0.3, 2), "model":"dummy-v0"}

def predict_disaster_type(disaster_type: str, description: str):
    r = predict_disaster_text(description or disaster_type)
    return r["predicted_type"], r["confidence"]

def predict_disaster_image(image_path: str) -> dict:
    """Dummy image classifier — replace with ResNet-50 fine-tuned on CrisisMMD"""
    types = ["flood","fire","earthquake","normal","cyclone"]
    return {"predicted_class": random.choice(types),
            "confidence": round(0.6+random.random()*0.35, 2), "model":"dummy-v0"}

def predict_resources(disaster_type: str, severity: str) -> dict:
    """Dummy resource predictor — replace with trained regression model"""
    mult = RESOURCE_MULT.get(disaster_type.lower(), {}).get(severity.lower(), 1.0)
    return {k: int(v*mult) for k,v in BASE.items()} | \
           {"disaster_type":disaster_type, "severity":severity, "model":"dummy-v0"}
