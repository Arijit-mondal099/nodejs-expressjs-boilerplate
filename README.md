# Nodejs Expressjs Boilerplate With TypeScript, ESM, and Best Practices

A modern, production-ready Express.js boilerplate built with TypeScript, ESM, and a curated set of tools for shipping reliable Node.js services.

**Repository:** [github.com/Arijit-mondal099/nodejs-expressjs-boilerplate](https://github.com/Arijit-mondal099/nodejs-expressjs-boilerplate)

This is a **starting template**, not a framework. It does not include auth, a database, or example CRUD — only the scaffolding every production Node service needs: validated config, structured logging, security middleware, graceful shutdown, a clean test harness, and quality gates wired up.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Available scripts](#available-scripts)
- [Project structure](#project-structure)
- [Environment variables](#environment-variables)
- [Development workflow](#development-workflow)
- [Testing](#testing)
- [Code quality](#code-quality)
- [Git workflow](#git-workflow)
- [Building for production](#building-for-production)
- [Docker](#docker)
- [Deployment checklist](#deployment-checklist)
- [Troubleshooting](#troubleshooting)
- [Architecture decisions](#architecture-decisions)

---

## Features

- **Modern Node.js** — Node 22 LTS, native ESM, `type: "module"`
- **Strict TypeScript** — strict mode on, path aliases (`@/...`), separate base/build configs
- **Type-safe API envelope** — `ApiResponse`, `TypedRequest`, `TypedResponse` enforce a consistent `{ success, message, data? }` shape at compile time
- **Async route helper** — `asyncHandler` forwards rejected promises to the error middleware
- **Validated environment** — Zod schema parses `.env` at startup, exits on invalid input
- **Structured logging** — Pino with `pino-pretty` for dev, raw JSON for prod
- **Security middleware** — helmet, CORS with explicit allow-list, express-rate-limit
- **Graceful shutdown** — SIGTERM/SIGINT handlers, in-flight request draining, 10s force-exit fallback
- **OpenAPI docs** — `swagger-ui-express` served at `/docs`
- **Quality gates** — ESLint 9 (flat config) + Prettier + TypeScript, no overlap
- **Git hygiene** — Husky 9, lint-staged on pre-commit, commitlint on commit-msg
- **Multi-stage Docker** — lean production image (~205 MB), separate build and runtime stages
- **Fast tests** — Jest with `ts-jest` ESM preset, Supertest for HTTP integration

---

## Tech stack

| Layer           | Choice                     | Why                                              |
| --------------- | -------------------------- | ------------------------------------------------ |
| Runtime         | **Node.js 22 (LTS)**       | Active LTS until October 2027                    |
| Language        | **TypeScript 5.9**         | Strict mode, ESM output                          |
| Framework       | **Express 5**              | Mature, native async error handling              |
| Validation      | **Zod 4**                  | TypeScript-native, no compile-time codegen       |
| Logger          | **Pino 10**                | Fastest structured logger in Node                |
| Tests           | **Jest 30 + Supertest 7**  | De-facto standard for Node HTTP tests            |
| Build           | **tsc + tsc-alias**        | Standard TypeScript output, path-alias rewriting |
| Dev runner      | **tsx**                    | Fast TS execution with watch mode                |
| Package manager | **pnpm 10**                | Strict, fast, content-addressable                |
| Linter          | **ESLint 9** (flat config) | Latest config format, type-aware rules           |
| Formatter       | **Prettier 3**             | Opinionated, ESLint-compatible                   |

---

## Prerequisites

- **Node.js 22.x** (use `nvm use` to match `.nvmrc`)
- **pnpm 10.x** (via Corepack: `corepack enable && corepack prepare pnpm@latest --activate`)
- **Docker** (optional, only needed for containerized runs)
- **Git** (required — husky hooks rely on it)

Check your versions:

```bash
node --version    # should be v22.x
pnpm --version    # should be 10.x
```

---

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/Arijit-mondal099/nodejs-expressjs-boilerplate.git
cd nodejs-expressjs-boilerplate
nvm use            # switches to Node 22
pnpm install       # installs deps + sets up husky hooks via "prepare"
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your values. See [Environment variables](#environment-variables) for what each one does.

### 3. Run in development

```bash
pnpm dev
```

Server starts on `http://localhost:3000` with hot reload via `tsx watch`. Try it:

```bash
curl http://localhost:3000/api/v1/health
# {"success":true,"message":"Server is healthy"}
```

Swagger UI: [http://localhost:3000/docs](http://localhost:3000/docs)

### 4. Verify everything works

```bash
pnpm typecheck     # TypeScript types
pnpm lint          # ESLint
pnpm format:check  # Prettier
pnpm test          # Jest
pnpm build         # Produces dist/
```

All five should exit `0`.

---

## Available scripts

| Script              | Purpose                                                               |
| ------------------- | --------------------------------------------------------------------- |
| `pnpm dev`          | Run with hot reload via `tsx watch`                                   |
| `pnpm build`        | Clean `dist/`, compile TS, rewrite path aliases with `.js` extensions |
| `pnpm start`        | Run the compiled `dist/server.js` under raw Node                      |
| `pnpm clean`        | Delete `dist/`                                                        |
| `pnpm typecheck`    | `tsc --noEmit` — type-check without emitting files                    |
| `pnpm lint`         | Run ESLint across the repo                                            |
| `pnpm lint:fix`     | Auto-fix ESLint issues                                                |
| `pnpm format`       | Format all files with Prettier                                        |
| `pnpm format:check` | Verify formatting without writing                                     |
| `pnpm test`         | Run Jest suite once (single thread)                                   |
| `pnpm test:watch`   | Run Jest in watch mode                                                |
| `pnpm infra:up`     | `docker compose up -d`                                                |
| `pnpm infra:down`   | `docker compose down`                                                 |
| `pnpm infra:logs`   | Tail compose logs                                                     |
| `pnpm infra:ps`     | Show running compose services                                         |
| `pnpm prepare`      | Install husky hooks (runs automatically after `pnpm install`)         |

---

## Project structure

```
.
├── src/
│   ├── app.ts                       # Express app: middleware pipeline, routes
│   ├── server.ts                    # HTTP server bootstrap, graceful shutdown
│   ├── config/
│   │   ├── env.ts                   # Zod-validated environment variables
│   │   ├── logger.ts                # Pino logger (pino-pretty in dev)
│   │   ├── cors.ts                  # CORS allow-list logic
│   │   ├── rate-limit.ts            # Global rate limiter
│   │   └── swagger.ts               # OpenAPI document + UI setup
│   ├── middlewares/
│   │   ├── error.middleware.ts      # Centralized error handler
│   │   └── not-found.middleware.ts  # 404 handler
│   ├── routes/
│   │   ├── index.ts                 # Mounts all sub-routers
│   │   └── health.route.ts          # GET /api/v1/health
│   ├── types/
│   │   └── api.ts                   # Shared API response + request types
│   └── utils/
│       ├── ApiError.ts              # Operational error class (statusCode + message)
│       └── asyncHandler.ts          # Forwards async rejections to error middleware
├── tests/
│   └── health.test.ts               # Supertest integration test
├── .husky/
│   ├── pre-commit                   # Runs lint-staged
│   └── commit-msg                   # Runs commitlint
├── Dockerfile                       # Multi-stage build (builder + runtime)
├── docker-compose.yml               # Local container orchestration
├── tsconfig.json                    # Base config (IDE + typecheck + tests)
├── tsconfig.build.json              # Production build config (excludes tests)
├── eslint.config.js                 # ESLint 9 flat config
├── commitlint.config.js             # Conventional Commits rules
├── jest.config.ts                   # Jest + ts-jest ESM preset
└── .env.example                     # Template for required env vars
```

---

## Environment variables

All env vars are validated by [src/config/env.ts](src/config/env.ts) at startup. If any required var is missing or malformed, the process logs the validation errors and exits with code `1` — your service will not start in a broken state.

| Variable          | Type       | Default       | Description                                                                |
| ----------------- | ---------- | ------------- | -------------------------------------------------------------------------- |
| `PORT`            | number     | `3000`        | HTTP listen port                                                           |
| `NODE_ENV`        | enum       | `development` | One of `development`, `production`, `test`                                 |
| `ALLOWED_ORIGINS` | CSV string | `""`          | Comma-separated CORS origins, e.g. `https://app.com,https://admin.app.com` |

**Adding new variables:**

1. Add the field to the Zod schema in [src/config/env.ts](src/config/env.ts)
2. Add it to [.env.example](.env.example) with documentation
3. Use it via `import { env } from "@/config/env"` — never read `process.env` directly

```ts
const envSchema = z.object({
  // ...
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32)
});
```

---

## Development workflow

### Adding a new route

1. Create a router file in [src/routes/](src/routes/) using the project's typed pattern — `asyncHandler` for error propagation, `TypedRequest` / `Response<ApiResponse<T>>` for compile-time type safety:

   ```ts
   // src/routes/user.route.ts
   import { Response, Router } from "express";
   import { StatusCodes } from "http-status-codes";

   import type { ApiResponse, TypedRequest } from "@/types/api";
   import { ApiError } from "@/utils/ApiError";
   import { asyncHandler } from "@/utils/asyncHandler";

   interface CreateUserBody {
     email: string;
     name: string;
   }

   interface User {
     id: string;
     email: string;
     name: string;
   }

   const router = Router();

   router.post(
     "/",
     asyncHandler(
       async (
         req: TypedRequest<CreateUserBody>,
         res: Response<ApiResponse<User>>
       ) => {
         if (!req.body.email) {
           throw new ApiError(StatusCodes.BAD_REQUEST, "Email is required");
         }

         const user: User = { id: "1", ...req.body };

         res.status(StatusCodes.CREATED).json({
           success: true,
           message: "User created",
           data: user
         });
       }
     )
   );

   export default router;
   ```

2. Mount it in [src/routes/index.ts](src/routes/index.ts):

   ```ts
   import userRoute from "@/routes/user.route";
   router.use("/users", userRoute);
   ```

3. Document it in [src/config/swagger.ts](src/config/swagger.ts).
4. Add a test in [tests/](tests/).

### Type-safe request and response

Three types in [src/types/api.ts](src/types/api.ts) keep every endpoint consistent:

| Type                                   | Purpose                                                                                    |
| -------------------------------------- | ------------------------------------------------------------------------------------------ |
| `ApiResponse<T>`                       | Union of `ApiSuccessResponse<T>` and `ApiErrorResponse` — the shape every endpoint returns |
| `TypedRequest<TBody, TQuery, TParams>` | Express `Request` with typed `body`, `query`, and `params`                                 |
| `TypedResponse<T>`                     | Express `Response` constrained to `ApiResponse<T>`                                         |

If you write a response that violates the envelope, the compiler rejects it:

```ts
res.json({ ok: true }); // TS error — wrong shape
res.json({ success: true }); // TS error — missing `message`
res.json({ success: true, message: "OK" }); // OK
```

### Throwing errors

Use [ApiError](src/utils/ApiError.ts) for operational errors with an HTTP status. The error middleware will convert it to a JSON response automatically.

```ts
import { StatusCodes } from "http-status-codes";
import { ApiError } from "@/utils/ApiError";

if (!user) {
  throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
}
```

Non-`ApiError` thrown values are logged and returned as a generic `500 Internal Server Error` — never leak internal error messages to clients.

### Logging

Always use the structured logger from [src/config/logger.ts](src/config/logger.ts) — never `console.log` or `console.error`. Pino's first argument should be an object for structured fields, second is the message:

```ts
import { logger } from "@/config/logger";

logger.info({ userId: user.id }, "User authenticated");
logger.error({ err: error }, "Database query failed");
```

In development, output is pretty-printed by `pino-pretty`. In production, it's raw JSON ready for ingestion by Datadog, Loki, CloudWatch, etc.

---

## Testing

Tests live in [tests/](tests/) and use Jest + Supertest. The Express app is imported and tested without binding to a port — Supertest handles request injection directly.

```ts
import supertest from "supertest";
import app from "@/app";

describe("GET /api/v1/health", () => {
  it("returns 200 with success payload", async () => {
    const res = await supertest(app).get("/api/v1/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "Server is healthy"
    });
  });
});
```

Run:

```bash
pnpm test          # one-off
pnpm test:watch    # watch mode
```

---

## Code quality

Three independent tools, each with one job:

| Tool                   | What it checks                      | Config                               |
| ---------------------- | ----------------------------------- | ------------------------------------ |
| **TypeScript** (`tsc`) | Type correctness                    | [tsconfig.json](tsconfig.json)       |
| **ESLint**             | Code patterns, bugs, unused vars    | [eslint.config.js](eslint.config.js) |
| **Prettier**           | Whitespace, semicolons, line length | [.prettierrc](.prettierrc)           |

There's no overlap — ESLint doesn't format, Prettier doesn't lint. Run them all before committing (or let the pre-commit hook do it for you):

```bash
pnpm typecheck && pnpm lint && pnpm format:check && pnpm test
```

---

## Git workflow

### Branch strategy

Adopt whatever fits your team (Git Flow, GitHub Flow, trunk-based). The hooks below work with any.

### Commit conventions

[Conventional Commits](https://www.conventionalcommits.org/) are enforced by commitlint on the `commit-msg` hook. Valid types:

| Type       | When to use                           |
| ---------- | ------------------------------------- |
| `feat`     | A new user-facing feature             |
| `fix`      | A bug fix                             |
| `docs`     | Documentation only                    |
| `style`    | Formatting, no code change            |
| `refactor` | Internal change, no behavior change   |
| `perf`     | Performance improvement               |
| `test`     | Adding/fixing tests                   |
| `build`    | Build system or deps                  |
| `ci`       | CI configuration                      |
| `chore`    | Misc (version bumps, generated files) |
| `revert`   | Reverts a previous commit             |

**Format:**

```
<type>(<optional-scope>): <subject>

[optional body]

[optional footer]
```

**Examples:**

```
feat: add user registration endpoint
fix(rate-limit): correct trust-proxy depth for nginx
docs: document ALLOWED_ORIGINS variable
chore: bump express to 5.2
```

### Pre-commit hook

[`.husky/pre-commit`](.husky/pre-commit) runs `lint-staged`, which formats and lints only the files you staged. Configured in [package.json](package.json):

```json
"lint-staged": {
  "*.{ts,js}": ["eslint --fix", "prettier --write"],
  "*.{json,md,yml,yaml}": ["prettier --write"]
}
```

### Commit-msg hook

[`.husky/commit-msg`](.husky/commit-msg) runs commitlint against your message. Bad messages are rejected before the commit is created.

---

## Building for production

```bash
pnpm build
```

This runs three steps:

1. `pnpm clean` — remove old `dist/`
2. `tsc -p tsconfig.build.json` — compile TypeScript to `dist/` (excludes tests)
3. `tsc-alias -p tsconfig.build.json --resolve-full-paths` — rewrite `@/...` aliases to relative paths and append `.js` extensions for Node ESM compatibility

The output `dist/` mirrors `src/` 1:1 and runs under raw Node 22:

```bash
NODE_ENV=production node dist/server.js
```

Source maps (`*.js.map`) are generated for production stack-trace mapping.

---

## Docker

### Build

```bash
docker compose build
```

### Run

```bash
docker compose up -d
# or as a foreground process:
docker compose up
```

### Logs

```bash
pnpm infra:logs
```

### Image structure

Two-stage build for a lean final image:

- **Builder stage:** installs all deps (incl. devDependencies), runs `pnpm build`
- **Runtime stage:** copies `dist/` + installs prod-only deps with `--ignore-scripts` (skips husky's `prepare`)

The `.dockerignore` excludes `node_modules/`, `.git/`, tests, dev configs, and docs — context transfer is well under 1 MB.

---

## Deployment checklist

Before deploying to production, verify:

- [ ] `NODE_ENV=production` is set in the runtime environment
- [ ] All required env vars from [.env.example](.env.example) are configured in your secrets store
- [ ] `ALLOWED_ORIGINS` is set to your actual frontend domain(s) — not empty, not `*`
- [ ] Reverse proxy (nginx, ALB, Cloudflare) is in front of the app
- [ ] `app.set("trust proxy", 1)` matches your proxy depth (raise if multi-hop)
- [ ] Rate limit values in [src/config/rate-limit.ts](src/config/rate-limit.ts) suit your traffic
- [ ] Logs are being shipped to your aggregator (Datadog, Loki, CloudWatch, etc.)
- [ ] Error tracking is wired up (Sentry, Bugsnag) — not included by default
- [ ] Container orchestrator sends SIGTERM on shutdown (Docker, Kubernetes both do by default)
- [ ] Health endpoint is wired into your load balancer / orchestrator probe
- [ ] HTTPS terminates at the proxy — the app speaks plain HTTP

---

## Troubleshooting

### `ERR_MODULE_NOT_FOUND: Cannot find module '@/...'`

You're running compiled output without `tsc-alias` having run. Re-run `pnpm build` — `tsc-alias` rewrites `@/...` imports to relative paths with `.js` extensions.

### `pnpm install` fails with `ERR_PNPM_PUBLIC_HOIST_PATTERN_DIFF`

You changed [.npmrc](.npmrc) but the existing `node_modules/` was built with the old hoist pattern. Run `pnpm install` again (it'll rebuild `node_modules/`).

### Husky hooks aren't firing

```bash
pnpm prepare      # reinstalls hooks
ls -la .husky/    # check hooks exist
```

If running inside a CI environment or fresh clone without a previous `pnpm install`, hooks may not be set up. The `prepare` script handles this on every `pnpm install`.

### `sh: husky: not found` during Docker build

The production stage uses `--ignore-scripts` to skip lifecycle scripts (including husky's `prepare`). If you've modified the Dockerfile and removed that flag, restore it.

### `pnpm test` fails with module resolution errors

Tests use the path alias `@/...` via Jest's `moduleNameMapper`. Check [jest.config.ts](jest.config.ts) is loading `ts-jest/presets/default-esm`.

### CORS rejects every request

[ALLOWED_ORIGINS](.env.example) is empty. Set it to your frontend's origin(s) in `.env`. Server-to-server requests (no `Origin` header) are always allowed.

---

## Architecture decisions

### Why `tsc` + `tsc-alias` instead of a bundler?

For backend services, `tsc`-emitted files give cleaner stack traces, work with native modules (`bcrypt`, `sharp`), and integrate with APM tools (Datadog, New Relic) that introspect `node_modules/`. Bundlers (`tsup`, `esbuild`) win on speed but lose those guarantees. `tsc-alias` adds the path-rewriting that vanilla `tsc` lacks.

### Why `moduleResolution: "Bundler"` if there's no bundler?

It lets us write `import x from "@/foo"` without `.js` extensions in source. `tsc-alias` rewrites the output to add extensions and resolve aliases, so Node ESM is happy at runtime. The DX win is significant.

### Why pnpm?

Strict node_modules layout (you can't accidentally import a transitive dep), faster installs via content-addressable storage, and lockfile semantics that catch resolution drift. Once you've used it, npm and Yarn feel sloppy.

### Why no auth or DB?

This is a boilerplate, not a starter kit. Auth and database choices are application-specific — adding them here would force opinions on every future project. Build them per-app.

---

## License

Choose one and add a `LICENSE` file. MIT is the safe default for open-source boilerplates.
