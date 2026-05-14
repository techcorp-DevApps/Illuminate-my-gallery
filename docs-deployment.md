# Deployment and Environment Configuration

## Platforms
- **Primary:** Railway (`railway.json` root + per-service `apps/*/railway.json`)
- **Fallback:** Render (`render.yaml`)

## Required Environment Variables

### API service
| Variable | Required | Railway variable | Render variable | Purpose |
|---|---|---|---|---|
| `NODE_ENV` | yes | `NODE_ENV` | `NODE_ENV` | Production mode |
| `PORT` | yes | `PORT` | `PORT` | Bind port |

### Web service
| Variable | Required | Railway variable | Render variable | Purpose |
|---|---|---|---|---|
| `NODE_ENV` | yes | `NODE_ENV` | `NODE_ENV` | Production mode |
| `PORT` | yes | `PORT` | `PORT` | Bind port |
| `API_BASE_URL` | yes | `API_BASE_URL` | `API_BASE_URL` | API base URL |

## GitHub Secrets Mapping
| Secret name | Used in | Description |
|---|---|---|
| `RAILWAY_TOKEN` | deploy workflow | Railway CLI auth |
| `RAILWAY_PROJECT_ID` | deploy workflow | Railway project id for non-interactive deploys |
| `RAILWAY_ENVIRONMENT_ID` | deploy workflow | Railway environment id (production) |
| `RENDER_API_DEPLOY_HOOK` | deploy workflow | Render API deploy webhook |
| `RENDER_WEB_DEPLOY_HOOK` | deploy workflow | Render web deploy webhook |
| `PROD_API_URL` | smoke-check job | API URL for smoke checks |
| `PROD_WEB_URL` | smoke-check job | Web URL for smoke checks |

## Healthcheck Endpoints
- API: `/healthz`, `/readyz`
- WEB: `/healthz`, `/readyz`

## Deployment Smoke Checks
Run manually:

```bash
API_URL=https://your-api.example.com WEB_URL=https://your-web.example.com bash scripts/deployment-smoke-check.sh
```


## Automated Updates
- Dependabot configuration is tracked in `.github/dependabot.yml`.
- npm dependencies and GitHub Actions are checked weekly and opened as pull requests.
