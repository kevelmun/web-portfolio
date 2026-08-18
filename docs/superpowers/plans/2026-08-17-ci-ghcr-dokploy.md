# CI, GHCR and Dokploy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Validate the portfolio on GitHub-hosted ARM64 runners, publish a reproducible `linux/arm64` image to GHCR, and trigger Dokploy only after a successful immutable release.

**Architecture:** One workflow separates unprivileged application validation and pull-request image checks from a serialized release job. The release job publishes both immutable and `latest` tags, then calls the existing Dokploy webhook; Dokploy remains a pull-and-run target and never compiles application code.

**Tech Stack:** GitHub Actions, pnpm 10.23.0, Node.js 22.23.2 LTS, Docker Buildx/BuildKit, GHCR, Nginx 1.30.4 Alpine, Dokploy webhook.

**Spec:** `docs/superpowers/specs/2026-08-17-ci-ghcr-dokploy-design.md`

## Global Constraints

- Production branch is exactly `main`; implementation branch is `feature/ci-ghcr-dokploy`.
- Every GitHub-hosted job uses `ubuntu-24.04-arm`; no self-hosted runner is permitted.
- Pull requests validate and build but never publish, receive deployment secrets, or call Dokploy.
- Only the release job receives `packages: write`; all checkout jobs receive `contents: read`.
- Dependency installation is exactly `pnpm install --frozen-lockfile` using pnpm 10.23.0 from `package.json`.
- Existing validation commands are exactly `pnpm lint` and `pnpm build`; `pnpm build` includes strict TypeScript checking.
- The repository has no automated test command or test suite, so no test framework will be introduced.
- The only required GitHub Actions secret is `DOKPLOY_DEPLOY_WEBHOOK_URL`.
- The optional repository variable `DOKPLOY_AUTO_DEPLOY_ENABLED=false` disables only the webhook; publication continues.
- Docker builds accept no secret `ARG` or persistent secret `ENV`.
- Runtime remains Nginx on port 80 with the existing `ops/nginx/default.conf` routing behavior.
- Dokploy continues to consume `latest`; every published commit also retains `sha-FULL_COMMIT_SHA` for manual rollback.
- Do not modify external GitHub, GHCR, or Dokploy state during implementation.

## File Map

- `.github/workflows/ci-ghcr-dokploy.yml`: CI validation, PR image build, GHCR publication, and conditional Dokploy webhook.
- `.gitignore`: stop ignoring `.github` so the workflow is tracked.
- `Dockerfile.dokploy`: reproducible ARM64-compatible multi-stage production image.
- `.dockerignore`: minimize and sanitize Docker build context.
- `docs/deployment-ghcr-dokploy.md`: operator guide for GitHub, GHCR, Dokploy, verification, disabling, and rollback.
- `README.md`: link to the new deployment guide and identify the external-image production path.
- `AGENTS.md`: keep the documented production Node.js builder version accurate.

---

### Task 1: Harden the production Docker build

**Files:**
- Modify: `Dockerfile.dokploy`
- Modify: `.dockerignore`
- Modify: `AGENTS.md`

**Interfaces:**
- Consumes: `package.json`, `pnpm-lock.yaml`, `src/`, `public/`, Vite/TypeScript/Tailwind configuration, and `ops/nginx/default.conf`.
- Produces: a static production image named locally as `web-portfolio:ci-arm64`, listening on port 80 and containing no build dependencies.

- [ ] **Step 1: Record the pre-change Docker assertions as failing**

Run:

```powershell
rg -n "node:22\.23\.2-alpine3\.24|nginx:1\.30\.4-alpine3\.24-slim" Dockerfile.dokploy
rg -n "^/\.github$|^/docs$|^/design-system$" .dockerignore
```

Expected: both commands fail to find the required hardened versions/exclusions because the current file uses floating Node 20 and Nginx tags and the context exclusions are incomplete.

- [ ] **Step 2: Replace `Dockerfile.dokploy` with the minimal two-stage build**

Use this exact structure:

