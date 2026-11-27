# Harmonious Home — reference library

This catalogue is the source registry used by `src/knowledge.js`. It is intentionally weighted toward Canadian federal guidance for household decisions, with US federal technical material and selected public educational resources where useful.

| Topic | Reference | Publisher | Source |
|---|---|---|---|
| Energy / building envelope | Keeping the Heat In: Home Insulation and Air Sealing | Natural Resources Canada | https://natural-resources.canada.ca/energy-efficiency/home-energy-efficiency/keeping-heat-section-7-insulating-walls-insulating-renovating-building-additions |
| Energy | Energy efficiency for homes | Natural Resources Canada | https://natural-resources.canada.ca/energy-efficiency/home-energy-efficiency/energy-efficiency-homes |
| Radon | Testing your home for radon | Health Canada | https://www.canada.ca/en/health-canada/services/health-risks-safety/radiation/radon/testing-your-home.html |
| Indoor air | Improve indoor air quality in your home | Health Canada | https://www.canada.ca/en/health-canada/services/air-quality/improve-indoor-air-quality-in-your-home.html |
| Moisture / mould | Mould in the home | Canada Mortgage and Housing Corporation | https://www.cmhc-schl.gc.ca/consumers/home-buying/home-maintenance/mould |
| Moisture / mould | A Brief Guide to Mold, Moisture and Your Home | US Environmental Protection Agency | https://www.epa.gov/mold/brief-guide-mold-moisture-and-your-home |
| Indoor air | Care for Your Air: A Guide to Indoor Air Quality | US Environmental Protection Agency | https://www.epa.gov/indoor-air-quality-iaq/care-your-air-guide-indoor-air-quality |
| HVAC maintenance | Maintaining Your HVAC System | ENERGY STAR | https://www.energystar.gov/saveathome/heating-cooling/maintenance |
| Energy / air sealing | Air Sealing Your Home | US Department of Energy | https://www.energy.gov/energysaver/air-sealing-your-home |
| Energy / insulation | Insulation | US Department of Energy | https://www.energy.gov/energysaver/insulation |
| Fire safety | Smoke Alarms | US Consumer Product Safety Commission | https://www.cpsc.gov/Safety-Education/Safety-Guides/Home/Smoke-Alarms |
| Fire safety | Fire safety in the home | Government of Canada | https://www.canada.ca/en/public-health/services/emergency-preparedness/making-emergency-kit/fire-safety.html |
| Kitchen | Food safety at home | USDA Food Safety and Inspection Service | https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics |
| Gardening | Outdoor and Indoor Growing Guides | Ecosource and City of Mississauga | https://ecosource.ca/publications/ |
| Accessibility / ergonomics | Office Ergonomics — Space Requirements for Office Work | Canadian Centre for Occupational Health and Safety | https://www.ccohs.ca/oshanswers/ergonomics/office/working_space.html |
| Healthy housing | WHO Housing and Health Guidelines | World Health Organization | https://www.who.int/publications/i/item/9789241550376 |

## Additional sources added in v4.8

The expanded registry adds official Canadian building-code access pages, Ontario homeowner guidance for building permits, private wells and septic systems, Health Canada guidance on carbon monoxide, asbestos, lead and pests, and US federal technical guidance for heat pumps, windows, weatherization, water heating, radon mitigation, safer cleaning, pesticides, water efficiency, rain gardens, furniture tip-over prevention, appliances and flood resilience. See `src/knowledge.js` for the exact source IDs, URLs, categories and reuse notes. The expanded catalogue contains 41 curated entries; ingestion status is tracked separately because some publishers may block automated fetches or move pages.

## Reuse and licensing

“Free to read” is not synonymous with “open source” or public domain. The registry records a reuse note for each publisher. US federal government works are generally public domain unless a third-party item is identified. Government of Canada material may be subject to the Open Government Licence, but users must check the particular page and any third-party notices. CMHC, CCOHS, ENERGY STAR, Ecosource and WHO materials retain their own copyright/trademark or licence terms. The application links to source pages and retains attribution; do not bulk redistribute extracted source text unless the publisher's terms permit it. National model code landing pages provide free electronic access, but code text remains subject to NRC licensing and provincial adoption; never present a model code as automatically enforceable local law.

## Ingestion

- Registry: `src/knowledge.js` → `KNOWLEDGE_SOURCES`.
- Fetch: server-side HTTPS fetch with a user agent, 18-second timeout, 2 MB response cap, HTML extraction and per-source failure status.
- Chunk: heading/paragraph-aware blocks, up to 180 whitespace words, 35-word overlap; tiny fragments are discarded.
- Dense vectors: Apache-2.0 `@huggingface/transformers` running `onnx-community/all-MiniLM-L6-v2-ONNX` locally, mean pooling, L2 normalization, 384 dimensions. Batches of 12 limit peak memory. The model cache is placed under `HF_HOME` on the Render persistent disk.
- Fallback: if model download/runtime is unavailable during ingestion, normalized sparse TF-IDF term vectors with adjacent bigrams are written instead. Retrieval continues with lexical scoring.
- Retrieval: query embedding + cosine similarity, fused with BM25-style lexical ranking (72/28 weighting), top six passages, small exact phrase bonus. Results are sorted and passed to Groq as untrusted evidence.
- Generation: `/api/assist/chat` requires an authenticated household session, is rate-limited, instructs the model to cite `[n]` inline and returns the matching title, publisher, URL, licence note and excerpt separately. Low-evidence answers are instructed to abstain.
- Persistence: document registry, chunk text, terms, vectors and vectorizer metadata are stored in the existing PGlite database. No existing household rows or Render disk paths are removed.

Run `npm run rag:ingest` to ingest new sources and retry failed sources. Run `npm run rag:ingest -- --force` to refresh all sources and rebuild vectors. The server starts background ingestion when the corpus is empty or when newly added/failed catalogue entries are not indexed. Existing ready documents are skipped; newly added sources are fetched and the corpus vectors are rebuilt. Manual re-indexing remains available. `GET /api/health` reports whether chunks are available, and authenticated `GET /api/knowledge/documents` exposes document and vectorizer status.
