# VULCAIN Render.com Deployment Preparation

## Pending Tasks
- [x] Refactor prisma.provider.ts to use dynamic DATABASE_URL from env, defaulting to file:./dev.db for dev
- [x] Update package.json scripts: Change "start" to "node dist/index.js", add "postinstall": "prisma generate"
- [x] Handle path aliases: Install module-alias, add require('module-alias/register') to index.ts, update _moduleAliases in package.json
- [x] Modify VForgeEngine.ts: Add DATABASE_URL check, log startup message, prevent scraping if not set
- [x] Ensure index.ts listens on correct port: Already does process.env.PORT || 3001
- [x] Create render.yaml: Web service with persistent disk at /data, env vars DATABASE_URL=file:/data/vulcain.db, PORT=3001
- [x] Verify health check: /api/trends already returns 200 with empty data array if no trends
- [x] Separate devDependencies: Already separated (tsx, ts-node in devDeps)
- [x] Ensure /data permissions: Dockerfile already creates /data and sets permissions

## Followup Steps
- [x] Install module-alias dependency
- [x] Test build and start scripts
- [x] Verify Prisma migrations run in production (handled by postinstall: prisma generate)
- [x] Confirm health check endpoint works (GET /api/trends returns 200 with empty data if no trends)
