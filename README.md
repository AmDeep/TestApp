# Harmonious Home · v2.0

A responsive home-assessment application for Indian households. It keeps Feng Shui, Vastu and practical building observations distinct, with a deterministic rule engine as the source of truth and optional bounded Groq language synthesis.

## What is included

- Responsive dashboard, guided assessment, room explorer, report view and local assessment history.
- Four-step questionnaire with adaptive completeness and missing-context feedback.
- Existing deterministic rules retained in `src/domain.js`.
- Three bounded AI roles: Tradition Interpreter, Feasibility & Safety Agent, and Report Synthesizer.
- AI output is constrained to existing finding IDs; deterministic actions, priority, basis, caveats and confidence remain authoritative.
- Explicit backend tool registry: `evaluate_home_rules`, `get_missing_questions`, `get_safety_constraints`, `calculate_completeness`.
- JSON export, browser-local persistence, server health endpoint, input validation and basic per-IP request throttling.
- Render blueprint and Node 20 deployment configuration.

## Local development

Requirements: Node.js 20+.

```bash
npm ci
cp .env.example .env
# Optional: add GROQ_API_KEY to .env
npm run dev:server
```

In another terminal:

```bash
npm run dev
```

Vite runs on `http://localhost:5173` and proxies `/api` to Express on port 3000.

Production-like local run:

```bash
npm run build
npm start
```

Open `http://localhost:3000`.

## Deploy to Render

1. Push this repository to a Git provider.
2. In Render, choose **New → Blueprint** and select the repository containing `render.yaml`.
3. Render installs dependencies, builds the Vite app and starts Express.
4. Add `GROQ_API_KEY` as a secret environment variable if AI synthesis is wanted. Without it, the app remains fully usable in deterministic rules-only mode.
5. Confirm `/api/health` returns `status: "ok"`.

The server binds to `0.0.0.0` and uses Render's injected `PORT`.

## API

- `GET /api/health` — service status, AI configuration and registered tool names.
- `GET /api/tools` — discover the deterministic tool registry.
- `POST /api/tools/:tool` — execute one registered tool with `{ "profile": { ... } }`.
- `POST /api/assess` — full deterministic assessment and optional AI explanation.

Supported tool names: `evaluate_home_rules`, `get_missing_questions`, `get_safety_constraints`, `calculate_completeness`.

## Privacy and data handling

Assessment history and profile drafts are saved in this browser's local storage. Submitting an assessment sends the profile to this application's server; if `GROQ_API_KEY` is configured, the server sends the assessment context to Groq for language synthesis. Do not enter names, exact addresses or sensitive personal information. Browser-local data is not an account-backed or synchronised backup.

## Important limitations

This is an illustrative guidance product, not a certified Feng Shui or Vastu consultation, building inspection, engineering assessment or health service. The room plan is conceptual and not to scale. No full Flying Stars / Luopan computation is implemented. Do not undertake structural, gas, electrical or plumbing changes based on this app. Safety, accessibility, fire egress, ventilation and building performance take priority over symbolic preferences.

## Validation

```bash
npm test
npm run build
```
