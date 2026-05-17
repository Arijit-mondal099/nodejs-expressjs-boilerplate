# =========================== Build stage ===========================
FROM node:22-alpine AS builder

# Sets pnpm installation directory
# Adds pnpm binary path into system PATH, So you can run pnpm directly
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Corepack manages package managers like pnpm, yarn
RUN corepack enable

WORKDIR /app

# Docker layer caching
# If source code changes but dependencies don't change, Docker can reuse the layer with installed dependencies
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# Copies the entire project into container
# Now source code exists inside /app
COPY . .

# Builds the application using the build script defined in package.json
# This typically compiles TypeScript to JavaScript, bundles files, and prepares the app for production
RUN pnpm run build

# ========================= Production stage =========================
FROM node:22-alpine

ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Installs only production dependencies, excluding devDependencies to reduce image size.
# --ignore-scripts skips lifecycle scripts (e.g. "prepare": "husky") that would otherwise
# fail in production where husky isn't installed.
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# Copies only the built files from the builder stage to keep the production image lean
# From builder:/app/dist -> To current stage:/app/dist
# Not: source code, tests, tsconfig and node_modules from builder, Very important for clean production images
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["pnpm", "start"]
