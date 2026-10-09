# GitHub Env Variable Viewer

A small web app to browse and edit **GitHub Actions environment variables** across all repositories in your organizations — without clicking through each repo's settings page.

Flow: **Organization → Repository (search) → Environment → Variables** (view, add, edit).

Built with [Astro](https://astro.build) (server-rendered) + React, styled with Tailwind + daisyUI. All data is fetched live from the GitHub API on every request; there is no database.

## Setup

Requires [bun](https://bun.sh).

```bash
cp .env.sample .env   # then set GITHUB_TOKEN
bun install
bun dev               # http://localhost:4321
```

### GitHub token

`GITHUB_TOKEN` is a personal access token. Every action in the app is performed as the token's owner.

- **Classic token**: scopes `repo` and `read:org`.
- **Fine-grained token**: repository permissions *Environments: read* and *Variables: read & write*, plus organization *Members: read*.

## Commands

| Command | Description |
|---|---|
| `bun dev` | Start dev server |
| `bun run build` | Typecheck (`astro check`) + production build |
| `bun run preview` | Preview the production build |

There is no test suite; `bun run build` is the check to run before pushing.

## Pages

| URL | What it shows |
|---|---|
| `/` | Organizations the token can access |
| `/:org` | Repository search within the org |
| `/:org/:repo` | Environments of the repo |
| `/:org/:repo/:env` | Variables of the environment — add/edit via forms |

## Things to know

- **Production is read-only.** Environments whose name starts with `prod` (case-insensitive) cannot be edited from this app. The guard lives in both `src/pages/[orgName]/[repoName]/[envName]/index.astro` (server) and `src/components/VariableList.tsx` (UI) — keep them in sync.
- **No login.** Anyone who can reach the server acts with your token. Run it locally or on a trusted internal network only.
- **Deleting variables is not supported** — use GitHub's UI for that.
- Repository search returns at most 10 results; refine the keyword to find a specific repo.

## Project structure

```
src/
  pages/        # routes mirror GitHub hierarchy; data fetching + form POST handling
  components/   # React UI (lists, forms)
  utils/        # Octokit client + GitHub API helpers (request.ts)
  types/        # types derived from @octokit/types
```

See [CLAUDE.md](CLAUDE.md) for more architecture details.
