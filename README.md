# Harmonious Home · v4.8

A responsive home intelligence and household project platform. Feng Shui, Vastu and practical building observations remain distinct; deterministic domain rules are authoritative, with optional bounded Groq language synthesis.

## v4.8 grounded Home AI, retrieval, local speech and responsive workspace navigation

- Added a dedicated **Home AI & knowledge** workspace with chat, a searchable reference library, topic filters, source cards and visible per-answer citations. It uses the authenticated household API; users must sign in and configure `GROQ_API_KEY` to chat.
- Expanded the curated reference registry to 41 public-access sources spanning Canadian home energy, radon and indoor air guidance; mould/moisture; HVAC; fire safety; food safety; gardening; accessibility/ergonomics; and healthy housing. The full source list and reuse notes are in [`docs_KNOWLEDGE_SOURCES.md`](docs_KNOWLEDGE_SOURCES.md).
- Built a real ingestion pipeline: server-side fetch with timeouts and size limits, HTML text extraction, heading/paragraph-aware 180-word chunks with 35-word overlap, stable chunk IDs, persistent source provenance, and a persistent vector index.
- **Dense semantic vectorization** uses the Apache-2.0 `@huggingface/transformers` JavaScript runtime and `onnx-community/all-MiniLM-L6-v2-ONNX` (384-dimensional mean-pooled, L2-normalized embeddings). Embeddings are generated locally in batches of 12 and cached under `HF_HOME` on the existing Render persistent disk. A normalized TF-IDF + adjacent-bigram fallback keeps retrieval usable if model download/runtime is unavailable.
- **Hybrid fetching** fuses dense cosine similarity with BM25-style lexical ranking (72/28 weighting), returns up to six evidence passages, and sends only those excerpts to the Groq model. The system prompt requires inline `[1]` citations, prohibits fabricated references and instructs the model to abstain when evidence is weak. API responses return exact source URLs, publisher, reuse note and excerpt alongside the answer.
- PGlite tables `knowledge_documents`, `knowledge_chunks` and `knowledge_meta` are added non-destructively. No existing household/workspace tables or Render disk paths are reset. Server startup checks for catalogue entries not yet indexed and ingests only missing/failed sources in the background. Re-ingest with `npm run rag:ingest`; force refresh with `npm run rag:ingest -- --force`.
- Added a collapsible left navigation rail, persisted collapsed state, a scrollable navigation list, responsive mobile behavior, animated knowledge hero, animated chat states, staggered reference cards, and reduced-motion support.
- The React narrator uses Kokoro-82M through the open-source `kokoro-js` package (Apache-2.0), synthesizing speech locally in the browser. It offers multiple US/UK English voices, adjustable speed, WebGPU selection with WebAssembly fallback, and no speech API key or server speech endpoint.

### v4.8 local neural speech and expanded RAG corpus

- Replaced Azure-dependent narration with `kokoro-js` (Apache-2.0) and the Kokoro-82M ONNX voice model. Select from American and British English voices and adjust speech generation speed. WebGPU is preferred when available; WebAssembly is the fallback. The first read downloads the model into the browser cache. No `AZURE_*` or `VITE_*` variables are needed for speech.
- Expanded the source catalogue from 16 to 41 references. New sources cover Canadian national building-code access, Ontario building and homeowner guidance, carbon monoxide, asbestos, lead and well water, septic care, pest management, emergency preparation, heat pumps, windows, weatherization, water heating, safer cleaning, radon mitigation, water efficiency, rain gardens, home gardening, furniture tip-over prevention, ENERGY STAR appliances and flood resilience.
- Startup compares the indexed document IDs with the catalogue and automatically ingests missing or failed entries. Existing ready documents are skipped. It then rebuilds the shared vector index to include the new passages. The existing Render PGlite database and disk mount are retained.
- Navigation remains collapsible and the navigation list scrolls independently within the fixed sidebar.

### RAG API and operational steps

- `GET /api/knowledge/documents` — authenticated source registry, ingestion status, chunk count and vectorizer metadata.
- `POST /api/assist/chat` — authenticated, rate-limited RAG chat with source citations.
- `GET /api/health` — now includes `knowledgeConfigured` and `knowledgeChunks`.
- Configure `HF_HOME=/var/data/hf-cache` (already added to `render.yaml`). The model downloads on first ingestion and remains cached on the persistent disk.
- Set `GROQ_API_KEY` for generated chat answers. No speech-related environment variables are required. `HF_HOME=/var/data/hf-cache` is used for the server-side RAG embedding model cache.

