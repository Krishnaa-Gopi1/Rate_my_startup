from __future__ import annotations

import logging
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.analyze import router as analyze_router

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")

app = FastAPI(title="StartupJudge AI", version="0.1.0")

origins = [o.strip() for o in os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000").split(",") if o.strip()]
origin_regex = os.environ.get("ALLOWED_ORIGIN_REGEX")  # e.g. https://.*\.netlify\.app

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=origin_regex,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/")
async def root() -> dict:
    return {"service": "startupjudge-ai", "status": "ok"}


@app.get("/health")
async def health() -> dict:
    return {"status": "ok", "groq_configured": bool(os.environ.get("GROQ_API_KEY"))}


app.include_router(analyze_router, prefix="/api")
