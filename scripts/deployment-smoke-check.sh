#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${API_URL:-}" || -z "${WEB_URL:-}" ]]; then
  echo "API_URL and WEB_URL must be set for smoke checks"
  exit 1
fi

echo "Checking API health endpoint"
curl --fail --silent --show-error "${API_URL%/}/healthz" >/dev/null

echo "Checking API readiness endpoint"
curl --fail --silent --show-error "${API_URL%/}/readyz" >/dev/null

echo "Checking web health endpoint"
curl --fail --silent --show-error "${WEB_URL%/}/healthz" >/dev/null

echo "Checking web root endpoint"
curl --fail --silent --show-error "${WEB_URL%/}/" >/dev/null

echo "Smoke checks passed"