## v4.5 interaction, workspace tools and agentic assistance

The frontend baseline is React 19.3 with Vite 8.3 and the current official React plugin. The Render runtime is pinned to Node 22 (22.12 or newer) to satisfy the current Vite toolchain.

- **Motion for React** powers route transitions and measured-room canvas feedback; `prefers-reduced-motion` is respected.
- **Lucide React** provides scalable, accessible interface icons.
- **Sonner** provides consistent success/error notifications.
- **TanStack Query** caches and refreshes the API health signal.
- **Zustand** persists lightweight UI preferences only (currently the opt-in sound toggle).
- **Zod** validates project, maintenance and floor-plan room inputs and normalizes legacy workspace collections.
- **dnd-kit** enables pointer and keyboard-accessible project ordering; the order persists in the existing workspace payload.
- Maintenance views distinguish open, overdue, upcoming and completed tasks; completing a recurring item schedules its next occurrence.
- **Recharts** renders the responsive finance spending-category chart.

These libraries are intentionally used for concrete application flows rather than included as unused dependencies. Vite uses a root-relative asset base for reliable deep links and splits larger vendor groups into cacheable chunks. Audio remains opt-in and browser-local; no sound or speech is recorded or uploaded. Existing PGlite persistence and Render disk configuration are unchanged.


### v4.5 workspace productivity layer
- Three-stage project Kanban with pointer and keyboard drag/drop across Planned, In progress and Completed lanes; ordering and status are written to the existing workspace record.
- Floating workspace windows for Home Copilot, Quick Capture and Workspace Pulse. Windows can be dragged, minimized to a dock, maximized/restored and closed independently.
- Global command palette (`Ctrl+K` / `Cmd+K`) for fast navigation; Escape closes it.
- Quick Capture accepts pasted notes or dropped `.txt`, `.md` and `.csv` files up to 1.5 MB. File contents are read locally in the browser and stored as workspace notes; they are not uploaded.
- Home Copilot surfaces transparent local suggestions from current project, maintenance and budget records. Its optional AI planning workflow runs a Planner agent followed by a Safety Gate agent through `POST /api/assist/plan`; proposals require explicit user acceptance and are never auto-saved. The endpoint is rate-limited and requires `GROQ_API_KEY` (and optionally `GROQ_MODEL`). Assessment synthesis remains a separate bounded AI workflow. Neither workflow provides professional building, engineering, financial or safety advice.
- Workspace Pulse summarises project, maintenance and estimate counts. All floating panels are keyboard operable and use reduced-motion-aware transitions.

## v4.6 advanced speech, specialist agents and rich editing




- **React Flow** (`@xyflow/react` v12.12.1) renders the agent orchestration graph, specialist hand-offs, safety review and human approval stage.
- **Tiptap** (`@tiptap/react` v3.35.0, `@tiptap/starter-kit`, `@tiptap/extension-placeholder`) upgrades the room journal with rich text, lists, bold/italic formatting and undo/redo.
- The AI council now includes a Home Project Planner, Maintenance Triage Agent, Budget Steward Agent, Accessibility & Usability Reviewer and independent Safety Gate. Specialist outputs are separately screened; only the project ideas that pass the gate are offered for explicit user acceptance. AI insights remain advisory, cannot inspect the home, and do not write records automatically.
- Planning intents include whole-home priorities, maintenance/seasonal care, project sequencing, budget/procurement review, accessibility/usability and room organization. Budget prompts use only supplied numeric values and record counts; they do not invent amounts or provide financial advice.
- Vendor chunks separate React Flow and Tiptap from the application core.

### Advanced package catalogue (installed and used)

| Package | Implemented use |
|---|---|
| `motion` | Route, panel and micro-interaction transitions |
| `@dnd-kit/core`, `@dnd-kit/sortable` | Accessible Kanban drag-and-drop |
| `@xyflow/react` | Visual multi-agent workflow graph |
| `kokoro-js` | Browser-local open-source neural text-to-speech |
| `@huggingface/transformers` | Local MiniLM ONNX sentence embeddings for RAG |
| `@tiptap/react`, `@tiptap/starter-kit` | Rich room journal editor |
| `@tanstack/react-query` | Health/status query cache |
| `zustand` | Persisted interface and voice preferences |
| `zod` | Input validation and safe workspace normalization |
| `recharts` | Responsive finance visualizations |
| `sonner` | Action and error notifications |
| `lucide-react` | Consistent vector iconography |

