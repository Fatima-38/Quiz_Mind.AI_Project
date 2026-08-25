from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import quiz, score, bookmark
from database import init_db

app = FastAPI(title="QuizMind AI API")

# Enable wide CORS for Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    init_db()
except Exception as e:
    print("Database init warning:", e)

@app.get("/")
@app.get("/main.py")
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
@app.get("/health")
def health():
    return {"status": "ok", "message": "QuizMind AI Backend is healthy and running!"}

# Include routers with both /api prefix and direct prefix for maximum Vercel compatibility
app.include_router(quiz.router, prefix="/api/quiz", tags=["Quiz"])
app.include_router(quiz.router, prefix="/quiz", tags=["Quiz"])

app.include_router(score.router, prefix="/api/score", tags=["Score"])
app.include_router(score.router, prefix="/score", tags=["Score"])

app.include_router(bookmark.router, prefix="/api/bookmark", tags=["Bookmark"])
app.include_router(bookmark.router, prefix="/bookmark", tags=["Bookmark"])

try:
    from mangum import Mangum
    handler = Mangum(app)
except ImportError:
    handler = app
