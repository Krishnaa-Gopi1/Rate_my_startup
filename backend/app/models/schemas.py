from __future__ import annotations

from typing import Literal
from pydantic import BaseModel, Field

Difficulty = Literal["Easy", "Medium", "Hard", "Nightmare"]
BurnoutLevel = Literal["Low", "Medium", "High", "Extreme"]


class AnalyzeRequest(BaseModel):
    idea: str = Field(..., min_length=3, max_length=500)


class TechBreakdown(BaseModel):
    frontend: Difficulty
    backend: Difficulty
    ai_system: Difficulty
    scaling: Difficulty
    security: Difficulty


class InvestorReaction(BaseModel):
    persona: str
    emoji: str
    reaction: str


class AnalyzeResponse(BaseModel):
    idea: str
    yc_probability: int
    technical_difficulty: Difficulty
    tech_breakdown: TechBreakdown
    burnout_risk: int
    burnout_level: BurnoutLevel
    monetization_difficulty: int
    hype_score: int
    startup_type: str
    sleeps_per_week: int
    competitors: list[str]
    revenue_models: list[str]
    first_year_revenue: str
    market_size: str
    market_size_note: str
    investor_reactions: list[InvestorReaction]
    final_verdict: str
