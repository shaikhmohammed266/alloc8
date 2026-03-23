from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from database import engine, Base
import models

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Disaster Resource API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routes.auth      import router as auth_router
from routes.disasters import router as disaster_router
from routes.analytics import router as analytics_router
from routes.ml        import router as ml_router
from routes.users     import router as users_router

app.include_router(auth_router,      prefix="/auth",      tags=["Auth"])
app.include_router(disaster_router,  prefix="/disasters", tags=["Disasters"])
app.include_router(analytics_router, prefix="/analytics", tags=["Analytics"])
app.include_router(ml_router,        prefix="/ml",        tags=["ML"])
app.include_router(users_router,     prefix="/users",     tags=["Users"])

@app.get("/")
def root():
    return {"message": "AI Disaster Resource API 🚀", "docs": "/docs"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
