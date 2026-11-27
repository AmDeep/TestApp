# Open-source UI, interaction, visualisation and AI stack review — v5.3.0

Reviewed for the existing React 19 + Vite + Express + Groq + Render Free architecture. The goal is to add capability without duplicating working libraries, pulling in a second UI design system, or requiring a paid hosted service.

## Adopted in v5.3.0

| Package | License | Use | Decision |
|---|---|---|---|
| `konva` | MIT | 2D scene graph, canvas rendering, drag/transform primitives | Added for the room-plan editor |
| `react-markdown` + `remark-gfm` | MIT | Safe Markdown rendering and GitHub-Flavoured Markdown tables/lists in Groq answers | Added to the knowledge assistant for readable structured AI output; raw HTML is not enabled |
| `react-konva` | MIT | Declarative React bindings for Konva | Added; powers draggable room shapes and high-resolution PNG export |

The floor-plan editor keeps the existing numeric dimension fields and workspace persistence. Canvas dragging updates the same room coordinates; it does not create surveyed geometry or a permit-ready drawing.

## Existing packages retained and used

| Package | License | Existing role |
|---|---|---|
| `motion` | MIT | Enter/exit, layout, gesture and transition animation |
| `@xyflow/react` | MIT | Node-based diagrams and agent/workflow visualisations |
| `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` | MIT | Accessible drag-and-drop and sortable interactions |
| `recharts` | MIT | Responsive charts and data visualisation |
| `@tiptap/*` | MIT | Rich-text editing and structured journal content |
| `lucide-react` | ISC | Consistent icon system |
| `zustand` | MIT | Lightweight shared UI state |
| `@tanstack/react-query` | MIT | Server-state fetching, caching and refetching |
| `zod` | MIT | Input and output validation |
| `@floating-ui/dom` | MIT | Positioning for floating UI elements |
| `groq-sdk` | MIT | Server-side Groq inference; API key remains server-only |

## Evaluated but deliberately not installed

| Project | License / model | Potential use | Why not added now |
|---|---|---|---|
| `assistant-ui` | MIT core; optional hosted services | Streaming assistant threads, attachments, tool UI, approvals | Existing assistant is already integrated with the Groq SDK, retrieval citations and custom UI. Replacing it would add adapter work and risk regressions; revisit if a full chat-runtime rewrite is justified. |
| Vercel AI SDK + `@ai-sdk/groq` | Open-source SDK packages | Provider abstraction, streaming and tool calling | Direct Groq SDK already works. Avoid maintaining two inference abstractions until streaming or provider portability is a concrete requirement. |
| `shadcn/ui` | MIT, copy-in components | Customisable component primitives | Existing visual language is custom CSS; adopting a second design system would create duplicate styles and migration cost. |
| Radix UI / Base UI | MIT primitives | Accessible menus, dialogs, popovers and controls | Evaluate component-by-component where an accessibility gap exists; do not bulk-install an unused primitive layer. |
| Mantine / MUI / Chakra / Ant Design / HeroUI | Open-source core; check add-on tiers | Full component systems and admin screens | Too broad and visually opinionated for this app's existing custom design system. Some advanced data-grid capabilities are separately licensed. |
| Three.js + React Three Fiber + Drei | MIT | 3D room previews, lighting and object scenes | Heavy for Render Free and low-end devices; 2D measured planning is the safer current baseline. Add only as a lazy-loaded opt-in module after performance testing. |
| Fabric.js / Paper.js / PixiJS / p5.js | Open-source; verify exact package licence | Image editing, vector paths, GPU 2D and creative coding | Overlap with Konva for current 2D floor-plan requirements. Keep as alternatives for distinct future use cases, not parallel dependencies. |
| `@tanstack/react-table` / `@tanstack/react-virtual` | MIT | Dense tables and virtualised long lists | Useful when real record volumes justify it; current lists are small enough without added complexity. |
| Yjs | MIT | Collaborative CRDT editing and offline multi-user state | Current workspace sync is versioned whole-payload persistence; CRDT migration requires conflict and storage design beyond a package install. |
| Apache Tika | Apache-2.0 | Broad document parsing across PDF, Office and other formats | JVM service/runtime overhead is not justified on Render Free. Use local Markdown packs and consider an isolated parser job later. |
| PyMuPDF | AGPL-3.0 or commercial licensing depending on distribution/use | PDF to text/Markdown extraction for offline ingestion | Excellent parser but Python and licensing review are required; not silently bundled into the Node web service. |
| Unstructured | Apache-2.0 core with additional integrations/licence considerations | Complex document partitioning | Larger dependency and processing footprint. Revisit for user-uploaded complex PDFs rather than public URL ingestion. |

## AI architecture choices

- Keep Groq calls on the Express server. Never expose `GROQ_API_KEY` in Vite client variables.
- Keep retrieval deterministic and inspectable: bundled knowledge packs → chunking → sparse TF-IDF/BM25 hybrid ranking → cited excerpts → Groq answer synthesis.
- Keep `RAG_DISABLE_EMBEDDINGS=true` for the Free deployment baseline. Dense embeddings can be tested separately with memory and startup-time measurements.
- Use Zod/runtime validation around tool inputs and model-generated plans. Groq strict Structured Outputs are model-specific and have constraints; do not enable strict JSON schema on an arbitrary configured model without checking support.
- Do not let the model silently edit household records, send invitations, purchase products, change safety systems or delete data. Use explicit user review and confirmation for any future write-capable tools.
- Source passages are untrusted data. They are evidence to summarise, never instructions to follow.

## Official project references

- Motion: https://motion.dev/docs
- React Flow: https://reactflow.dev/
- React Konva: https://konvajs.org/docs/react/index.html
- Konva React repository: https://github.com/konvajs/react-konva
- Recharts animation guide: https://recharts.github.io/en-US/guide/animations/
- assistant-ui: https://github.com/assistant-ui/assistant-ui
- Groq API quickstart: https://console.groq.com/docs/quickstart
- Groq structured outputs: https://console.groq.com/docs/structured-outputs
- Apache Tika: https://tika.apache.org/docs/
- PyMuPDF RAG guide: https://pymupdf.readthedocs.io/en/latest/rag.html

## Licensing and maintenance notes

Open source does not mean every add-on, hosted feature, asset, font or template is free for every use. Confirm the exact package version's licence and any commercial/hosted tier before adoption. The app's package manifest lists runtime dependencies; this review records evaluated alternatives, not installed packages.
