from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv
import google.generativeai as genai

from fastapi import FastAPI, HTTPException
from passlib.hash import bcrypt
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/signup")
def signup(name: str, email: str, password: str, db: Session = next(get_db())):
    hashed_pw = bcrypt.hash(password)
    user = User(name=name, email=email, password=hashed_pw)
    db.add(user)
    try:
        db.commit()
        return {"message": "User created successfully!"}
    except:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email already exists")

@app.post("/login")
def login(email: str, password: str, db: Session = next(get_db())):
    user = db.query(User).filter(User.email == email).first()
    if not user or not bcrypt.verify(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": f"Welcome {user.name}!"}


# Load environment variables
load_dotenv()
BACKEND_API_KEY = os.getenv("BACKEND_API_KEY", "changeme")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", None)

# Configure Gemini if API key exists
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI(title="Student Assistant Backend (Gemini)")

# Allow React frontend during dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    question: str
    use_llm: Optional[bool] = False

@app.get("/")
def root():
    return {"status": "running", "message": "Student Assistant Backend with Gemini"}

@app.post("/ask")
def ask_bot(query: Query, x_api_key: Optional[str] = Header(None)):
    # API-key check
    if x_api_key != BACKEND_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API Key")

    question = query.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    # If user says hi → custom greeting
    if question.lower() in ["hi", "hello", "hey"]:
        return {
            "answer": "Hi there! How can I help you?",
            "source": "dummy",
            "confidence": 0.9
        }

    # ✅ If no Gemini key or use_llm=False → dummy answer
    if not GEMINI_API_KEY or not query.use_llm:
        return {
            "answer": f"(DUMMY) You asked: {query.question}",
            "source": "dummy",
            "confidence": 0.5
        }

    # ✅ Otherwise call Gemini API
    try:
        model = genai.GenerativeModel("gemini-flash-latest")  # or "gemini-1.5-pro"

        prompt = f"""
        You are a helpful university chatbot.
        Question: {question}
        """
        response = model.generate_content(prompt)

        answer_text = response.text
        return {
            "answer": answer_text,
            "source": "gemini",
            "confidence": 0.9
        }
    except Exception as e:
        return {
            "answer": f"(ERROR) Could not fetch from Gemini. {str(e)}",
            "source": "gemini",
            "confidence": 0.0
        }