Additional packages considered but not added include Three.js / React Three Fiber (a true 3D home model needs reliable geometry and interaction requirements), MapLibre (no location-based workflow currently requires a map), and a full workflow engine (the current AI jobs are bounded request/response tasks, not durable long-running processes). Avoiding unused dependencies keeps the app leaner and reduces maintenance/security surface.

## v4.3 platform capabilities

### Identity and account management
- Email/password registration and sign-in; passwords hashed with bcrypt.
- Signed HttpOnly session cookies, sign-out, profile-name editing, password changes and expiring one-time password reset links.
- Authentication and API rate limits; security headers; request size limits.
- Password reset and invitations can be delivered through Resend.

### Embedded PGlite workspace
- Embedded PGlite database with automatic schema bootstrap; optional demo-account seeding only when a private `DEMO_PASSWORD` is configured.
- Household-scoped workspace JSON persistence for profile, assessments, room journal, projects, measured plan, maintenance and financial records.
- Optimistic version checks prevent silent overwrites; authenticated users can sync across devices.
- Autosave to cloud after edits; manual refresh/save controls; local browser copy remains available offline.
- Workspace updates broadcast to connected members through Socket.IO.
- Audit log records cloud workspace update events.

### Household collaboration and permissions
- Household membership with owner, admin, editor and viewer roles.
- Email invitations with seven-day expiry and role assignment.
- Owner/admin member role management and member removal.
- Server-side authorization protects workspace writes and membership changes.
- Viewer role is read-only at the API boundary.

### Maintenance notifications
- Daily server-side scheduler checks due maintenance tasks.
- Idempotent notification-job records avoid duplicate delivery for the same task/date.
- Email delivery through Resend and browser push through Web Push/VAPID.
- Browser service worker displays and handles notification clicks.
- Set the scheduler timezone explicitly.

### Measured floor-plan studio
- Dimensioned rectangular rooms with editable width, depth and X/Y offsets.
- Metres/feet conversion, room area totals, conceptual doors and window markers.
- Select and edit rooms on a proportional SVG plan; export an SVG drawing.
- Explicit drawing and measurement disclaimers; this is not permit-ready CAD or a verified survey.

### Finance and procurement desk
- Transaction ledger with dates, vendor, category, net amount, manually entered tax, gross amount, status and reconciliation flag.
- Receipt attachment (PDF/JPEG/PNG, 700 KB maximum per attachment) and CSV ledger export.
- Vendor directory, purchase order register and invoice register with due dates/status.
- Budget headroom compares paid transactions and committed purchase orders with the working budget.
- Financial records are household workspace data and synchronise with cloud workspace updates.

### Finance desk interaction upgrade (v4.2)
- Finance overview with category spend bars, budget headroom, outstanding invoices and rule-based next-step suggestions.
- Dedicated transactions, vendors, purchase orders and invoices workspaces with search and status filters.
- Draft/approve/receive purchase-order flow; received orders can be staged as planned ledger entries for review before payment.
- Invoice overdue cues, duplicate invoice/vendor checks, receipt/reference completeness nudges and CSV export.
- Animated loading feedback, accessible status messaging, reduced-motion support and a top-level React error boundary.
- Finance data remains in the shared household workspace; the assistant surfaces checks but never makes payments or changes financial status without a user action.

### Existing home intelligence features
- Guided assessment, conceptual room explorer, report, assessment history and comparisons.
- Room journal, project planner, budget planning and maintenance register.
- Deterministic tool registry and bounded Groq synthesis roles.
- JSON backup/restore and local fallback when signed out or offline.

## Required configuration

Set `GROQ_API_KEY` to enable AI assessment synthesis and the optional two-agent workspace planner. Without it, deterministic local workspace insights, navigation, drag-and-drop and all ordinary workspace features continue to work.


Node.js 22.12 or newer. The embedded PGlite database is included as an application dependency; no external database server is required.

```bash
cp .env.example .env
# Set a cryptographically random JWT_SECRET (32+ characters) and optionally DATABASE_DIR
npm install
npm test
npm run build
npm start
```

### Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_DIR` | Embedded database directory; defaults to `./data/db` locally and `/var/data/db` on Render |
| `JWT_SECRET` | Strong random secret, at least 32 characters |
| `APP_URL` | Public application origin used in invitation/reset links |
| `RESEND_API_KEY`, `MAIL_FROM` | Optional email delivery for invitations, password reset and reminders |
| `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` | Optional Web Push delivery |
| `SCHEDULER_TIMEZONE` | Time zone for daily reminder schedule; defaults to `America/Toronto` |
| `GROQ_API_KEY`, `GROQ_MODEL` | Optional language synthesis |
| `HF_HOME` | Persistent Hugging Face/ONNX model cache for server-side RAG embeddings (Render: `/var/data/hf-cache`) |
| `ALLOWED_ORIGINS` | Optional comma-separated CORS origins; same-origin deployment can leave blank |

Generate VAPID keys with:

```bash
npx web-push generate-vapid-keys
```

For email, verify the sender domain with Resend and set `MAIL_FROM`. Set `APP_URL` to the actual HTTPS Render service URL. Email delivery is not active without both `RESEND_API_KEY` and `MAIL_FROM`. Push delivery is not active without both VAPID keys; each user must opt in from Accounts & household on each browser/device.

## Deploy to Render (embedded local database)

1. Push the project to the existing GitHub repository.
2. In Render, create a Blueprint from that repository and select `render.yaml`.
3. The blueprint creates a Node web service with a 1 GB persistent disk mounted at `/var/data`. No hosted PostgreSQL service or `DATABASE_URL` is required.
4. The embedded PGlite database is initialized at `/var/data/db`; schema is created automatically on first startup.
5. To seed a demo account, set a strong private `DEMO_PASSWORD` environment variable before first startup. If unset, demo-account seeding is skipped; users can register normally. Never commit the demo password to source control. If the database was already seeded, changing the environment variable does not reset that existing account password.
6. Optionally configure `APP_URL`, Resend sender/API key and VAPID keys for email/push reminders. Add `GROQ_API_KEY` for AI synthesis.
7. Verify `/api/health` reports `status: ok` and `database: connected`.

The persistent disk is required: without it, local database changes can be lost when the service is replaced. This embedded database setup is intended for a single web-service instance, not horizontal scaling or high-concurrency production. Render's persistent disk and starter web service may incur charges; review current pricing before creating the Blueprint.

## API overview

- `GET /api/health` — database/auth/AI/push/knowledge readiness.
- `GET /api/knowledge/documents` — authenticated document and vector index status.
- `POST /api/assist/chat` — authenticated RAG chat with returned source citations.
- `POST /api/auth/register`, `/login`, `/logout`, `/forgot-password`, `/reset-password`, `/change-password`; `GET /api/auth/me`; `PATCH /api/auth/profile`.
- `GET /api/household`; `POST /api/household/invites`, `/accept`; `PATCH/DELETE /api/household/members/:id`.
- `GET/PUT /api/workspace` — authenticated household workspace with version conflict checks.
- `GET /api/push/key`, `POST /api/push/subscribe`.
- `GET /api/tools`, `POST /api/tools/:tool`, `POST /api/assess`.

## Security and operational requirements before public launch

- Use HTTPS only; configure a strong secret and restrict CORS if serving a separate frontend.
- Configure persistent-disk backups, restore drills, monitoring and alerting. For multi-instance or higher-scale deployment, migrate to managed PostgreSQL.
- Configure Resend sender-domain verification and VAPID keys; monitor provider delivery failures.
- The reminder scheduler runs inside the web process. For multiple web instances, notification-job uniqueness prevents duplicate sends, but use a dedicated worker/queue and distributed scheduler for higher-scale deployments.
- Current workspace persistence stores household data as versioned JSONB. It is suitable for the product's current feature set, but high-scale analytics and complex accounting should move to normalized domain tables.
- Rate limiting is per process; use a shared gateway/Redis-backed limiter when scaling horizontally.
- The app does not process payments, connect to bank feeds, provide tax/accounting assurance or guarantee legal invoice compliance. Tax is entered manually. Keep original receipts and obtain professional accounting advice.
- The floor plan is a dimensioned concept drawing based on user-entered measurements. It is not a survey, architectural CAD model, code compliance check or construction/permit document. Verify with qualified professionals.
- Feng Shui/Vastu rules are illustrative and not expert-certified. Safety, accessibility, fire egress, ventilation and building performance take precedence over symbolic recommendations.

## Tests

```bash
npm test
npm run build
```