```dockerfile
# syntax=docker/dockerfile:1

FROM node:22.23.2-alpine3.24 AS build
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY index.html postcss.config.js tailwind.config.js tsconfig.json tsconfig.node.json vite.config.ts ./
COPY public ./public
COPY src ./src

RUN pnpm build

FROM nginx:1.30.4-alpine3.24-slim AS runtime
COPY ops/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

- [ ] **Step 3: Restrict `.dockerignore` to exclude non-build inputs and sensitive local files**

Preserve the existing exclusions and add these root/documentation patterns:

```dockerignore
/.github
/docs
/design-system
/AGENTS.md
/CLAUDE.md
/README.md
/LICENSE
/Caddyfile
/Dockerfile
/Dockerfile.prod
/Dockerfile.prod.caddy
/docker-compose.yml
/docker-compose.prod.yml
/.eslintrc.cjs
```

Do not exclude `Dockerfile.dokploy`, `ops/nginx/default.conf`, `src/`, `public/`, or any Vite/TypeScript/Tailwind configuration copied by the Dockerfile.

- [ ] **Step 4: Update the production builder reference in `AGENTS.md`**

Change only the production sentence so it states that `Dockerfile.dokploy` builds with Node.js 22 LTS and serves with the pinned Nginx Alpine runtime. Leave the development-container Node 20 convention untouched.

- [ ] **Step 5: Re-run the static assertions**

Run:

```powershell
rg -n "node:22\.23\.2-alpine3\.24|nginx:1\.30\.4-alpine3\.24-slim" Dockerfile.dokploy
rg -n "^/\.github$|^/docs$|^/design-system$" .dockerignore
rg -n "Node\.js 22 LTS" AGENTS.md
git diff --check
```

Expected: all patterns are present and `git diff --check` exits 0.

- [ ] **Step 6: Commit the Docker hardening**

```powershell
git add Dockerfile.dokploy .dockerignore AGENTS.md
git commit -m "build: harden ARM64 production image"
```

---

### Task 2: Add the least-privilege GitHub Actions workflow

**Files:**
- Create: `.github/workflows/ci-ghcr-dokploy.yml`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: the exact Docker build from Task 1, repository `main`, `GITHUB_TOKEN`, `DOKPLOY_DEPLOY_WEBHOOK_URL`, and optional `DOKPLOY_AUTO_DEPLOY_ENABLED`.
- Produces: PR validation without publication and serialized `main` releases at `ghcr.io/kevelmun/web-portfolio:latest` plus `sha-FULL_COMMIT_SHA`.

- [ ] **Step 1: Verify the workflow cannot currently be tracked**

Run:

```powershell
git check-ignore -v .github/workflows/ci-ghcr-dokploy.yml
```

Expected: output identifies the `.github` rule near the end of `.gitignore`.

- [ ] **Step 2: Stop ignoring `.github` and create the workflow**

Remove only the `.github` line from `.gitignore`. Create `.github/workflows/ci-ghcr-dokploy.yml` with this job graph and pinned actions:

```yaml
name: CI, GHCR and Dokploy

on:
  pull_request:
    branches:
      - main
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read

env:
  NODE_VERSION: "22.23.2"
  REGISTRY: ghcr.io

