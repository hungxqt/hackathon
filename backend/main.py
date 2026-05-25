import random
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Funny Backend API")

# Enable CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FUNNY_QUOTES = [
    "Why do programmers wear glasses? Because they can't C#.",
    "There are 10 types of people in the world: those who understand binary, and those who don't.",
    "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
    "A SQL query goes into a bar, walks up to two tables and asks, 'Can I join you?'",
    "['hip', 'hip'] (hip hip array!)",
    "Why did the programmer quit his job? Because he didn't get arrays.",
    "To understand what recursion is, you must first understand what recursion is.",
    "There are two ways to write error-free programs; only the third one works.",
    "What is a programmer's hangout place? Foo Bar.",
    "Hardware: The parts of a computer system that can be kicked.",
    "Optimist: The glass is half full. Pessimist: The glass is half empty. Programmer: The glass is twice as large as necessary.",
    "Why do computer scientists prefer dark mode? Because light attracts bugs!"
]

class JokeResponse(BaseModel):
    joke: str

class HealthResponse(BaseModel):
    status: str

@app.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(status="ok")

@app.get("/api/funny", response_model=JokeResponse)
def get_funny():
    return JokeResponse(joke=random.choice(FUNNY_QUOTES))
