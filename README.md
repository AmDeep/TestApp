# Harmonious Home · v4.5

A responsive home intelligence and household project platform. Feng Shui, Vastu and practical building observations remain distinct; deterministic domain rules are authoritative, with optional bounded Groq language synthesis.

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

- `GET /api/health` — database/auth/AI/push readiness.
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

The domain tests validate the deterministic assessment rules. End-to-end tests against a live embedded-database/Render environment should be run before production release.

## Routing and API discovery (introduced in v4.3)

All main application modules now have direct URLs under `/app/`: `/app/overview`, `/app/assessment`, `/app/room-plan`, `/app/explorer`, `/app/room-journal`, `/app/projects`, `/app/budget`, `/app/finance/overview`, `/app/maintenance`, `/app/compare`, `/app/history`, `/app/household`, and `/app/settings`. Finance submodules have dedicated URLs at `/app/finance/{overview,transactions,vendors,orders,invoices}`. Express serves the SPA entry point for direct route refreshes while `/api/*` remains reserved for JSON APIs.

API discovery is available at `GET /api` and `GET /api/v1`; health is `GET /api/health`. The API catalogue lists implemented endpoints and authentication requirements. Finance records are persisted inside the versioned household workspace payload and also exposed through authenticated `GET/PUT /api/finance` endpoints with role checks, payload-size limits, audit entries and optimistic concurrency. Project, maintenance and room data use the shared `GET/PUT /api/workspace` endpoints. Browser-local mode remains available, and the existing authenticated workspace endpoint is the cloud persistence boundary.

Audio features are opt-in and browser-native: Listen uses speech synthesis where supported, while interface sounds are generated locally only after the user enables them. No audio is recorded or uploaded.