jobs:
  validate:
    name: Validate application
    runs-on: ubuntu-24.04-arm
    timeout-minutes: 15
    permissions:
      contents: read
    steps:
      - name: Check out repository
        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false

      - name: Set up Node.js
        uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
        with:
          node-version: ${{ env.NODE_VERSION }}
          package-manager-cache: false

      - name: Enable pinned pnpm
        run: corepack enable

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Type-check and build
        run: pnpm build

      - name: Upload production build
        uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7.0.1
        with:
          name: dist-${{ github.sha }}
          path: dist
          if-no-files-found: error
          retention-days: 7

  image-check:
    name: Build ARM64 image without publishing
    if: github.event_name == 'pull_request'
    needs: validate
    runs-on: ubuntu-24.04-arm
    timeout-minutes: 20
    permissions:
      contents: read
    steps:
      - name: Check out repository
        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@bb05f3f5519dd87d3ba754cc423b652a5edd6d2c # v4.2.0

      - name: Build ARM64 image
        uses: docker/build-push-action@53b7df96c91f9c12dcc8a07bcb9ccacbed38856a # v7.3.0
        with:
          context: .
          file: Dockerfile.dokploy
          platforms: linux/arm64
          push: false
          cache-from: type=gha,scope=portfolio-arm64

  release:
    name: Publish image and deploy
    if: >-
      (github.event_name == 'push' || github.event_name == 'workflow_dispatch') &&
      github.ref == 'refs/heads/main'
    needs: validate
    runs-on: ubuntu-24.04-arm
    timeout-minutes: 30
    concurrency:
      group: portfolio-production-release
      cancel-in-progress: false
    permissions:
      contents: read
      packages: write
    steps:
      - name: Check out repository
        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false

      - name: Normalize image name
        id: image
        shell: bash
        run: |
          repository="${GITHUB_REPOSITORY,,}"
          echo "name=${REGISTRY}/${repository}" >> "$GITHUB_OUTPUT"

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@bb05f3f5519dd87d3ba754cc423b652a5edd6d2c # v4.2.0

      - name: Log in to GHCR
        uses: docker/login-action@dbcb813823bdd20940b903addbd779551569679f # v4.6.0
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Generate image metadata
        id: meta
        uses: docker/metadata-action@dc802804100637a589fabce1cb79ff13a1411302 # v6.2.0
        with:
          images: ${{ steps.image.outputs.name }}
          tags: |
            type=raw,value=sha-${{ github.sha }}
            type=raw,value=latest
          labels: |
            org.opencontainers.image.source=${{ github.server_url }}/${{ github.repository }}
            org.opencontainers.image.revision=${{ github.sha }}

      - name: Build and push ARM64 image
        uses: docker/build-push-action@53b7df96c91f9c12dcc8a07bcb9ccacbed38856a # v7.3.0
        with:
          context: .
          file: Dockerfile.dokploy
          platforms: linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha,scope=portfolio-arm64
          cache-to: type=gha,mode=max,scope=portfolio-arm64

      - name: Trigger Dokploy deployment
        if: vars.DOKPLOY_AUTO_DEPLOY_ENABLED != 'false'
        shell: bash
        env:
          DOKPLOY_DEPLOY_WEBHOOK_URL: ${{ secrets.DOKPLOY_DEPLOY_WEBHOOK_URL }}
        run: |
          if [ -z "$DOKPLOY_DEPLOY_WEBHOOK_URL" ]; then
            echo "::error::DOKPLOY_DEPLOY_WEBHOOK_URL is not configured."
            exit 1
          fi

          curl \
            --request POST \
            --proto '=https' \
            --fail-with-body \
            --silent \
            --show-error \
            --output /dev/null \
            --connect-timeout 10 \
            --max-time 30 \
            --retry 3 \
            --retry-connrefused \
            --retry-delay 5 \
            --retry-max-time 90 \
            "$DOKPLOY_DEPLOY_WEBHOOK_URL"
```

`docker/metadata-action` supplies the standard `org.opencontainers.image.created` label automatically; the workflow explicitly fixes `source` and `revision` to the repository and validated commit.

- [ ] **Step 3: Run static security assertions against the workflow**

Run:

```powershell
git check-ignore .github/workflows/ci-ghcr-dokploy.yml
rg -n "ubuntu-24\.04-arm|linux/arm64|packages: write|sha-\$\{\{ github\.sha \}\}|DOKPLOY_DEPLOY_WEBHOOK_URL|cancel-in-progress: false" .github/workflows/ci-ghcr-dokploy.yml
rg -n "pull_request_target|self-hosted|secrets\..*(PAT|TOKEN).*password" .github/workflows/ci-ghcr-dokploy.yml
git diff --check
```

Expected: `git check-ignore` exits 1 with no output; required patterns are present; the forbidden-pattern search exits 1 with no output; `git diff --check` exits 0.

- [ ] **Step 4: Validate GitHub Actions syntax when `actionlint` is available**

Run from the repository root:

```powershell
actionlint .github/workflows/ci-ghcr-dokploy.yml
```

Expected: exit 0 with no diagnostics. If `actionlint` is unavailable, record that fact and perform YAML parsing plus the static security assertions instead; do not install a new project dependency.

- [ ] **Step 5: Commit the workflow**

```powershell
git add .gitignore .github/workflows/ci-ghcr-dokploy.yml
git commit -m "ci: publish ARM64 image and trigger Dokploy"
```

---

### Task 3: Write the production operator guide

**Files:**
- Create: `docs/deployment-ghcr-dokploy.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: workflow name, exact GHCR image path, tags, secret, optional disable variable, and webhook limitation from Task 2.
- Produces: a complete manual cutover and rollback runbook without changing external state.

- [ ] **Step 1: Verify the required deployment guide is absent**

