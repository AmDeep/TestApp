## 5.2.0 — Experience & Workflow Expansion

- Added Experience Studio with six guided household journeys, step tracking, direct module navigation, 20 experience domains and design principles.
- Added a 1,000-item experience, screen and workflow planning catalogue in `docs/V5_2_1000_EXPERIENCE_IDEAS.md`. The catalogue clearly distinguishes roadmap concepts from implemented functionality.
- Added a dedicated `/app/experience-studio` route and sidebar entry.
- Preserved local-first storage and Render Free deployment constraints; no paid service or new dependency added.

# Changelog

## 4.8.0 — Local open-source neural speech and expanded knowledge corpus
- Replaced Azure Speech integration with browser-local Kokoro TTS (Apache-2.0), multiple US/UK English voices, adjustable speed, WebGPU/WASM selection, local WAV synthesis and no speech secrets or backend endpoint.
- Added 25 official/public technical references across Canadian building codes, Ontario home ownership, radon, indoor air, water, HVAC, weatherization, gardening, resilience, accessibility and household safety.
- Startup ingestion now detects newly added or failed catalogue sources and indexes them without requiring a database reset; existing ready sources are skipped.
- Made the fixed left navigation independently scrollable while preserving its collapse/expand state.

## 4.7.0 — Grounded Home AI, semantic RAG and navigation redesign

- Added 16 curated public-access home/building reference sources and an automated, non-blocking first-run ingestion pipeline.
- Added paragraph/heading-aware chunking (180-word target, 35-word overlap), stable chunk IDs, source provenance, document status, and persistent PGlite knowledge tables.
- Added local 384-dimensional MiniLM ONNX embeddings via Apache-2.0 Transformers.js; batch embedding and persistent model caching; sparse TF-IDF/bigram fallback when model inference cannot initialize.
- Added hybrid cosine + BM25 retrieval, six-passage evidence selection, grounded Groq chat, inline citation instructions, returned source excerpts/URLs and low-evidence abstention behavior.
- Added authenticated, rate-limited `/api/assist/chat` and authenticated `/api/knowledge/documents`; extended health status and API catalogue.
- Added a new Home AI & knowledge page with a chat interface, quick prompts, source cards, searchable/filterable library, and retrieval transparency.
- Added persistent collapsible navigation and scrollable sidebar, responsive layout, richer motion and reduced-motion support.
- Standardized narration on Microsoft's open-source JavaScript Speech SDK in React; removed browser-native speech fallback. Azure Speech resource configuration is still required for cloud synthesis.
- Added `HF_HOME` under the existing Render persistent disk. Existing `/var/data/db`, JWT, demo-password and household workspace data are preserved; no destructive migration.

# Changelog

## 4.5.0 — Workspace windows, Kanban and bounded planning agents

- Rebuilt project management as a three-lane Kanban board (Planned, In progress, Completed) with pointer and keyboard drag-and-drop across lanes and within lanes.
- Added draggable floating workspace windows: open, close, minimize to dock, maximize and restore. Added a global command palette with Ctrl/Cmd+K and Escape handling.
- Added Quick Capture with local text/Markdown/CSV file drop (1.5 MB cap); dropped files are read in-browser and never uploaded. Captured notes are stored in the existing workspace payload.
- Added Workspace Pulse and a transparent Home Copilot that surfaces local, rule-based project, maintenance and budget observations.
- Added a bounded AI planning API with a planner agent and independent safety-review agent. Proposals are returned for explicit user approval; they are not auto-saved. AI planning is rate-limited and requires `GROQ_API_KEY`.
- Added a deterministic unsafe-work keyword rejection pass and explicit limitations for AI-generated planning suggestions.
- Preserved the existing PGlite database, workspace payload, finance APIs, persistent disk and Render service configuration.

## 4.4.0 — Motion, interaction and workspace intelligence

- Upgraded the frontend baseline to React 19.3, Vite 8.3, the current Vite React plugin and Node 22 runtime compatibility.

- Added Motion for React route transitions and animated room-plan interactions, with reduced-motion preference respected.
- Added Lucide controls, Sonner notifications and a persistent opt-in sound preference; audio remains generated locally and speech narration remains browser-native.
- Added TanStack Query for cached, periodically refreshed API health status.
- Added Zustand persistence for UI preferences without moving household or finance records out of their existing storage.
- Added Zod validation for project, maintenance and measured-room inputs, plus safe workspace normalization for legacy and cloud-loaded records.
- Added accessible drag-and-drop project ordering with keyboard support using dnd-kit; order changes are saved with the existing workspace.
- Expanded maintenance into open, overdue, upcoming, completed and all views; completing recurring tasks schedules the next occurrence, while one-time tasks remain completed.
- Replaced the static finance category bars with a responsive Recharts spending chart.
- Upgraded to React 19.3, Vite 8 and the current official React plugin; corrected Vite's asset base to `/` and configured Rolldown code-splitting groups for independently cacheable vendor families.
- Preserved existing route URLs, finance API behavior, PGlite storage and Render persistent-disk configuration.

