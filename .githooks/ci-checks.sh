#!/usr/bin/env bash
# Run the same checks as the CI workflow.
# Skip once: SKIP_QUALITY_HOOKS=1 git commit|push

set -euo pipefail

if [ "${SKIP_QUALITY_HOOKS:-}" = "1" ]; then
  echo "ci-checks: SKIP_QUALITY_HOOKS=1, skipping quality checks."
  exit 0
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "ci-checks: running CI checks..."
npm run typecheck
npm run lint
npm run format:check
npm run build
npm run test