Run:

```powershell
Test-Path docs/deployment-ghcr-dokploy.md
```

Expected: `False`.

- [ ] **Step 2: Create `docs/deployment-ghcr-dokploy.md`**

Write the guide in Spanish with these exact sections and values:

```markdown
# Despliegue ARM64 con GitHub Actions, GHCR y Dokploy

## Arquitectura final
## Workflow y eventos
## Imagen, plataforma y etiquetas
## Configuración de GitHub y GHCR
## Credencial privada de solo lectura para Dokploy
## Configuración manual de Dokploy como Docker Image/Registry
## Primera activación segura
## Comprobación del despliegue
## Desactivar temporalmente el despliegue automático
## Rollback exacto a `sha-FULL_COMMIT_SHA`
## Volver de una etiqueta inmutable a `latest`
## Limitaciones y mantenimiento
```

The content must state:

- Workflow: `CI, GHCR and Dokploy`; file: `.github/workflows/ci-ghcr-dokploy.yml`.
- Registry URL: `ghcr.io`.
- Image: `ghcr.io/kevelmun/web-portfolio:latest`.
- Immutable form: `ghcr.io/kevelmun/web-portfolio:sha-FULL_COMMIT_SHA`.
- GitHub Actions publishing uses only the automatic `GITHUB_TOKEN`; it is not a configured secret.
- GitHub repository secret to create: `DOKPLOY_DEPLOY_WEBHOOK_URL`.
- Optional GitHub Actions variable: `DOKPLOY_AUTO_DEPLOY_ENABLED`; only the exact lowercase value `false` suppresses the webhook.
- Dokploy private pull credential: a separate classic GitHub token owned by an appropriately limited account, with only `read:packages`; Dokploy receives no write/delete/workflow permission.
- Public-package alternative: make the package public manually only if its contents are safe, then leave Dokploy registry credentials empty; the workflow must not change visibility.
- Dokploy source: Docker Image/Registry, registry `ghcr.io`, image `ghcr.io/kevelmun/web-portfolio:latest`, internal container port 80.
- First activation order: merge workflow, run/verify release, inspect GHCR ARM64 manifest/tag, configure Dokploy credential, switch the existing application source only after image validation, trigger one controlled deploy, verify routes, retain the old mechanism until acceptance.
- Verification: GitHub run is green; GHCR has `latest` and matching `sha-...`; Dokploy deployment log shows pull/restart without a build; `/` and `/workspace` return 200; a nonexistent hard-loaded route returns 404.
- Disable: set `DOKPLOY_AUTO_DEPLOY_ENABLED=false`; re-enable by deleting it or changing it away from exact `false`.
- Rollback: select a known successful workflow SHA, verify its `sha-...` package tag, change Dokploy image to that exact immutable tag, save/deploy, verify logs/routes, and keep the immutable tag selected until intentionally returning to `latest`.
- Webhook limitation: it only forces Dokploy to pull its configured tag and cannot select the new immutable tag dynamically.
- Service limitation: repository data identifies `Dockerfile.dokploy` as the current production build but does not contain the external Dokploy application name or ID; the operator must use the existing portfolio application that currently builds this Dockerfile.
- Base image/action pins need intentional periodic updates.

- [ ] **Step 3: Add a concise README link**

In the deployment section of `README.md`, add a short “GitHub Actions + GHCR + Dokploy (production)” subsection linking to `docs/deployment-ghcr-dokploy.md` and explaining that this is the production path that moves builds off the VM. Do not rewrite unrelated Caddy documentation.

- [ ] **Step 4: Verify documentation coverage**

Run:

```powershell
rg -n "DOKPLOY_DEPLOY_WEBHOOK_URL|DOKPLOY_AUTO_DEPLOY_ENABLED|read:packages|ghcr\.io/kevelmun/web-portfolio:latest|sha-FULL_COMMIT_SHA|Rollback|rollback|HTTP 404|Docker Image/Registry" docs/deployment-ghcr-dokploy.md
rg -n "deployment-ghcr-dokploy\.md" README.md
git diff --check
```

Expected: every operational value is found and the diff has no whitespace errors.

- [ ] **Step 5: Commit the operator guide**

```powershell
git add docs/deployment-ghcr-dokploy.md README.md
git commit -m "docs: add GHCR and Dokploy deployment runbook"
```

---

