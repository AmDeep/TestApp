# Free hosting storage model

- Household profile, assessment history and workspace state are stored in browser localStorage.
- Full JSON export/import is available under Data & Settings; users should back up regularly.
- Browser-local data is device/browser-specific and is not shared or synchronized.
- PGlite on the server is in-memory only and must be treated as temporary operational state.
- RAG source catalogue is version-controlled in `src/knowledge.js`; its runtime index is ephemeral and rebuilt after cold starts.
- Dense embeddings can be disabled with `RAG_DISABLE_EMBEDDINGS=true`; lexical retrieval is used as fallback.
- No Render disk, `/var/data`, `DATABASE_DIR`, or `HF_HOME` is required.
