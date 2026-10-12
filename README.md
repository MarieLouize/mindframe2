# mindframe

> Turn a source text into a **source-tagged concept article** and a **per-topic
> workbook**. The first public node of [Lattice](https://github.com).

<p>
  <img alt="CI" src="https://img.shields.io/badge/CI-passing-brightgreen">
  <img alt="engine" src="https://img.shields.io/badge/engine-FastAPI-009688">
  <img alt="web" src="https://img.shields.io/badge/web-Next.js-000000">
</p>

---

## TL;DR

Paste a short book or essay and get back a structured study artifact: every concept
tagged to its source, ordered by prerequisite, with a personal layer and a workbook.
Built as a scoped ("baby") version of a larger private pipeline, on a shared platform
data layer.

**Stack:** Python/FastAPI engine · Next.js/TypeScript web · Supabase (shared) · uv + pnpm.

## Repository layout

```
mindframe/
  apps/web/               Next.js app (deploy: Vercel)
    app/                  App Router pages
  services/engine/        FastAPI pipeline engine (deploy: Render)
    app/                  FastAPI app (health, later /runs)
    tests/                pytest
    Dockerfile            container image for Render
  docs/DEPLOY.md          deployment runbook
  render.yaml             Render blueprint (engine)
  .github/workflows/ci.yml
```

## Local development

Engine:

```bash
cd services/engine
uv sync --dev
uv run uvicorn app.main:app --reload   # http://localhost:8000/health
uv run pytest -q
```

Web:

```bash
cd apps/web
pnpm install
pnpm dev                                # http://localhost:3000
```

Set `NEXT_PUBLIC_API_URL` (web) to the engine URL so the status card links correctly.

## Architecture

Two deployable surfaces, one shared data core:

- **Engine** (`services/engine`) — owns the pipeline. Stateless HTTP; every execution
  writes a `runs` row and streams `run_events` to the shared Supabase project. The
  `POST /runs` endpoint is added in M1; M0 ships `/health`.
- **Web** (`apps/web`) — the interface. Talks to the engine and reads Supabase directly
  for live progress and rendered artifacts.

Shared database tables (see the [`lattice`](https://github.com) repo for the schema):
`apps`, `profiles`, `runs`, `run_events`, `artifacts`, `concepts`, `run_metrics`.

## Roadmap

| Milestone | Scope |
|---|---|
| **M0** | Scaffold + deployed hello-world (this) |
| M1 | Engine core + ingest/extract, `POST /runs` |
| M2 | Remaining pipeline stages + quality gate |
| M3 | Web run flow, article + workbook views |
| M4 | Public evals dashboard + docs |
| M5 | Design polish, seeded gallery, demo |
