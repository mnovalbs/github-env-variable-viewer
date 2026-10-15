# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An Astro + React SSR app for browsing and editing GitHub Actions environment variables across an org's repositories. Flow: Organizations → Repositories (search) → Environments → Variables (view/add/edit).

## Commands

Package manager is bun (`bun.lockb` present).

```bash
bun install       # install deps
bun dev           # dev server (astro dev)
bun run build     # astro check (typecheck) + astro build
bun run preview   # preview production build
bun start         # run the built server (node dist/server/entry.mjs)
bunx astro check  # typecheck only
```

No test suite or linter is configured in this repo; `astro check` is the only automated verification.

## Setup

Copy `.env.sample` to `.env` and set `GITHUB_TOKEN` (a GitHub personal access token).

## Architecture

- **Rendering mode**: `output: "server"` in [astro.config.mjs](astro.config.mjs) using the `@astrojs/node` standalone adapter — every page does live GitHub API calls at request time, there is no static build of data.
- **Routing mirrors the GitHub resource hierarchy** under `src/pages`, using dynamic path segments as identifiers:
  - `/` → org list
  - `/[orgName]` → repo search within the org
  - `/[orgName]/[repoName]` → environment list for the repo
  - `/[orgName]/[repoName]/[envName]` → variable list/editor for that environment
- **Data access** goes through two layers:
  - `src/utils/octokit.ts` — a single shared `Octokit` instance authenticated with `GITHUB_TOKEN`, used directly in page frontmatter for simple GET requests.
  - `src/utils/request.ts` — helpers used by the env-variable page: `getRepository`, `getVariables` (`octokit.paginate` with an explicit item type, since paginate's types don't list this route), `createEnvironmentVariable`, `updateEnvironmentVariable` (passes the body via `data` because the route's path param and body field are both `name`), and `errorMessage`.
- **Page-level POST handling**: the `[envName]/index.astro` route implements create/update as one Astro page — it checks `Astro.request.method === "POST"`, reads form fields, and dispatches to `updateEnvironmentVariable` (when a variable `name` is present, i.e. editing) or `createEnvironmentVariable` (when creating a new variable). There is no separate API route. POSTs whose `Origin` header doesn't match the app's origin are rejected (CSRF guard, since every request acts with the server token), and a successful save redirects back to the same page (Post/Redirect/Get). Load/write failures are caught in each page's frontmatter and passed to `<Layout errors={[...]}>`, which renders them as shadcn `<Alert variant="destructive">` banners, so helpers in `request.ts` should throw on failure and let the page decide.
- **Production guard**: environments whose name starts with `prod` (case-insensitive) are read-only. The check is duplicated — server-side in `[envName]/index.astro` (rejects the POST with a read-only error) and client-side in `VariableList.tsx` (disables buttons/forms). Keep both in sync; the server check is the real protection.
- **No app-level auth**: every visitor acts with the server's `GITHUB_TOKEN`, so the app is meant for local/internal use only.
- **Types**: `src/types/github.ts` derives all domain types (`Organization`, `Repository`, `Environment`, `EnvironmentVariable`, etc.) from `@octokit/types`/`@octokit/openapi-types` `Endpoints`/`components`, rather than hand-declaring shapes — prefer extending this pattern for new GitHub data rather than writing new interfaces.
- **UI**: React components (`.tsx`) are used for interactive pieces (lists, forms) and hydrated selectively (e.g. `client:visible` on `VariableList` in the env-variable page); Astro `.astro` files own layout/data-fetching and are otherwise server-only. Styling is Tailwind 4 (via `@tailwindcss/vite` in [astro.config.mjs](astro.config.mjs), theme in `src/styles/globals.css`) + shadcn/ui (Radix base). shadcn components live in `src/components/ui` and are added with `bunx shadcn@latest add <name>` (config in `components.json`, aliases use `@src/*`). Radix-based ones (Accordion, Dialog) only work inside a hydrated island. The project is on React 18 types while shadcn targets React 19, so components that spread props onto Radix `Slot` need `React.ComponentPropsWithRef<...>` instead of `React.ComponentProps<...>` (see `button.tsx`, `breadcrumb.tsx`). Shared link lists use `LinkList.tsx`.
- **Path alias**: `@src/*` maps to `src/*` (see [tsconfig.json](tsconfig.json)); some older files still use relative imports.
