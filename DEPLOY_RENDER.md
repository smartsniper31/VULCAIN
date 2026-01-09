Deploy to Render
=================

This document explains how to deploy the VULCAIN services to Render using the repository `render.yaml` and which environment values are required.

Services in `render.yaml`

- `vulcain-backend` (Node service)
  - Runtime: `node`
  - Build command: `npm install && npx prisma generate && npm run build`
  - Start command: `npm run start` (the backend should read `process.env.PORT` at runtime)
  - Health check: `/health`
  - Disk mount: `/data` (SQLite file location)
  - Important: Do NOT hardcode `PORT` in env vars; Render provides `$PORT` at runtime.

- `vulcain-frontend` (Docker service)
  - Runtime: `docker`
  - Dockerfile: `frontend/Dockerfile.frontend`
  - The frontend Dockerfile should build Next.js and output a runnable image. If you prefer Node runtime, change to `env: node`, `root: frontend`, and set build/start commands.

Required secrets / env vars (set in Render Environment):

- `DATABASE_URL` (backend) — production DB connection string or `file:/data/vulcain_core.db` for local SQLite on Render disk.
- `JWT_SECRET` — secret for JWT signing (backend).
- `NEXT_PUBLIC_API_URL` — public URL where frontend reaches the backend (ex: https://vulcain-backend.onrender.com).
- `FRONTEND_URL` / `HOSTNAME` — optional, useful for CORS and generated links.
- `NEXT_TELEMETRY_DISABLED=1` — optional to disable Next telemetry.

Best practices

- Store sensitive values as environment variables or Secret Files (Render dashboard) — do not commit them.
- Use `NEXT_PUBLIC_` prefix for client-exposed variables.
- Ensure the backend binds to `process.env.PORT` (not a fixed port).
- If builds fetch external resources (fonts, APIs), prefer bundling/self-hosting assets to avoid build-time network failures.

Quick verification

1. Push `render.yaml` to the repo root (already present).
2. In Render dashboard, create two services or let Render detect `render.yaml`.
3. In the frontend service settings, set `Root Directory` to `frontend` if you opt for Node runtime, or point Dockerfile correctly.
4. Add the secrets listed above in the Render Environment panel.
5. Trigger a manual deploy and check logs (Build -> Start -> Health checks).

If you want, I can also:
- Convert the frontend to a Node web service instead of Docker and add a `startCommand: PORT=$PORT node ./.next/standalone/server.js` entry.
- Add deployment badges or a small CI step that validates the build before pushing to Render.
