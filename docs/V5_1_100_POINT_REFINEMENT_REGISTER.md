# Harmonious Home 5.1 — 100-point refinement register

This register distinguishes newly strengthened behavior from capabilities already present in the project. It is not a claim that 100 new third-party packages were installed. Dependencies are selected for product value, maintenance quality and Render Free compatibility; unused packages are deliberately avoided.

## A. Product experience and navigation
1. [x] Keep the command palette searchable across all primary destinations.
2. [x] Support Ctrl+K and Command+K quick navigation.
3. [x] Keep direct routes and browser back/forward navigation.
4. [x] Add a visible route announcement for assistive technology.
5. [x] Keep a skip-to-main-content link.
6. [x] Use a mobile bottom navigation dock with safe-area spacing.
7. [x] Keep desktop sidebar collapse/expand preference.
8. [x] Retain contextual home-guide tips and module shortcuts.
9. [x] Keep page transitions respectful of reduced-motion settings.
10. [x] Keep empty states oriented around a clear next action.

## B. Visual design and interaction
11. [x] Retain the botanical, calm visual language and consistent spacing system.
12. [x] Keep responsive breakpoints for compact phones, tablets and desktop.
13. [x] Add clear visual treatment for a pending application update.
14. [x] Add a dedicated storage warning state rather than silently failing.
15. [x] Keep keyboard focus visible on interactive command-palette elements.
16. [x] Use semantic pressed/current/expanded state on navigation and controls.
17. [x] Keep toast feedback for successful and failed user actions.
18. [x] Preserve motion reduction support for animated routes and controls.
19. [x] Retain loading overlays for longer assessment and tool operations.
20. [x] Keep typography and contrast aligned with the existing design system.

## C. Accessibility and usability
21. [x] Preserve landmark structure for sidebar, main content and header.
22. [x] Announce route changes through an aria-live region.
23. [x] Give icon-only controls accessible names or descriptive titles.
24. [x] Keep the command palette exposed as a labelled modal dialog.
25. [x] Retain keyboard-operable native buttons and form controls.
26. [x] Respect the operating system reduced-motion preference.
27. [x] Provide visible offline status without blocking local work.
28. [x] Keep form labels and helper text connected to controls.
29. [x] Preserve readable mobile targets and horizontal navigation scrolling.
30. [x] Keep errors actionable and avoid exposing internal secrets in UI messages.

## D. Local-first data and backups
31. [x] Centralize defensive JSON reads and writes in `src/storage.js`.
32. [x] Distinguish empty, malformed, quota-exceeded and unavailable storage.
33. [x] Avoid throwing when localStorage reads or writes fail.
34. [x] Show an estimated local-storage footprint and key count.
35. [x] Validate backup top-level shape before applying it.
36. [x] Validate profile, history and workspace section types.
37. [x] Require confirmation before replacing current workspace data.
38. [x] Reject backup files larger than the existing 5 MB import limit.
39. [x] Handle file-reader failures and reset the file input after import.
40. [x] Export versioned JSON backups with an ISO timestamp.

## E. Workspace and household workflows
41. [x] Retain household profile editing and assessment history.
42. [x] Retain room journals with ratings and update timestamps.
43. [x] Retain project planning with priority and estimate validation.
44. [x] Retain maintenance tasks with recurring schedule generation.
45. [x] Retain overdue, upcoming, completed and open maintenance filters.
46. [x] Retain budget tracking and project estimate comparison.
47. [x] Retain floor-plan studio and room geometry validation.
48. [x] Retain report comparison and history navigation.
49. [x] Retain import/export portability across browsers.
50. [x] Clearly disclose that this Free Mode does not provide durable cloud sync.

## F. AI, knowledge and trust
51. [x] Retain Groq-backed synthesis behind the server API.
52. [x] Retain local deterministic assessment fallback when the API is unavailable.
53. [x] Retain the knowledge assistant and curated source catalogue.
54. [x] Keep lexical retrieval available when embeddings are disabled.
55. [x] Keep RAG configuration explicit through environment variables.
56. [x] Preserve source/basis context in the assessment and knowledge experience.
57. [x] Preserve explicit caveats that the app is not a certified Feng Shui/Vastu assessment.
58. [x] Keep safety, accessibility and building performance ahead of symbolic preferences.
59. [x] Keep model keys on the server rather than in browser bundles.
60. [x] Keep AI failure states separate from deterministic local findings.

