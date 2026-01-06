# TODO: Fix Full-Stack Communication for VULCAIN

## Backend Fixes
- [x] Add CORS middleware in src/index.ts to accept frontend URL from Render
- [x] Add health route at /health in src/index.ts
- [x] Add User-Agent header in VForgeEngine.ts for Google Trends scraping to avoid 500 error

## Frontend Fixes
- [x] Verify API calls use absolute URLs with NEXT_PUBLIC_API_URL (already done)
- [x] Ensure next.config.ts has no rewrites (already done)
- [x] Handle empty trends array in page.tsx (already done)
- [ ] Set NEXT_PUBLIC_API_URL environment variable on Vercel to point to Render backend URL
- [ ] Set FRONTEND_URL environment variable on Render to Vercel frontend URL for CORS

## Deployment Fixes
- [ ] Ensure Render backend is deployed and accessible
- [ ] Verify Render service is running on the correct port (uses PORT env var)
- [ ] Check if database migrations are run on Render (prisma generate and migrate)

## Validation
- [ ] Test backend health endpoint
- [ ] Test /api/trends endpoint
- [ ] Deploy and verify communication
