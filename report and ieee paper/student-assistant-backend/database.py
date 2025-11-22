from sqlalchemy import create_engine, Column, Integer, String, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DB_USER = "root"         # change if you set another username
DB_PASS = "yourpassword" # replace with your MySQL password
DB_NAME = "student_assistant"

DATABASE_URL = f"mysql+mysqlconnector://{DB_USER}:{DB_PASS}@localhost/{DB_NAME}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False)
Base = declarative_base()
