# Local embedded database and optional demo seed

The application uses an embedded PGlite (PostgreSQL-compatible WASM database), not a separately hosted PostgreSQL service. On first start, `server.js` creates the schema. A demo household is seeded only when a private `DEMO_PASSWORD` environment variable is explicitly configured; otherwise users can register their own accounts.

- Local development: `./data/db`
- Render: `/var/data/db` on the configured persistent disk
- Optional demo email: `demo@harmonioushome.app`
- Optional demo password: the value you privately set in `DEMO_PASSWORD` before the first database boot

The generated database directory is deliberately git-ignored. Commit the schema/seed logic, not live database files, user passwords, or personal household data. The persistent disk retains changes between deploys. This deployment is intended for a single Render web instance; PGlite is embedded and is not a horizontally-scaled multi-instance database service.