The domain tests validate deterministic assessment rules. Run `npm run rag:ingest` to populate or refresh the reference corpus; end-to-end tests against a live embedded-database/Render environment should be run before production release.

## Routing and API discovery (introduced in v4.3)

All main application modules now have direct URLs under `/app/`: `/app/overview`, `/app/assessment`, `/app/room-plan`, `/app/explorer`, `/app/room-journal`, `/app/projects`, `/app/budget`, `/app/finance/overview`, `/app/maintenance`, `/app/compare`, `/app/history`, `/app/household`, `/app/settings`, and `/app/home-assistant`. Finance submodules have dedicated URLs at `/app/finance/{overview,transactions,vendors,orders,invoices}`. Express serves the SPA entry point for direct route refreshes while `/api/*` remains reserved for JSON APIs.

API discovery is available at `GET /api` and `GET /api/v1`; health is `GET /api/health`. The API catalogue lists implemented endpoints and authentication requirements. Finance records are persisted inside the versioned household workspace payload and also exposed through authenticated `GET/PUT /api/finance` endpoints with role checks, payload-size limits, audit entries and optimistic concurrency. Project, maintenance and room data use the shared `GET/PUT /api/workspace` endpoints. Browser-local mode remains available, and the existing authenticated workspace endpoint is the cloud persistence boundary.

Audio is opt-in. The narrator uses Microsoft Cognitive Services Speech SDK with a short-lived token; interface sound effects are generated locally only after the user enables them. No audio recording is created.


## v4.9.0 — GitHub + Render Free mode

This release removes the persistent Render disk requirement. Server-side PGlite is opened in memory only; it is temporary and is not a durable account/workspace database. The main household profile, assessment history and workspace state are stored in the user's browser localStorage. Use the in-app Data & Settings page to export/import JSON backups regularly.

**Limitations:** browser-local data does not sync between devices or users, and can be lost if browser site data is cleared. Server-side operational tables, authentication sessions, RAG index state and other server records reset when the Render instance restarts. Cloud account management and household collaboration are not persistent in this deployment mode.

### Render Free configuration

- Build command: `ONNXRUNTIME_NODE_INSTALL_CUDA=skip yarn install && yarn build`
- Start command: `yarn start`
- No persistent disk.
- Do not configure `DATABASE_DIR` or `HF_HOME`.
- Set `GROQ_API_KEY` to enable Groq-generated responses.
- `GROQ_MODEL` defaults to `openai/gpt-oss-20b`.
- `JWT_SECRET` should be a long random secret if session/token endpoints are used.
- `RAG_DISABLE_EMBEDDINGS=true` avoids downloading/caching the dense embedding model; lexical retrieval is used instead.
- The RAG catalogue remains in the GitHub repository. Its runtime index is rebuilt in memory after cold starts.

The Render Free service has an ephemeral filesystem and may spin down. This project intentionally avoids writing household data to the server filesystem.


## v5.0.0 deployment note

The Render Blueprint now runs `yarn install --production=false` before the Vite build. This is intentional: Vite is a development dependency, but it is required at build time even when the deployed runtime uses `NODE_ENV=production`. The `.npmrc` CUDA workaround remains in place for the Kokoro/ONNX dependency tree.

Quick navigation is available with `Ctrl+K` (Windows/Linux) or `⌘K` (macOS). Household data remains local to the browser in Free Mode; export backups regularly.

## v5.2.0 — Local-first resilience

This refinement adds defensive local-storage handling, storage footprint diagnostics, safer backup restoration, and a versioned offline application shell. The service worker caches the app shell and same-origin static assets only; it deliberately does not cache `/api` responses. Render Free remains diskless and server-side PGlite data remains ephemeral. See `docs/V5_1_100_POINT_REFINEMENT_REGISTER.md` for the 100-point refinement register and deployment constraints.

Render build command:

```bash
ONNXRUNTIME_NODE_INSTALL_CUDA=skip yarn install --production=false && yarn build
```

## v5.2.0 — Experience Studio

The Experience Studio is available at `/app/experience-studio` and from the sidebar. It contains guided household journeys, direct links into existing modules, 20 experience domains and design principles. The complete 1,000-item screen and workflow idea catalogue is in `docs/V5_2_1000_EXPERIENCE_IDEAS.md`. Catalogue entries are roadmap ideas unless explicitly implemented in the interface; they should not be interpreted as shipped functionality.

This release adds no paid service, external database, or new runtime dependency. It retains browser-local household storage and the existing Render Free deployment model.
