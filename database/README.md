# Local embedded database and demo seed

The application uses an embedded PGlite (PostgreSQL-compatible WASM database), not a separately hosted PostgreSQL service. On first start, `server.js` creates the schema and seeds the demo account plus sample household records. The live database is written to `DATABASE_DIR`.

- Local development: `./data/db`
- Render: `/var/data/db` on the configured persistent disk
- Demo login: `demo@harmonioushome.app`
- Demo password: `HomeDemo2026!` (override with `DEMO_PASSWORD` before first boot)

The generated database directory is deliberately git-ignored. Commit the schema/seed logic, not live database files, user passwords, or personal household data. The persistent disk retains changes between deploys. This deployment is intended for a single Render web instance; PGlite is embedded and is not a horizontally-scaled multi-instance database service.
