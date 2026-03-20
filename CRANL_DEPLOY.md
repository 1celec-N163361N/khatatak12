# CranL deployment

## Repository settings
- Branch: `main`
- Port: `3000`
- Build Type: `Railpack`
- Region: `SASaudi Arabia 1`

## Required environment variables
- `DATABASE_URL`
- `FRONTEND_URL`
- `PORT=3000`
- `NODE_ENV=production`
- `BASE_PATH=/`

## What was changed
- Pinned package manager to `pnpm@9.15.9`
- Removed dependency on `pnpm-lock.yaml` during CranL install
- Added explicit install/build/start flow in `railpack.toml`
- Switched production start command to compiled server output: `node ./dist/index.cjs`
- Added `.env.example`

## Notes
- Do **not** commit production secrets into the repo.
- Put `DATABASE_URL` and `FRONTEND_URL` in CranL environment variables.
- Health endpoint: `/api/healthz`
