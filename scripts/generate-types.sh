#!/usr/bin/env bash
# Regenerate Supabase TypeScript types from the linked project.
# Requires the Supabase CLI and SUPABASE_PROJECT_ID to be set.
set -euo pipefail

if [ -z "${SUPABASE_PROJECT_ID:-}" ]; then
  echo "SUPABASE_PROJECT_ID is not set" >&2
  exit 1
fi

supabase gen types typescript --project-id "$SUPABASE_PROJECT_ID" \
  > src/types/database.types.ts

echo "Wrote src/types/database.types.ts"