## 4.3.1 — Maintenance and floor-plan blank-page fix

- Removed accidentally duplicated account/cloud-sync hooks from `FloorPlanStudio`; those hooks referenced variables that exist only in `CloudConsole` and caused a render-time `ReferenceError`.
- Normalized legacy and partial workspace data so missing `maintenance`, `projects`, and `rooms` collections do not crash module rendering.
- Hardened floor-plan loading against malformed or incomplete saved room plans.
- Normalized workspace payloads restored from backups and loaded from cloud storage.
- Added regression tests for the maintenance and floor-plan render failure modes.

## 4.3.0 — Route-aware workspace, audio and visual guidance

- Added stable browser routes under `/app/*` for every primary module, deep-link refresh support, browser back/forward handling and active navigation semantics.
- Added independent finance subsection routes for overview, transactions, vendors, purchase orders and invoices.
- Added `/api` and `/api/v1` endpoint discovery documents and route metadata. The catalogue distinguishes workspace-payload finance persistence from dedicated finance CRUD APIs.
- Added opt-in browser speech narration, opt-in interface sound cues, a contextual home guide, custom SVG illustration artwork and PWA metadata.

## 4.2.0 — Finance desk and experience upgrade

- Rebuilt Finance & Procurement as five focused workspaces: overview, transactions, vendors, purchase orders and invoices.
- Added spend-category summaries, budget variance and invoice exposure, overdue invoice cues, missing-receipt checks and draft purchase-order reminders.
- Added transaction search/status filters, CSV export, vendor and invoice duplicate protection, receipt downloads and a purchase-order lifecycle.
- Extracted finance calculations into a pure module and added tests for paid/planned/committed separation, invoice aging, legacy data normalization and assistant alerts.
- Added animated loading feedback, reduced-motion support, accessible live status announcements and a top-level React error boundary.
- Preserved the embedded PGlite/Render persistent-disk architecture and its single-instance limitation.

## Verification for 4.5.0

- `npm test`: 35 tests pass, including interaction, route-asset and maintenance-workflow regression checks.
- `node --check` passes for server, Vite configuration and JavaScript modules.
- TypeScript JSX transpilation syntax checks pass for all React entry points/components, including the new workspace hub and Kanban board.
- Full Vite production build could not be run because this packaging environment cannot reach the npm registry; Render must install the declared dependencies and run the configured build command.

## 4.6.0 — Microsoft Neural Speech, Specialist Agent Council and Rich Journal

- Added Microsoft Azure AI Speech SDK with short-lived server-issued tokens, authenticated/rate-limited token endpoint, server-only Speech key, neural voice selection, persisted voice preference and browser fallback.
- Added React Flow visual orchestration map for project, maintenance, budget and accessibility specialist agents, independent safety gate and explicit human approval.
- Expanded AI planning to specialist insights for maintenance triage, budget stewardship and accessibility/usability; independent gate screens both ideas and insights.
- Added Tiptap rich-text room journal with formatting, lists, undo and redo.
- Added speech, graph and editor vendor chunks; Azure Speech SDK is dynamically imported only when the user starts narration.
- Added Azure Speech environment configuration and health capability flag.


## 4.9.0 — GitHub + Render Free mode

- Removed persistent disk and `/var/data` startup dependency; PGlite runs in memory only.
- Household app state remains browser-local with existing JSON backup/restore.
- Replaced cloud account console with a clear local-storage explanation.
- Added Render Free blueprint and lexical RAG mode to avoid persistent model cache.


## v5.0.0 — Experience, resilience and deployment refinement

- Fixed the Render Blueprint build command to install development dependencies explicitly, ensuring Vite is available while keeping the CUDA-install workaround.
- Declared Tiptap's required peer packages directly to eliminate avoidable peer-dependency warnings and make editor installs reproducible.
- Added a keyboard-first quick navigation palette (`Ctrl+K` / `⌘K`) with searchable destinations and Escape-to-close behavior.
- Reworked the narrow-screen navigation into a horizontally scrollable bottom dock with safe-area spacing.
- Added a skip-to-content link and clearer storage-quota warnings when browser persistence fails.
- Improved Kokoro initialization: WebGPU is attempted when available, with automatic fallback to quantized WebAssembly when WebGPU setup fails.
- Corrected the account-page copy to accurately describe the Render Free local-first storage model; no cloud sync is implied.
- Preserved the existing local storage keys and backward-compatible JSON import format.
- Added a live offline indicator so users can distinguish local workspace access from unavailable network-backed services.

## 5.1.0 — Local-first resilience and refinement
- Added defensive local-storage helpers with quota/error classification and storage footprint diagnostics.
- Hardened backup restore with schema checks, a replacement confirmation, size limits and reader error handling.
- Added a production service-worker shell cache with network-first navigation fallback; API traffic is excluded from caches.
- Added a user-facing new-version notification and improved offline shell behavior.
- Corrected Free Mode account messaging so it does not promise durable cloud synchronization.
- Added storage and service-worker regression tests; see `docs/V5_1_100_POINT_REFINEMENT_REGISTER.md` for the 100-point product register.
