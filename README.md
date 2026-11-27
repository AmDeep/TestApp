# Harmonious Home · v4.0

A responsive home intelligence and household project platform. Feng Shui, Vastu and practical building observations remain distinct; deterministic domain rules are authoritative, with optional bounded Groq language synthesis.

## v4 platform capabilities

### Identity and account management
- Email/password registration and sign-in; passwords hashed with bcrypt.
- Signed HttpOnly session cookies, sign-out, profile-name editing, password changes and expiring one-time password reset links.
- Authentication and API rate limits; security headers; request size limits.
- Password reset and invitations can be delivered through Resend.

### PostgreSQL cloud workspace
- Render PostgreSQL database with schema bootstrap at server startup.
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

### Existing home intelligence features
- Guided assessment, conceptual room explorer, report, assessment history and comparisons.
- Room journal, project planner, budget planning and maintenance register.
- Deterministic tool registry and bounded Groq synthesis roles.
- JSON backup/restore and local fallback when signed out or offline.

## Required configuration

Node.js 20+ and PostgreSQL 13+.

```bash
cp .env.example .env
# Set DATABASE_URL and a cryptographically random JWT_SECRET (32+ characters)
npm install
npm test
npm run build
npm start
```

### Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
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

## Deploy to Render

1. Push this project to a Git repository.
2. Create a Render Blueprint from `render.yaml`.
3. The blueprint provisions a web service and PostgreSQL database, injects the database connection string and generates a JWT secret.
4. Set `APP_URL` to the deployed HTTPS origin. Configure `RESEND_API_KEY` and `MAIL_FROM` for invitation, reset and maintenance email. Configure VAPID keys for browser push.
5. Optionally set `GROQ_API_KEY` for AI synthesis.
6. Wait for schema bootstrap, then verify `/api/health` reports `status: ok` and `database: connected`.

The Render blueprint uses paid starter web/database resources; review Render pricing and choose appropriate plans before deploying.

## API overview

- `GET /api/health` — database/auth/AI/push readiness.
- `POST /api/auth/register`, `/login`, `/logout`, `/forgot-password`, `/reset-password`, `/change-password`; `GET /api/auth/me`; `PATCH /api/auth/profile`.
- `GET /api/household`; `POST /api/household/invites`, `/accept`; `PATCH/DELETE /api/household/members/:id`.
- `GET/PUT /api/workspace` — authenticated household workspace with version conflict checks.
- `GET /api/push/key`, `POST /api/push/subscribe`.
- `GET /api/tools`, `POST /api/tools/:tool`, `POST /api/assess`.

## Security and operational requirements before public launch

- Use HTTPS only; configure a strong secret and restrict CORS if serving a separate frontend.
- Configure managed PostgreSQL backups/PITR, restore drills, monitoring and alerting.
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

The domain tests validate the deterministic assessment rules. End-to-end tests against a live PostgreSQL/Render environment should be run before production release.
