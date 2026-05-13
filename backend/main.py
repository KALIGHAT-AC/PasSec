import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.analyze import router as analyze_router
from utils.dictionary import DictionaryAttackEngine

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    path = os.getenv("WORDLIST_PATH", "./data/common_passwords.txt")
    app.state.dictionary_engine = DictionaryAttackEngine(path)
    n = len(app.state.dictionary_engine.passwords)
    print(f"[startup] Loaded {n:,} passwords into dictionary engine.")
    yield
    print("[shutdown] Cleaning up resources.")


app = FastAPI(
    title="Password Security Analyzer API",
    description="Simulates dictionary and brute-force attacks on passwords using cryptographic entropy math.",
    version="1.0.0",
    lifespan=lifespan,
)

raw = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000")
origins = [o.strip() for o in raw.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router, prefix="/api")


@app.get("/health", tags=["health"])
async def health_check():
    engine = getattr(app.state, "dictionary_engine", None)
    loaded = bool(getattr(engine, "passwords", None))
    size = len(engine.passwords) if loaded else 0
    return {
        "status": "ok",
        "service": "password-analyzer-api",
        "dictionary_attack": {"enabled": loaded, "wordlist_size": size},
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000)),
        reload=True,
    )
