"""Template-based investor personas.

Each persona has a pool of reactions tagged by trigger category. The right
reaction is picked based on the idea's keywords and computed scores.
"""
from __future__ import annotations

import random

from app.models.schemas import InvestorReaction


# Each persona maps a "trigger" category -> list of templated lines.
# Triggers are selected based on idea content and scores; "default" is fallback.
PERSONAS: dict[str, dict] = {
    "vc": {
        "name": "Silicon Valley VC",
        "emoji": "💼",
        "lines": {
            "ai": [
                "Interesting AI angle — but what's the moat once GPT-5 ships?",
                "We're seeing a lot of these. What's distribution look like?",
                "I'd want to see proprietary data here before writing a check.",
            ],
            "crypto": [
                "Token economics aside — is there a real user need?",
                "We did web3 in 2021. What's different now?",
                "The TAM is real, but regulatory risk is non-trivial.",
            ],
            "saas": [
                "Strong wedge if you can crack distribution.",
                "Vertical SaaS is back. Who's the design partner?",
                "What's the CAC payback period look like?",
            ],
            "marketplace": [
                "Two-sided marketplaces are hard but defensible if you win.",
                "How are you solving the cold-start problem?",
                "Liquidity is everything here. Talk to me about supply.",
            ],
            "consumer": [
                "Consumer is brutal. What's your organic growth loop?",
                "Could become huge if distribution works.",
                "I love the energy but consumer is a graveyard.",
            ],
            "low_yc": [
                "I don't see the venture-scale outcome here.",
                "Feels more like a lifestyle business than a fund return.",
                "Help me understand how this gets to $100M ARR.",
            ],
            "high_yc": [
                "This could scale aggressively if execution holds.",
                "Strong founder-market fit narrative. Let's talk terms.",
                "If you nail this, we're looking at a category-defining company.",
            ],
            "default": [
                "Interesting market opportunity, unclear moat.",
                "I'd need to see the unit economics before I commit.",
                "What's the wedge? What do you nail first?",
            ],
        },
    },

    "engineer": {
        "name": "Burnt-Out Engineer",
        "emoji": "😤",
        "lines": {
            "ai": [
                "Your inference bill is going to be larger than your revenue.",
                "Hope you enjoy rate limits and 3am OpenAI outages.",
                "You are underestimating prompt-injection blast radius.",
            ],
            "crypto": [
                "Smart contract audits will cost more than your seed round.",
                "One bug and the entire treasury is gone. Good luck sleeping.",
                "On-chain for the sake of on-chain. Why.",
            ],
            "marketplace": [
                "Real-time matching at scale is a nightmare. Trust me.",
                "Two-sided marketplaces means twice the support tickets.",
                "Wait until you have to build the dispute resolution system.",
            ],
            "scaling": [
                "Your Postgres will die at 100k users. Plan for it now.",
                "This will require Kafka by month 6 and you don't have a backend engineer.",
                "I've seen this architecture before. It does not end well.",
            ],
            "social": [
                "Content moderation is going to ruin your weekends.",
                "Spam, harassment, CSAM — pick your poison.",
                "Hope you like being a Trust & Safety team of one.",
            ],
            "hardware": [
                "Hardware? I'm out. Margins, supply chain, returns. No thanks.",
                "Firmware updates over cellular will haunt you forever.",
                "Have you ever debugged a manufacturing defect at 2am?",
            ],
            "default": [
                "This sounds simple in the deck and impossible in production.",
                "You're underestimating the infrastructure complexity by 10x.",
                "Who's going to be on call when this breaks at 3am?",
            ],
        },
    },

    "crypto": {
        "name": "Crypto Bro",
        "emoji": "🚀",
        "lines": {
            "default": [
                "Can this be on-chain? Token would 100x the engagement.",
                "WAGMI — but have you considered a points program?",
                "Bro, tokenize the users. Tokenize EVERYTHING.",
                "This screams 'airdrop strategy'. Drop me your TG.",
                "Mainnet launch when? I'm aping in.",
            ],
            "ai": [
                "AI + crypto is the meta. Add a $TOKEN immediately.",
                "Decentralized inference with token rewards = print money.",
                "This is begging for an agentic crypto wrapper.",
            ],
            "consumer": [
                "Reward users with tokens. Solves your retention problem instantly.",
                "Loyalty points but on Solana. You're welcome.",
            ],
            "marketplace": [
                "Marketplace with native token? Insta-bull.",
                "Royalties on every transaction. Web3 has solved this.",
            ],
        },
    },

    "uncle": {
        "name": "Indian Uncle Investor",
        "emoji": "🤔",
        "lines": {
            "default": [
                "But when profit?",
                "Customer is paying or only downloading?",
                "Beta launch since 2 years? Why no revenue?",
                "Sharma uncle's son is doing same thing. Already break-even.",
                "How much salary you are taking from this?",
                "Forget all this — just open a chai franchise. Guaranteed return.",
            ],
            "ai": [
                "Same as ChatGPT only? Then why pay you?",
                "AI is free, no? OpenAI is doing for free na?",
            ],
            "free": [
                "Free means free? Then who is paying salary?",
                "If product is free, you are the product. I know this dialogue.",
            ],
            "consumer": [
                "Why young people will pay for this? Just use Instagram.",
                "My nephew can build this in one week, he is in 9th class.",
            ],
        },
    },
}


def _pick_trigger(persona_key: str, idea: str, scores: dict[str, int]) -> str:
    """Pick the best-matching trigger category for a persona based on the idea."""
    text = idea.lower()
    yc = scores["yc"]
    mone = scores["mone"]

    if persona_key == "vc":
        if yc >= 55:
            return "high_yc"
        if yc <= 20:
            return "low_yc"
        if "crypto" in text or "web3" in text or "blockchain" in text: return "crypto"
        if "ai" in text or "llm" in text or "gpt" in text: return "ai"
        if "marketplace" in text or "two-sided" in text: return "marketplace"
        if "saas" in text or "b2b" in text or "enterprise" in text: return "saas"
        if "consumer" in text or "social" in text: return "consumer"
        return "default"

    if persona_key == "engineer":
        if "ai" in text or "llm" in text or "gpt" in text: return "ai"
        if "crypto" in text or "blockchain" in text: return "crypto"
        if "marketplace" in text or "two-sided" in text: return "marketplace"
        if "social" in text or "community" in text: return "social"
        if "hardware" in text or "drone" in text or "iot" in text or "robot" in text:
            return "hardware"
        if "scal" in text or scores["tech"] >= 60:
            return "scaling"
        return "default"

    if persona_key == "crypto":
        if "ai" in text or "llm" in text: return "ai"
        if "marketplace" in text: return "marketplace"
        if "consumer" in text or "social" in text or "dating" in text: return "consumer"
        return "default"

    if persona_key == "uncle":
        if "ai" in text or "gpt" in text or "llm" in text: return "ai"
        if "free" in text or mone >= 70: return "free"
        if "consumer" in text or "social" in text: return "consumer"
        return "default"

    return "default"


def build_investor_reactions(idea: str, scores: dict[str, int]) -> list[InvestorReaction]:
    out: list[InvestorReaction] = []
    for key, persona in PERSONAS.items():
        trigger = _pick_trigger(key, idea, scores)
        lines = persona["lines"].get(trigger) or persona["lines"]["default"]
        out.append(InvestorReaction(
            persona=persona["name"],
            emoji=persona["emoji"],
            reaction=random.choice(lines),
        ))
    return out
