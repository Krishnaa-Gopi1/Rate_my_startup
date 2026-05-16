"""Thin async wrapper around the Groq Chat Completions API.

Only used for the final verdict — everything else is rule-based to keep
costs near zero and latency low.
"""
from __future__ import annotations

import os

import httpx

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
DEFAULT_MODEL = "llama-3.3-70b-versatile"

_VERDICT_SYSTEM = (
    "You are a sarcastic, brutally honest YC partner roasting startup ideas. "
    "Be funny but insightful. Be specific to the idea — no generic platitudes. "
    "Reply with EXACTLY 2-3 sentences. No preamble, no headers, no quotes — just the verdict text."
)


class GroqError(Exception):
    """Raised when the Groq call fails for any reason."""


async def generate_verdict(idea: str) -> str:
    """Generate a final verdict for the given idea via Groq.

    Raises GroqError on any failure so callers can fall back gracefully.
    """
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise GroqError("GROQ_API_KEY not configured")

    model = os.environ.get("GROQ_MODEL", DEFAULT_MODEL)

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": _VERDICT_SYSTEM},
            {"role": "user", "content": f'Startup idea: "{idea}"\n\nGive your verdict.'},
        ],
        "temperature": 0.9,
        "max_tokens": 180,
    }

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(
                GROQ_URL,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )
            resp.raise_for_status()
            data = resp.json()
            text = data["choices"][0]["message"]["content"].strip()
            # Strip leading/trailing quotes if model wrapped output
            return text.strip('"').strip()
    except httpx.HTTPStatusError as e:
        raise GroqError(f"Groq HTTP {e.response.status_code}: {e.response.text[:200]}") from e
    except (httpx.HTTPError, KeyError, ValueError) as e:
        raise GroqError(f"Groq call failed: {e}") from e


# Hardcoded fallbacks used when Groq is unreachable or key is missing.
FALLBACK_VERDICTS = [
    "This will either become a unicorn or die in a single weekend. Pray for the latter so you can move on faster.",
    "Surprisingly viable if executed by a strong technical team. Equally easy to faceplant if not.",
    "You built a solution searching for a problem. Find the problem before you find investors.",
    "Investors might like this more than actual users will. Build the demo first, not the deck.",
    "Classic 'feature, not a company' energy. The good news is you can pivot fast.",
]


def fallback_verdict(idea: str) -> str:
    """Deterministic fallback when AI is unavailable."""
    import hashlib
    h = int(hashlib.md5(idea.encode()).hexdigest(), 16)
    return FALLBACK_VERDICTS[h % len(FALLBACK_VERDICTS)]
