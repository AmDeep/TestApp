# Changelog

## 4.2.0 — Finance desk and experience upgrade

- Fixed the Finance & Procurement blank page by removing invalid copied cloud/authentication effects from `FinanceDesk`.
- Rebuilt Finance & Procurement as five focused workspaces: overview, transactions, vendors, purchase orders and invoices.
- Added spend-category bars, budget variance and invoice exposure summaries, overdue invoice cues, missing-receipt checks and draft purchase-order reminders.
- Added transaction search/status filters, CSV export, vendor duplicate protection, invoice duplicate protection and receipt downloads.
- Added a purchase-order lifecycle with a deliberate review step before a received order becomes a planned ledger entry.
- Extracted finance calculations into a pure module and added unit tests for paid/planned/committed separation, invoice aging, legacy data normalization and assistant alerts.
- Added animated assessment/tool loading feedback, reduced-motion support, accessible live status announcements and a top-level React error boundary.
- Kept the existing illustrated home hero and measured SVG floor-plan visualizations; added finance dashboard visualizations and illustrated empty states.
- Removed the published demo password from the sample environment and Render Blueprint. Demo seeding is now opt-in through a private `DEMO_PASSWORD`.
- Preserved the embedded PGlite/Render persistent-disk architecture and its single-instance limitation.

## Verification

- `npm test`: 14 tests pass.
- `node --check` passes for server and domain modules.
- TypeScript JSX transpilation syntax checks pass for the React entry points.
- Full Vite production build was not run in the packaging environment because dependency installation timed out; Render's configured `npm install && npm run build` remains the deployment build step.

## 4.3.0 — Route-aware workspace, audio and visual guidance
- Added stable browser routes under `/app/*` for every primary module, deep-link refresh support, browser back/forward handling and active navigation semantics.
- Added independent finance subsection routes: `/app/finance/overview`, `/app/finance/transactions`, `/app/finance/vendors`, `/app/finance/orders`, and `/app/finance/invoices`.
- Added `/api` and `/api/v1` endpoint discovery documents and route metadata. The catalogue explicitly distinguishes current workspace-payload finance persistence from dedicated finance CRUD APIs, which are not implemented.
- Added opt-in browser speech narration, opt-in interface sound cues, a contextual home guide, and custom SVG illustration artwork.
- Added PWA manifest metadata and reduced-motion-aware presentation.


## 4.3.1 — Maintenance and floor-plan blank-page fix

- Removed accidentally duplicated account/cloud-sync hooks from `FloorPlanStudio`; those hooks referenced variables that exist only in `CloudConsole` and caused a render-time `ReferenceError`.
- Normalized legacy and partial workspace data so missing `maintenance`, `projects`, and `rooms` collections do not crash module rendering.
- Hardened floor-plan loading against malformed or incomplete saved room plans.
- Normalized workspace payloads restored from backups and loaded from cloud storage.
- Added regression tests for the maintenance and floor-plan render failure modes.
