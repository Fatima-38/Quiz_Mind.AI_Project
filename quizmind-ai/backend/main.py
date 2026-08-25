from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import quiz, score, bookmark
from database import init_db

app = FastAPI(
    title="QuizMind AI API",
    description="AI-powered dynamic quiz generation and performance tracking",
    version="1.0.0"
)

# Enable CORS for all origins to prevent cross-origin blocks on Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Database tables safely on startup
try:
    init_db()
except Exception as e:
    print("Database initialization note:", e)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "QuizMind AI Backend",
        "endpoints": {
            "health": "/api/health",
            "quiz_generate": "/api/quiz/generate",
            "scores": "/api/score/all",
            "bookmarks": "/api/bookmark/all"
        }
    }

@app.get("/api/health")
def health():
    return {"status": "ok", "message": "QuizMind AI Backend is healthy and running!"}

# Include API Routers
app.include_router(quiz.router, prefix="/api/quiz", tags=["Quiz"])
app.include_router(score.router, prefix="/api/score", tags=["Score"])
app.include_router(bookmark.router, prefix="/api/bookmark", tags=["Bookmark"])

# Serverless ASGI adapter for Vercel
try:
    from mangum import Mangum
    handler = Mangum(app)
except ImportError:
    handler = app
