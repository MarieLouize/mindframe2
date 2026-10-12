# Deploy runbook — M0

Everything here is done with **your** accounts and credentials. The code and configs
are committed; these are the clicks/commands to make it live. Do the steps in order.

## 0. Prerequisites

- A GitHub account (personal — see `lattice/docs/DECISIONS.md`, REPO-05).
- A [Vercel](https://vercel.com) account (web).
- A [Render](https://render.com) account (engine).
- A [Supabase](https://supabase.com) account (shared data core).
- Supabase CLI (already installed here: `supabase --version`).

## 1. Push the two repos to GitHub

On GitHub, create two **empty** repos under your account (no README, no .gitignore,
no license): `lattice` and `mindframe`. Then push over HTTPS (this machine has no SSH
key, only a stored HTTPS token for `MarieLouize`):

```bash
cd /root/lattice
git add -A
git commit -m "chore: scaffold lattice platform (schema + docs)"
git branch -M main
git remote add origin https://github.com/MarieLouize/lattice.git
git push -u origin main

cd /root/mindframe
git add -A
git commit -m "chore: scaffold mindframe node (engine + web)"
git branch -M main
git remote add origin https://github.com/MarieLouize/mindframe.git
git push -u origin main
```

Credentials: `git` is configured with `credential.helper=store`, so your existing
token will be used automatically. If the push is rejected, create a classic token with
`repo` scope at https://github.com/settings/tokens and use username `MarieLouize` +
the token as the password.

CI (`.github/workflows/ci.yml`) runs the engine tests and the web build on every push.

## 2. Create the shared Supabase project

1. Create a project named **lattice** in the Supabase dashboard.
2. Note the **project ref**, the **URL**, and the **service role key**.

Apply the schema from the `lattice` repo:

```bash
cd /root/lattice
supabase login
supabase link --project-ref <project-ref>
supabase db push
```

Verify in the dashboard: tables `apps`, `profiles`, `runs`, `run_events`, `artifacts`,
`concepts`, `run_metrics` exist, and `apps` has the `mindframe` row.

## 3. Deploy the engine (Render)

Option A — blueprint: in Render, **New → Blueprint**, point at your `mindframe` repo;
it reads `render.yaml`. Option B — manual: **New → Web Service**, runtime **Docker**,
context `services/engine`, Dockerfile `services/engine/Dockerfile`, health check `/health`.

Set environment variables in Render:

| Key | Value |
|---|---|
| `LLM_PROVIDER` | `gemini` |
| `CORS_ORIGINS` | your Vercel URL (set after step 4) |
| `SUPABASE_URL` | from step 2 |
| `SUPABASE_SERVICE_KEY` | service role key from step 2 |
| `GEMINI_API_KEY` | your key |
| `OPENAI_API_KEY` | your key |

Render injects `$PORT`; the Dockerfile binds to it. Confirm:
`https://<engine>.onrender.com/health` → `{"status":"ok",...}`.

## 4. Deploy the web (Vercel)

1. **New Project → Import** your `mindframe` repo.
2. Set **Root Directory** to `apps/web`.
3. Add environment variable `NEXT_PUBLIC_API_URL` = the Render engine URL from step 3.
4. Deploy. Confirm the page loads and its status card links to `/health`.

## 5. Close the loop

Set the engine's `CORS_ORIGINS` (Render) to your Vercel URL and redeploy the engine.

---

## Notes & constraints

- **Local Python runtime on Termux:** this device's Python is Termux/Android (bionic),
  and `pydantic` v2 has no prebuilt wheel for that platform, so the engine is built and
  run in CI/Render (standard Linux), not locally. Local engine verification here is
  limited to syntax checks; full tests run in GitHub Actions and on Render.
- **Local Postgres:** the Supabase local stack needs Docker, which is unavailable here.
  Schema changes are validated via `supabase db push` against the hosted project.
- Keep the service role key server-side only (Render env vars). Never expose it to the web.
