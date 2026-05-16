"""Rule-based scoring engine.

Keeps cost near zero and responses fast by computing most ratings deterministically
from keyword presence in the idea text. Only the final verdict is AI-generated.
"""
from __future__ import annotations

import hashlib
import random
from typing import Literal

from app.models.schemas import (
    AnalyzeResponse,
    BurnoutLevel,
    Difficulty,
    InvestorReaction,
    TechBreakdown,
)
from app.services.templates import build_investor_reactions

# Baseline scores before any keyword modifiers
BASE = {"yc": 18, "tech": 30, "burnout": 50, "mone": 50, "hype": 18}

# Each rule contributes deltas to one or more dimensions.
# Keywords are matched against the lowercased idea text.
KEYWORD_RULES: dict[str, dict[str, int]] = {
    # AI / ML
    "ai":              {"yc": +12, "hype": +25, "tech": +10},
    "artificial intelligence": {"yc": +12, "hype": +25, "tech": +10},
    "machine learning":{"yc": +8,  "hype": +15, "tech": +20},
    "llm":             {"yc": +10, "hype": +25, "tech": +15},
    "gpt":             {"yc": +5,  "hype": +30, "tech": -5},
    "agent":           {"yc": +15, "hype": +25, "tech": +15},
    "wrapper":         {"yc": -10, "hype": +5,  "tech": -15},
    "chatbot":         {"yc": +0,  "hype": +10, "tech": +5},

    # Crypto / web3
    "crypto":          {"yc": -10, "hype": +25, "mone": +10},
    "web3":            {"yc": -15, "hype": +25, "mone": +15},
    "blockchain":      {"yc": -10, "hype": +20, "tech": +20},
    "nft":             {"yc": -20, "hype": +30, "mone": +30},
    "dao":             {"yc": -15, "hype": +20},
    "token":           {"yc": -5,  "hype": +20, "mone": +10},
    "on-chain":        {"yc": -10, "hype": +20},

    # Business models
    "saas":            {"yc": +18, "mone": -15, "tech": +5},
    "b2b":             {"yc": +15, "mone": -15},
    "enterprise":      {"yc": +12, "mone": -20, "tech": +10},
    "subscription":    {"yc": +5,  "mone": -20},
    "marketplace":     {"yc": +8,  "tech": +25, "burnout": +20, "mone": +10},
    "two-sided":       {"yc": +5,  "tech": +25, "burnout": +25, "mone": +15},
    "social":          {"yc": +0,  "burnout": +25, "mone": +30, "hype": +10},
    "community":       {"yc": +5,  "burnout": +20, "mone": +25},
    "consumer":        {"yc": +0,  "mone": +20, "burnout": +10},
    "vertical":        {"yc": +10, "mone": -5},

    # Specific verticals
    "fintech":         {"yc": +12, "tech": +20, "mone": -10},
    "healthcare":      {"yc": +12, "tech": +20, "mone": +5,  "burnout": +15},
    "health":          {"yc": +5,  "tech": +10},
    "edtech":          {"yc": +5,  "mone": +20},
    "education":       {"yc": +0,  "mone": +25},
    "legal":           {"yc": +10, "tech": +15, "mone": -5},
    "real estate":     {"yc": +5,  "tech": +10, "mone": +5},
    "logistics":       {"yc": +8,  "tech": +25, "mone": +5},
    "supply chain":    {"yc": +10, "tech": +25, "mone": -5},

    # Developer
    "developer":       {"yc": +15, "mone": +5},
    "devtools":        {"yc": +20, "mone": +5,  "tech": +10},
    "open source":     {"yc": +10, "mone": +35},
    "infrastructure":  {"yc": +10, "tech": +25, "mone": -5},
    "api":             {"yc": +8,  "mone": -5},
    "no-code":         {"yc": +10, "hype": +15, "tech": +5},
    "low-code":        {"yc": +5,  "hype": +10},

    # Hardware / physical
    "hardware":        {"yc": -5,  "tech": +35, "burnout": +20, "mone": +15},
    "iot":             {"yc": -5,  "tech": +25, "mone": +10},
    "drone":           {"yc": -5,  "tech": +30, "burnout": +15, "mone": +20},
    "robot":           {"yc": -5,  "tech": +35, "burnout": +20},
    "delivery":        {"yc": +0,  "tech": +15, "mone": +10, "burnout": +15},
    "physical":        {"yc": -5,  "tech": +20, "mone": +10},

    # Format / pattern matches
    "uber for":        {"yc": -5,  "hype": +15, "mone": +10, "tech": +15},
    "tinder for":      {"yc": -5,  "hype": +15, "mone": +15, "burnout": +15},
    "netflix for":     {"yc": +0,  "hype": +10, "mone": +5},
    "airbnb for":      {"yc": +0,  "hype": +10, "tech": +15},

    # Red flags
    "free":            {"mone": +35},
    "donation":        {"mone": +40},
    "premium":         {"mone": -10},
    "freemium":        {"mone": +10},

    # Dating / lifestyle
    "dating":          {"yc": +0,  "burnout": +20, "mone": +15, "tech": +10},
    "gym":             {"yc": -5,  "mone": +20},
    "food":            {"yc": +0,  "mone": +10, "burnout": +10},

    # Funding hype words
    "platform":        {"yc": +5,  "hype": +5},
    "ecosystem":       {"yc": +5,  "hype": +10},
    "disrupt":         {"yc": -5,  "hype": +20},
    "revolutionary":   {"yc": -10, "hype": +25},
    "uberize":         {"yc": -10, "hype": +15},
}


