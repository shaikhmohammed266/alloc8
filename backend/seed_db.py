from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import models
from passlib.context import CryptContext

# Setup password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if admin already exists
    if db.query(models.User).filter(models.User.email == "admin@demo.com").first():
        print("Database already seeded.")
        return

    # Create Demo Users
    users = [
        models.User(email="admin@demo.com", password=pwd_context.hash("demo123"), role="admin", name="Admin User"),
        models.User(email="citizen@demo.com", password=pwd_context.hash("demo123"), role="citizen", name="Citizen User"),
        models.User(email="volunteer@demo.com", password=pwd_context.hash("demo123"), role="volunteer", name="Volunteer User")
    ]
    
    db.add_all(users)
    db.commit()
    print("✅ Demo users created successfully!")
    db.close()

if __name__ == "__main__":
    seed()
