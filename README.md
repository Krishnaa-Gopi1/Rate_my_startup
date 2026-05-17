# Startup Roast

> Pitch your startup. Get roasted instantly by a simulated panel of YC reviewers, VCs, engineers, and exhausted founders.

## Architecture

```
rate_my_startup/
├── backend/        FastAPI · rule-based scoring · Groq for verdict
└── frontend/       Next.js 14 · Tailwind · Framer Motion
```

**Cost-saving design:** most ratings are computed deterministically from keyword rules (YC %, burnout, technical difficulty, monetization, hype, market size, archetype). Only the **final verdict** calls the AI — keeping responses fast and bills near zero.

---

## Local development

### Backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# edit .env and paste your Groq API key from https://console.groq.com/keys
uvicorn app.main:app --reload --port 8000
```

Verify: <http://localhost:8000/health> returns `{"status":"ok","groq_configured":true}`.

### Frontend

```powershell
cd frontend
npm install
copy .env.local.example .env.local
npm run dev
```

Open <http://localhost:3000>.

---

## Deployment (5-minute walkthrough)

The standard stack: **Render for the backend, Netlify for the frontend**. Both have free tiers.

### Step 1 — Deploy the backend to Render

1. Sign in to <https://render.com> with GitHub.
2. Click **New → Blueprint**.
3. Select this repo. Render reads `render.yaml` and proposes one service: `rate-my-startup-api`.
4. When prompted for secrets:
   - `GROQ_API_KEY` — paste your key from <https://console.groq.com/keys>
   - `ALLOWED_ORIGINS` — set to `https://your-app.netlify.app` (you'll get this URL in Step 2; you can leave blank for now and come back)
5. Click **Apply**. Wait ~2 minutes for the build + deploy.
6. Copy the live URL — looks like `https://rate-my-startup-api.onrender.com`. Verify `/health` returns `{"status":"ok","groq_configured":true}`.

**Note on cold starts:** Render's free tier sleeps after 15 min of inactivity. First request after sleep takes ~30s.

### Step 2 — Deploy the frontend to Netlify

1. Sign in to <https://app.netlify.com> with GitHub.
2. Click **Add new site → Import an existing project**, select GitHub, then choose this repo.
3. Netlify will auto-detect the config from `netlify.toml` (base: `frontend`, build: `npm run build`).
4. **Environment Variables:** click **Show advanced** → **New variable**
   - `NEXT_PUBLIC_API_URL` = the Render URL from Step 1 (e.g. `https://rate-my-startup-api.onrender.com`) — no trailing slash!
5. Click **Deploy**. Wait ~1-2 minutes.
6. Copy the Netlify URL — looks like `https://rate-my-startup.netlify.app`.

### Step 3 — Wire CORS

Go back to your Render service → **Environment** tab → update `ALLOWED_ORIGINS` to your Netlify URL from Step 2 → save. Render redeploys automatically.

`render.yaml` already sets `ALLOWED_ORIGIN_REGEX=https://.*\.netlify\.app`, so all Netlify preview URLs work out of the box. `ALLOWED_ORIGINS` is just for the production domain (and any custom domain you add later).

Done. Open the Netlify URL and roast something.

---

## API

`POST /api/analyze`

Request:
```json
{ "idea": "AI therapist for programmers" }
```

Returns scores (rule-based) + a final verdict (AI-generated):
```json
{
  "idea": "...",
  "yc_probability": 42,
  "technical_difficulty": "Medium",
  "tech_breakdown": { "frontend": "Easy", "backend": "Medium", ... },
  "burnout_risk": 75,
  "burnout_level": "High",
  "monetization_difficulty": 60,
  "hype_score": 73,
  "startup_type": "AI Wrapper",
  "sleeps_per_week": 3,
  "competitors": ["ChatGPT", "Claude", "Perplexity"],
  "revenue_models": ["Usage-Based Pricing", "Subscription"],
  "first_year_revenue": "$10k–$60k",
  "market_size": "$50B+",
  "market_size_note": "Big, but everyone has the same idea.",
  "investor_reactions": [
    { "persona": "Silicon Valley VC", "emoji": "💼", "reaction": "..." },
    ...
  ],
  "final_verdict": "<Groq-generated 2-3 sentence verdict>"
}
```

---

## Backend env vars

| Var | Required | Default | Notes |
|---|---|---|---|
| `GROQ_API_KEY` | for AI verdicts | — | Falls back to a hardcoded verdict if unset |
| `GROQ_MODEL` | no | `llama-3.3-70b-versatile` | Any Groq chat model |
| `ALLOWED_ORIGINS` | yes (prod) | `http://localhost:3000` | Comma-separated list |
| `ALLOWED_ORIGIN_REGEX` | no | — | e.g. `https://.*\.netlify\.app` for preview deploys |

## Phase 2 / Phase 3 (not yet built)

- Shareable image card (html-to-image or server-side render)
- Public startup feed + voting (Supabase)
- Weekly leaderboards (currently mock data)
- Multiplayer roast battles