### Task 4: Execute end-to-end local verification and final review

**Files:**
- Verify: `.github/workflows/ci-ghcr-dokploy.yml`
- Verify: `Dockerfile.dokploy`
- Verify: `.dockerignore`
- Verify: `docs/deployment-ghcr-dokploy.md`
- Verify: repository diff against `main`

**Interfaces:**
- Consumes: all deliverables from Tasks 1–3 and the configured Docker development environment.
- Produces: fresh evidence for lint, type-check/build, ARM64 image construction, runtime routes, platform, contents, and final secret-free diff.

- [ ] **Step 1: Start or confirm the development container**

Run:

```powershell
docker compose up -d portfolio
docker compose ps
```

Expected: service `portfolio` is running; under the repository's Compose naming convention its container is `web-portfolio-portfolio-1`.

- [ ] **Step 2: Install exactly from the lockfile inside the container**

Run:

```powershell
docker exec web-portfolio-portfolio-1 corepack enable
docker exec web-portfolio-portfolio-1 pnpm install --frozen-lockfile
```

Expected: exit 0 without modifying `pnpm-lock.yaml`.

- [ ] **Step 3: Run every existing application validation inside the container**

Run:

```powershell
docker exec web-portfolio-portfolio-1 pnpm lint
docker exec web-portfolio-portfolio-1 pnpm build
```

Expected: both exit 0. Record explicitly that no automated test command exists.

- [ ] **Step 4: Build and load the production ARM64 image**

Run:

```powershell
docker buildx build --platform linux/arm64 --file Dockerfile.dokploy --tag web-portfolio:ci-arm64 --load .
docker image inspect web-portfolio:ci-arm64 --format '{{.Architecture}} {{.Os}}'
```

Expected: build exits 0 and inspect prints `arm64 linux`.

- [ ] **Step 5: Verify runtime contents exclude build and repository data**

Run:

```powershell
docker run --rm --platform linux/arm64 --entrypoint /bin/sh web-portfolio:ci-arm64 -c "test ! -e /app && test ! -e /usr/share/nginx/html/.git && test -f /usr/share/nginx/html/index.html"
```

Expected: exit 0. If the pinned slim image intentionally lacks `/bin/sh`, inspect the exported image filesystem instead and record that method.

- [ ] **Step 6: Start the test container and verify routing**

Run:

```powershell
docker run --detach --rm --platform linux/arm64 --name web-portfolio-ci-smoke --publish 18080:80 web-portfolio:ci-arm64
curl.exe --silent --show-error --output NUL --write-out "%{http_code}" http://127.0.0.1:18080/
curl.exe --silent --show-error --output NUL --write-out "%{http_code}" http://127.0.0.1:18080/workspace
curl.exe --silent --show-error --output NUL --write-out "%{http_code}" http://127.0.0.1:18080/route-that-does-not-exist
docker stop web-portfolio-ci-smoke
```

Expected HTTP status codes in order: `200`, `200`, `404`; `docker stop` removes the test container because it was started with `--rm`.

- [ ] **Step 7: Validate YAML and inspect the final change set**

Run:

```powershell
actionlint .github/workflows/ci-ghcr-dokploy.yml
git diff --check main...HEAD
git diff --stat main...HEAD
git diff --name-status main...HEAD
git diff main...HEAD
git status --short --branch
```

Expected: actionlint and diff checks exit 0; only pipeline, Docker, operator documentation, the approved design/plan, `.gitignore`, and accurate deployment references changed; working tree is clean.

- [ ] **Step 8: Perform the final security scan of tracked text**

Run:

```powershell
rg -n --hidden -g '!.git/**' -g '!pnpm-lock.yaml' "ghp_|github_pat_|DOKPLOY_DEPLOY_WEBHOOK_URL=https?://|x-api-key:|password: [^$]" .
```

Expected: no committed credential, webhook value, API key, or literal password is found. Legitimate documentation references to secret names or `${{ secrets.GITHUB_TOKEN }}` are not findings.

- [ ] **Step 9: Prepare the review handoff**

Report the audit, exact files changed, workflow behavior, command outputs, required secret, optional variable, manual GitHub/Dokploy configuration, rollback procedure, residual limitations, commit list, and complete diff against `main`. Do not push, merge, alter GHCR visibility, call the real Dokploy webhook, or remove the current Dokploy deployment mechanism.
