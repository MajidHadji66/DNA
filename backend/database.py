from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime
import os

from dotenv import load_dotenv

load_dotenv()

# Use the connection string provided (adding ?sslmode=require is handled by the URL usually, but let's be safe)
# NOTE: In a real production app, this should be an environment variable.
# We are defaulting to the one you provided for immediate functionality.
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# SQLAlchemy setup
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class AnalysisResult(Base):
    __tablename__ = "analysis_history"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    filename = Column(String, index=True, nullable=True) # Added filename
    sequence = Column(String, index=True)
    is_protein = Column(Boolean)
    total_mass = Column(String) # Storing as string to keep it simple, or Float if preferred
    username = Column(String, index=True, nullable=True) # Added username

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
