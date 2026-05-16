# StartupJudge AI

> Pitch your startup. Get judged instantly by a simulated panel of YC reviewers, VCs, engineers, and exhausted founders.

## Architecture

```
rate_my_startup/
├── backend/        FastAPI · rule-based scoring · Groq for verdict
└── frontend/       Next.js 14 · Tailwind · Framer Motion
```

**Cost-saving design:** most ratings are computed deterministically from keyword rules (YC %, burnout, technical difficulty, monetization, hype, investor reactions). Only the **final verdict** calls the AI — keeping responses fast and bills near zero.

## Backend setup

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# edit .env and paste your Groq API key (https://console.groq.com/keys)
uvicorn app.main:app --reload --port 8000
```

Verify: open <http://localhost:8000/health> — should return `{"status":"ok","groq_configured":true}`.

If `groq_configured` is `false`, the backend still works but will use a hardcoded fallback verdict.

## Frontend setup

```powershell
cd frontend
npm install
copy .env.local.example .env.local
npm run dev
```

Open <http://localhost:3000>.

## API

`POST /api/analyze`

Request:
```json
{ "idea": "AI therapist for programmers" }
```

Response (abbreviated):
```json
{
  "idea": "AI therapist for programmers",
  "yc_probability": 42,
  "technical_difficulty": "Medium",
  "tech_breakdown": { "frontend": "Easy", "backend": "Medium", "ai_system": "Hard", "scaling": "Medium", "security": "Medium" },
  "burnout_risk": 75,
  "burnout_level": "High",
  "monetization_difficulty": 60,
  "hype_score": 73,
  "startup_type": "AI Wrapper",
  "sleeps_per_week": 3,
  "competitors": ["ChatGPT", "Claude", "Perplexity"],
  "revenue_models": ["Usage-Based Pricing", "Subscription"],
  "first_year_revenue": "$10k–$60k",
  "investor_reactions": [
    { "persona": "Silicon Valley VC", "emoji": "💼", "reaction": "Interesting AI angle — but what's the moat once GPT-5 ships?" },
    { "persona": "Burnt-Out Engineer", "emoji": "😤", "reaction": "Your inference bill is going to be larger than your revenue." },
    { "persona": "Crypto Bro", "emoji": "🚀", "reaction": "AI + crypto is the meta. Add a $TOKEN immediately." },
    { "persona": "Indian Uncle Investor", "emoji": "🤔", "reaction": "Same as ChatGPT only? Then why pay you?" }
  ],
  "final_verdict": "<Groq-generated 2-3 sentence verdict>"
}
```

## Deployment

- **Frontend → Vercel:** point at `frontend/`, set `NEXT_PUBLIC_API_URL` to the deployed backend URL.
- **Backend → Render / Railway:** point at `backend/`, set `GROQ_API_KEY` and `ALLOWED_ORIGINS` (your Vercel URL).

## Phase 2 / Phase 3 (not yet built)

- Shareable image card (html-to-image or server-side render)
- Public startup feed + voting (Supabase)
- Weekly leaderboards
- Multiplayer roast battles
