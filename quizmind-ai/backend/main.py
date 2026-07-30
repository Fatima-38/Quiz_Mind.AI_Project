from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import quiz, score, bookmark
from database import init_db

app = FastAPI(title="QuizMind AI")

app.add_middleware(
    CORSMiddleware,
allow_origins=["http://localhost:5173", "https://quiz-mind-ai-project.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    init_db()

@app.get("/")
def root():
    return {"message": "QuizMind AI Backend Running!"}

app.include_router(quiz.router, prefix="/api/quiz", tags=["Quiz"])
app.include_router(score.router, prefix="/api/score", tags=["Score"])
app.include_router(bookmark.router, prefix="/api/bookmark", tags=["Bookmark"])


from mangum import Mangum

handler = Mangum(app)