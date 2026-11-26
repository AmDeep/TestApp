# Harmonious Home — React + Groq Demo

Adaptive home-assessment prototype for Indian households.  
**Feng Shui first · Optional separate Vastu lens · Deterministic rules + Groq agents**

## Features

- 4-step progressive questionnaire
- Client + server deterministic rule engine (traditions kept distinct)
- Groq Chat Completions for natural-language synthesis (when `GROQ_API_KEY` is set)
- Graceful fallback to rules-only mode if no key or API error
- Recommendation cards with priority, basis, action, alternative, confidence, cost
- Hard safety do-not list
- Ready for Render (Node web service)

## Quick start

```bash
cp .env.example .env
# Put a real Groq key in .env  →  https://console.groq.com

npm install
npm run build
npm start
```

Open http://localhost:3000

### Development (hot reload frontend + API)

Terminal 1:
```bash
npm run dev:server   # Express on :3000
```

Terminal 2:
```bash
npm run dev          # Vite on :5173, proxies /api → :3000
```

## How Groq is used

1. Browser posts the profile to `POST /api/assess`.
2. Server always runs the deterministic rule engine (`src/domain.js`).
3. If `GROQ_API_KEY` is present, the server calls Groq (`src/agents.js`) to:
   - produce a short headline
   - write a neutral overall note
   - rephrase the findings into clear recommendation cards  
   The model is instructed **never** to invent rules, citations or life-outcome claims.
4. If Groq is missing or fails, the pure rule findings are returned.

Default model: `openai/gpt-oss-20b` (configurable via `GROQ_MODEL`).

## Deploy on Render

1. Push this folder to GitHub / GitLab / Bitbucket.
2. Render Dashboard → **New** → **Web Service** (or use the Blueprint `render.yaml`).
3. Settings:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment:** add `GROQ_API_KEY` = your key from console.groq.com
4. Deploy. The service serves both the API and the built React app.

Free tier is fine for a demo; watch rate limits on the Groq side.

## Project layout

```
├── server.js          Express API + static serve
├── src/
│   ├── App.jsx        React questionnaire + results
│   ├── domain.js      Questions helpers + deterministic rules
│   ├── agents.js      Groq synthesis agent
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── .env.example
├── render.yaml
└── package.json
```

## Design principles (from the source document)

1. Keep traditions distinct.  
2. Do not invent certainty.  
3. Separate traditional interpretation from building performance.  
4. Respect existing homes — start with safe, reversible options.  
5. Respect household choice.  
6. No deterministic life-outcome claims.  
7. Explain every recommendation.  
8. No single universal score.  
9. India is not one climate or house type.  
10. Safety and accessibility outrank symbolic preference.

---

Prototype · Not a production-certified assessment product
