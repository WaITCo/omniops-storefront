# omniops-storefront

Next.js 15 Headless eCommerce Frontend für den **FORMA Demo-Shop**.

## Voraussetzungen

- Node.js 20+
- [omniops-os](https://github.com/WaITCo/omniops-os) läuft lokal (Strapi :1337, n8n :5678)

## Quickstart

```bash
cp .env.example .env.local
# .env.local ausfüllen
npm install
npm run dev   # → http://localhost:3002
```

## Deployment

```bash
make deploy-aws
make deploy-gcp GCP_PROJECT_ID=<id>
```

Siehe [CLAUDE.md](CLAUDE.md) für den vollständigen Workflow.
