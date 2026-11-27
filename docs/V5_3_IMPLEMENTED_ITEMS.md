# v5.3.0 — What was actually added

## Implemented in code

1. Bundled 57 original local-first RAG knowledge packs.
2. Made those local packs the required corpus so public URL failures do not block RAG readiness.
3. Separated optional external references from required local documents and added a seven-day retry cooldown for failed optional sources.
4. Added corpus health fields for required, optional, indexed and missing source counts.
5. Added provenance labelling for original local educational synthesis in Groq evidence and citations.
6. Added React Konva/Konva interactive draggable room-plan shapes, with numeric coordinate synchronization and high-resolution PNG export.
7. Added React Markdown and GFM rendering for structured Groq responses; raw HTML rendering is not enabled.
8. Added a Groq-powered measured-room layout ideation endpoint and UI; suggestions are validated and never auto-applied.
9. Added the 1,000-item status-labelled register and open-source stack review.

## Exact 57 local RAG documents

01. **Home fundamentals** — `home-basics` — home-management — bundled/indexed from local source
02. **Indoor air quality** — `indoor-air` — indoor-air — bundled/indexed from local source
03. **Moisture, dampness and mould** — `moisture-mould` — maintenance — bundled/indexed from local source
04. **Radon awareness and testing** — `radon` — health-safety — bundled/indexed from local source
05. **Fire prevention and escape planning** — `fire-safety` — health-safety — bundled/indexed from local source
06. **Carbon monoxide awareness** — `carbon-monoxide` — health-safety — bundled/indexed from local source
07. **Electrical safety and home systems** — `electrical-safety` — health-safety — bundled/indexed from local source
08. **Gas appliances and combustion safety** — `gas-heating` — health-safety — bundled/indexed from local source
09. **Plumbing, leaks and water shut-offs** — `plumbing` — maintenance — bundled/indexed from local source
10. **Drinking water and water quality** — `water-quality` — water-quality — bundled/indexed from local source
11. **Home energy assessment** — `energy-audit` — energy — bundled/indexed from local source
12. **Insulation and building envelope** — `insulation` — energy — bundled/indexed from local source
13. **Heating, cooling and ventilation equipment** — `hvac` — hvac — bundled/indexed from local source
14. **Windows, daylight and shading** — `windows-daylight` — building-performance — bundled/indexed from local source
15. **Accessibility and inclusive home design** — `accessibility` — accessibility — bundled/indexed from local source
16. **Home office and ergonomic setup** — `ergonomics` — accessibility — bundled/indexed from local source
17. **Kitchen workflow and storage** — `kitchen-planning` — kitchen — bundled/indexed from local source
18. **Food storage and kitchen hygiene** — `food-safety` — kitchen — bundled/indexed from local source
19. **Bathroom safety and moisture** — `bathroom-safety` — health-safety — bundled/indexed from local source
20. **Bedroom comfort and sleep environment** — `bedroom-rest` — wellbeing — bundled/indexed from local source
21. **Living spaces and circulation** — `living-room` — interior-design — bundled/indexed from local source
22. **Residential lighting design** — `lighting` — interior-design — bundled/indexed from local source
23. **Colour, finishes and material selection** — `colour-materials` — interior-design — bundled/indexed from local source
24. **Furniture, storage and anchoring** — `furniture-storage` — interior-design — bundled/indexed from local source
25. **Cleaning systems and product safety** — `cleaning` — housekeeping — bundled/indexed from local source
26. **Laundry, drying and appliance care** — `laundry` — housekeeping — bundled/indexed from local source
27. **Integrated pest management** — `pest-management` — pest-management — bundled/indexed from local source
28. **Indoor and outdoor gardening** — `gardening` — gardening — bundled/indexed from local source
29. **Yards, grading and drainage** — `outdoor-drainage` — resilience — bundled/indexed from local source
30. **Winter readiness and cold-weather operations** — `winter-readiness` — seasonal-care — bundled/indexed from local source
31. **Summer heat and cooling readiness** — `summer-readiness` — seasonal-care — bundled/indexed from local source
32. **Renovation planning and scope control** — `renovation-planning` — renovation — bundled/indexed from local source
33. **Contractor selection and procurement** — `contractor-selection` — procurement — bundled/indexed from local source
34. **Home project planning and delivery** — `project-management` — project-management — bundled/indexed from local source
35. **Household and renovation budgeting** — `budgeting` — finance — bundled/indexed from local source
36. **Home insurance and claims preparation** — `insurance` — risk-management — bundled/indexed from local source
37. **Emergency preparedness and household continuity** — `emergency-planning` — resilience — bundled/indexed from local source
38. **Waste, recycling and circular household practices** — `waste-recycling` — sustainability — bundled/indexed from local source
39. **Smart home devices and automation** — `smart-home` — technology — bundled/indexed from local source
40. **Household digital privacy and security** — `privacy-security` — privacy-security — bundled/indexed from local source
41. **Assistive technology and home controls** — `accessibility-technology` — accessibility — bundled/indexed from local source
42. **Feng Shui as a cultural design framework** — `feng-shui` — tradition-feng-shui — bundled/indexed from local source
43. **Vastu as a cultural design framework** — `vastu` — tradition-vastu — bundled/indexed from local source
44. **Floor plans, measurements and spatial planning** — `floorplanning` — spatial-design — bundled/indexed from local source
45. **Moving, settling in and handover** — `moving-home` — life-events — bundled/indexed from local source
46. **Rental, condo and shared-building constraints** — `rental-home` — housing-context — bundled/indexed from local source
47. **Child-safe home environments** — `children-safety` — health-safety — bundled/indexed from local source
48. **Pet-aware home planning** — `pet-safety` — household-care — bundled/indexed from local source
49. **Noise, privacy and acoustic comfort** — `noise-acoustics` — building-performance — bundled/indexed from local source
50. **Water efficiency and leak monitoring** — `water-efficiency` — sustainability — bundled/indexed from local source
51. **Asbestos, lead and hazardous materials awareness** — `materials-hazard` — health-safety — bundled/indexed from local source
52. **Building codes, permits and inspections** — `building-permits` — building-code — bundled/indexed from local source
53. **Preventive maintenance systems** — `home-maintenance` — maintenance — bundled/indexed from local source
54. **AI-assisted household planning and data quality** — `home-data-ai` — ai-workflows — bundled/indexed from local source
55. **Home accessibility retrofit planning** — `home-access` — accessibility — bundled/indexed from local source
56. **Household coordination and shared responsibilities** — `home-relationships` — household-care — bundled/indexed from local source
57. **Climate resilience and extreme weather** — `home-resilience` — resilience — bundled/indexed from local source

## New runtime packages

- `konva` — MIT — canvas scene graph.
- `react-konva` — MIT — React bindings for Konva.
- `react-markdown` — MIT — safe Markdown rendering (raw HTML disabled).
- `remark-gfm` — MIT — tables, task lists, autolinks and other GFM syntax.

## Existing foundations reused (not new packages)

Motion, React Flow (`@xyflow/react`), dnd-kit, Recharts, Tiptap, Zustand, TanStack Query, Zod, Lucide React, Groq SDK, Kokoro JS and PGlite remain in place. See `docs/architecture/OPEN_SOURCE_STACK_REVIEW.md` for alternatives evaluated and reasons for not adding overlapping frameworks.

## Not claimed as implemented

The 1,000-item register explicitly separates 12 items newly implemented in v5.3.0, 140 items with an existing foundation, and 848 roadmap items. The 57 knowledge documents are a separately enumerated corpus deliverable and are not misrepresented as 57 new UI modules. Groq remains the AI provider for existing assistant and agent workflows; this release expands the context available to it and improves response rendering, rather than claiming 1,000 new AI agents.
