#!/bin/bash
set -e

pnpm install --frozen-lockfile

if [ -n "${DATABASE_URL:-}" ]; then
  pnpm --filter @workspace/db push
else
  echo "Skipping database schema push because DATABASE_URL is not set."
  echo "Provision Replit Postgres or set DATABASE_URL before using authenticated app flows."
fi