## G. Voice, editor and rich interaction
61. [x] Retain browser-side Kokoro narration rather than a paid speech API.
62. [x] Attempt WebGPU when supported and fall back to quantized WASM.
63. [x] Retain speech voice and rate preferences in the UI store.
64. [x] Retain rich journal editing with Tiptap.
65. [x] Retain project drag-and-drop primitives through dnd-kit.
66. [x] Retain workflow/agent visualization through XYFlow.
67. [x] Retain charting through Recharts where data visualization is useful.
68. [x] Retain toast notifications through Sonner.
69. [x] Retain reduced-motion-aware Motion transitions.
70. [x] Avoid loading a second speech service or duplicate voice runtime.

## H. Performance and runtime
71. [x] Keep Vite production build with React plugin.
72. [x] Keep explicit vendor chunk grouping for large optional modules.
73. [x] Keep React dependency deduplication in Vite.
74. [x] Keep query caching and bounded retry behavior through TanStack Query.
75. [x] Keep server health polling at a restrained interval.
76. [x] Keep the production bundle target at modern ES2022 browsers.
77. [x] Keep source maps disabled in production output by default.
78. [x] Keep heavy speech/model dependencies isolated into their own vendor chunk.
79. [x] Avoid introducing heavyweight UI frameworks that duplicate existing libraries.
80. [x] Keep the app build independent of persistent disk mounts.

## I. Offline, installability and resilience
81. [x] Register the service worker in production only.
82. [x] Pre-cache the application shell, manifest and favicon.
83. [x] Cache same-origin static assets on successful requests.
84. [x] Use network-first navigation with an offline app-shell fallback.
85. [x] Explicitly exclude API requests from service-worker caching.
86. [x] Version the service-worker cache and remove older shell caches.
87. [x] Notify the user when a new service-worker version is installed.
88. [x] Keep push-notification click handling focused on the app window.
89. [x] Keep local workspace access available when the network is offline.
90. [x] Avoid claiming offline AI/API capabilities when the server is unreachable.

## J. Deployment, security and maintainability
91. [x] Keep Render on the Free plan with no persistent disk declaration.
92. [x] Explicitly install dev dependencies so Vite is available during Render builds.
93. [x] Keep the ONNX CUDA download skip workaround for Kokoro's dependency tree.
94. [x] Keep Node 22 as the declared Render runtime.
95. [x] Keep secrets out of committed environment files.
96. [x] Keep `.env`, databases, build output and node_modules excluded from Git.
97. [x] Add focused unit tests for safe storage and backup validation.
98. [x] Add regression tests for offline caching boundaries and Free Mode messaging.
99. [x] Keep the automated test command based on Node's built-in test runner.
100. [x] Document deployment limitations honestly, including ephemeral server-side state on Render Free.

## Dependency strategy
The project already includes React 19, Vite, Motion, Lucide, TanStack Query, Zustand, Zod, Tiptap, dnd-kit, XYFlow, Recharts, Sonner, Transformers.js, Kokoro and PGlite. Version 5.1 strengthens their integration instead of adding overlapping libraries. New dependencies are intentionally not added for functionality that can be delivered with platform APIs, especially on a low-memory free hosting tier.

## Known constraints / next engineering gates
- Render Free has no persistent disk in this deployment; server-side PGlite is in-memory and server-backed records may reset on restart or sleep.
- Browser localStorage is device/browser scoped, has finite quota and is not a substitute for encrypted multi-device backup.
- Service-worker caching preserves the app shell and static assets; API responses are deliberately never cached.
- Dense embeddings remain opt-in. Keep `RAG_DISABLE_EMBEDDINGS=true` until model initialization, memory use and retrieval quality have been measured on the actual Render instance.
- A production build and live Render deployment must be verified in CI/Render; local source tests alone do not prove the remote deployment works.