def _clamp(n: int, lo: int = 0, hi: int = 100) -> int:
    return max(lo, min(hi, n))


def _score_to_difficulty(score: int) -> Difficulty:
    if score < 30:   return "Easy"
    if score < 55:   return "Medium"
    if score < 80:   return "Hard"
    return "Nightmare"


def _score_to_burnout_level(score: int) -> BurnoutLevel:
    if score < 30:   return "Low"
    if score < 60:   return "Medium"
    if score < 80:   return "High"
    return "Extreme"


def _classify_archetype(idea: str, scores: dict[str, int]) -> str:
    text = idea.lower()
    yc, hype, tech, mone = scores["yc"], scores["hype"], scores["tech"], scores["mone"]

    if any(k in text for k in ("nft", "web3", "dao", "token")):
        return "VC Money Burner"
    if "wrapper" in text or (("gpt" in text or "ai" in text) and tech < 35):
        return "AI Wrapper"
    if "saas" in text and "b2b" in text:
        return "Classic YC SaaS"
    if any(k in text for k in ("devtools", "developer", "infrastructure", "api")):
        return "Indie Hacker Goldmine"
    if "social" in text or "community" in text:
        return "Consumer Lifestyle Brand"
    if "uber for" in text or "tinder for" in text:
        return "Built During Hackathon at 3AM"
    if yc >= 60 and tech >= 40 and mone <= 50:
        return "Actually Genius"
    if hype > 60 and yc < 25:
        return "Solution Looking for Problem"
    if mone >= 70:
        return "Feature Not a Company"
    return "Classic YC SaaS"


def _revenue_models(idea: str) -> list[str]:
    text = idea.lower()
    models: list[str] = []
    if "b2b" in text or "enterprise" in text or "saas" in text:
        models += ["Enterprise SaaS", "Tiered Subscription"]
    if "consumer" in text or "social" in text or "dating" in text:
        models += ["Ads", "Premium Tier"]
    if "api" in text or "developer" in text or "devtools" in text:
        models += ["API Metered Pricing", "Free + Paid Tier"]
    if "marketplace" in text or "two-sided" in text:
        models += ["Transaction Fees", "Listing Fees"]
    if "ai" in text or "llm" in text or "gpt" in text:
        models += ["Usage-Based Pricing"]
    if not models:
        models = ["Subscription", "One-Time Purchase"]
    return models[:3]


def _first_year_revenue(scores: dict[str, int]) -> str:
    mone = scores["mone"]
    yc = scores["yc"]
    if mone >= 80:
        return "$0–$5k"
    if mone >= 60:
        return "$5k–$30k"
    if yc >= 55 and mone <= 40:
        return "$100k–$500k"
    if yc >= 35:
        return "$30k–$120k"
    return "$10k–$60k"


def _market_size(idea: str) -> tuple[str, str]:
    """Heuristic TAM bucket + one-line take. Returns (size, note)."""
    text = idea.lower()

    if any(k in text for k in ("healthcare", "health")):
        return "$500B+", "Huge — but heavily regulated."
    if "fintech" in text:
        return "$100B+", "Huge if you can survive compliance."
    if any(k in text for k in ("ai", "llm", "gpt")):
        return "$50B+", "Big, but everyone has the same idea."
    if any(k in text for k in ("enterprise", "b2b", "saas")):
        return "$2B–$15B", "Bigger than founders think."
    if "marketplace" in text or "two-sided" in text:
        return "$5B–$30B", "Real, but cold-start is brutal."
    if "consumer" in text or "social" in text:
        return "$10B–$50B", "Massive — and a graveyard."
    if any(k in text for k in ("education", "edtech")):
        return "$1B–$10B", "Real demand, hard to monetize."
    if any(k in text for k in ("crypto", "web3", "nft")):
        return "$3B–$20B", "Depends on the cycle. Currently down."
    if "dating" in text:
        return "$8B", "Crowded but evergreen."
    if "developer" in text or "devtools" in text:
        return "$30B+", "Hard to capture. Devs hate paying."
    if any(k in text for k in ("delivery", "logistics")):
        return "$50B+", "Margins thinner than your spreadsheet."

    # Default: deterministic pick based on idea text
    options = [
        ("$420M", "Niche, but someone will buy it."),
        ("$1.2B", "Decent — if you can find the wedge."),
        ("$650M", "Small, but you don't need to win all of it."),
        ("$2.1B", "Big enough to attract real competition."),
        ("$3.5B", "Real market. Real players. Real fight."),
        ("$890M", "Not huge, but defensible."),
    ]
    h = int(hashlib.md5(idea.encode()).hexdigest(), 16)
    return options[h % len(options)]


