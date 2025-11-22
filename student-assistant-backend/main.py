# main.py - complete, self-contained backend
from fastapi import FastAPI, HTTPException, Header, Depends, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv

# AI SDK (optional) - keep but will only be used if GEMINI_API_KEY set
import google.generativeai as genai

# Auth hashing
from passlib.hash import pbkdf2_sha256

# DB
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User

# ------------------------------------------------------------
app = FastAPI(title="Student Assistant Backend (Gemini)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # development-only, lock this down in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------
# Environment
load_dotenv()
BACKEND_API_KEY = os.getenv("BACKEND_API_KEY", "supersecretkey123")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", None)

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# ------------------------------------------------------------
# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ------------------------------------------------------------
# Pydantic model used by /ask
class Query(BaseModel):
    question: str
    use_llm: Optional[bool] = True

# ------------------------------------------------------------
# Simple health-check
@app.get("/")
def root():
    return {"status": "running", "message": "Student Assistant Backend with Gemini"}

# ------------------------------------------------------------
# Auth endpoints (use Form data)
@app.post("/signup")
def signup(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    password_clean = str(password)[:256]
    hashed_pw = pbkdf2_sha256.hash(password_clean)

    user = User(name=name, email=email, password=hashed_pw)
    db.add(user)
    try:
        db.commit()
        db.refresh(user)
        return {"message": "User created successfully!"}
    except Exception as e:
        db.rollback()
        # return helpful message during dev
        raise HTTPException(status_code=400, detail=f"DB error: {str(e)}")

@app.post("/login")
def login(
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == email).first()
    if not user or not pbkdf2_sha256.verify(str(password), user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": f"Welcome {user.name}!"}

# ------------------------------------------------------------
# Debug endpoint to list users (temporary)
@app.get("/debug/users")
def debug_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [{"id": u.id, "name": u.name, "email": u.email} for u in users]

# ------------------------------------------------------------
# Chatbot endpoint
@app.post("/ask")
def ask_bot(query: Query, x_api_key: Optional[str] = Header(None)):
    if x_api_key != BACKEND_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API Key")

    question = query.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    # greeting
    if question.lower() in ["hi", "hello", "hey"]:
        return {"answer": "Hi there! How can I help you?", "source": "dummy", "confidence": 0.9}

    # If no Gemini key or use_llm False -> dummy
    if not GEMINI_API_KEY or not query.use_llm:
        return {"answer": f"(DUMMY) You asked: {query.question}", "source": "dummy", "confidence": 0.5}

    # Otherwise call Gemini (may raise, so we catch)
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = f"You are a helpful university chatbot. Question: {question}"
        response = model.generate_content(prompt)
        return {"answer": response.text, "source": "gemini", "confidence": 0.9}
    except Exception as e:
        return {"answer": f"(ERROR) Could not fetch from Gemini. {str(e)}", "source": "gemini", "confidence": 0.0}

# ------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
