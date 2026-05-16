from __future__ import annotations

import logging

from fastapi import APIRouter

from app.models.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.groq_client import GroqError, fallback_verdict, generate_verdict
from app.services.scoring import build_response

router = APIRouter()
log = logging.getLogger("startupjudge")


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(req: AnalyzeRequest) -> AnalyzeResponse:
    """Score the idea via rules, then ask Groq for the final verdict."""
    try:
        verdict = await generate_verdict(req.idea)
    except GroqError as e:
        log.warning("Groq unavailable, using fallback: %s", e)
        verdict = fallback_verdict(req.idea)

    return build_response(req.idea, verdict)