def _competitors(idea: str) -> list[str]:
    """Heuristic comparable companies based on keywords."""
    text = idea.lower()
    out: list[str] = []
    if "ai" in text or "llm" in text or "gpt" in text: out += ["ChatGPT", "Claude", "Perplexity"]
    if "social" in text: out += ["Reddit", "Discord"]
    if "dating" in text or "tinder" in text: out += ["Tinder", "Hinge", "Bumble"]
    if "fintech" in text: out += ["Stripe", "Brex"]
    if "marketplace" in text: out += ["Etsy", "Faire"]
    if "devtools" in text or "developer" in text: out += ["Vercel", "Linear"]
    if "education" in text or "edtech" in text: out += ["Duolingo", "Khan Academy"]
    if "delivery" in text: out += ["DoorDash", "Uber Eats"]
    if "crypto" in text or "web3" in text: out += ["Coinbase", "OpenSea"]
    if not out:
        out = ["Notion", "Linear", "Figma"]
    # Dedup, keep first 3
    seen = set()
    deduped = []
    for c in out:
        if c not in seen:
            deduped.append(c)
            seen.add(c)
    return deduped[:3]


def _tech_breakdown(idea: str, overall: int) -> TechBreakdown:
    text = idea.lower()
    def jitter(base: int, swing: int = 12) -> int:
        return _clamp(base + random.randint(-swing, swing))

    frontend = jitter(overall - 15)
    backend = jitter(overall)
    ai_system = jitter(overall + (20 if any(k in text for k in ("ai","llm","gpt","agent")) else -25))
    scaling = jitter(overall + (15 if any(k in text for k in ("marketplace","social","two-sided")) else -5))
    security = jitter(overall + (20 if any(k in text for k in ("fintech","healthcare","health","crypto")) else -5))

    return TechBreakdown(
        frontend=_score_to_difficulty(frontend),
        backend=_score_to_difficulty(backend),
        ai_system=_score_to_difficulty(ai_system),
        scaling=_score_to_difficulty(scaling),
        security=_score_to_difficulty(security),
    )


def score_idea(idea: str) -> dict:
    """Apply all keyword rules and return raw integer scores."""
    text = idea.lower()
    scores = dict(BASE)

    for keyword, deltas in KEYWORD_RULES.items():
        if keyword in text:
            for dim, delta in deltas.items():
                scores[dim] += delta

    # Length signal: very short ideas score lower on YC (low specificity)
    if len(idea.split()) < 5:
        scores["yc"] -= 10
        scores["hype"] += 5

    # Clamp all
    return {k: _clamp(v) for k, v in scores.items()}


def build_response(idea: str, final_verdict: str) -> AnalyzeResponse:
    """Compose the full response: scores (rules) + verdict (AI)."""
    scores = score_idea(idea)
    archetype = _classify_archetype(idea, scores)

    # Sleeps per week: inverse of burnout, with some noise
    sleeps = _clamp(7 - int(scores["burnout"] / 18) + random.randint(-1, 1), 0, 7)
    market_size, market_note = _market_size(idea)

    return AnalyzeResponse(
        idea=idea,
        yc_probability=scores["yc"],
        technical_difficulty=_score_to_difficulty(scores["tech"]),
        tech_breakdown=_tech_breakdown(idea, scores["tech"]),
        burnout_risk=scores["burnout"],
        burnout_level=_score_to_burnout_level(scores["burnout"]),
        monetization_difficulty=scores["mone"],
        hype_score=scores["hype"],
        startup_type=archetype,
        sleeps_per_week=sleeps,
        competitors=_competitors(idea),
        revenue_models=_revenue_models(idea),
        first_year_revenue=_first_year_revenue(scores),
        market_size=market_size,
        market_size_note=market_note,
        investor_reactions=build_investor_reactions(idea, scores),
        final_verdict=final_verdict,
    )
