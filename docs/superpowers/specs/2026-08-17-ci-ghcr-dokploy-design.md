# CI, GHCR and Dokploy Delivery Design

## Objective

Move production image compilation off the Oracle Cloud ARM64 VM. GitHub Actions will validate the application, build a native `linux/arm64` container image, publish it to GitHub Container Registry (GHCR), and trigger Dokploy only after publication succeeds.

The application behavior, routes, Nginx configuration, and runtime configuration remain unchanged.

## Repository Findings

- The application is a Vite 6, React 18, and strict TypeScript single-page application.
- pnpm 10.23.0 is pinned through `packageManager`; `pnpm-lock.yaml` uses lockfile format 9.
- The supported repository commands are `pnpm lint` and `pnpm build`. The build command runs `tsc` before `vite build`, so it is also the existing type-check command.
- No automated test command, test runner, or test files exist. The pipeline will report this absence rather than introducing unrelated test infrastructure.
- Development uses the Compose service `portfolio`. The legacy production Compose file uses service `web`, but AGENTS.md identifies `Dockerfile.dokploy` as the current Dokploy production build definition.
- No Dokploy application identifier, externally configured service name, or API credentials are stored in the repository. The exact Dokploy application must therefore be selected manually when its webhook secret is configured.
- The application contains no `import.meta.env`, `process.env`, or required build/runtime variables. It builds to static files served by Nginx.
- `.github` is currently ignored and must be removed from `.gitignore` so the workflow can be committed.
- Docker is not running in the local environment, so container verification will require starting the local Docker engine or will remain explicitly unverified locally.

## Workflow Architecture

Create `.github/workflows/ci-ghcr-dokploy.yml` with these triggers:

- Pull requests targeting `main`: validate and build a non-published ARM64 image.
- Pushes to `main`: validate, publish, and deploy.
- `workflow_dispatch`: validate any selected ref, but publish and deploy only when the selected ref is `main`.

All jobs use the GitHub-hosted native ARM64 label `ubuntu-24.04-arm`. No self-hosted production runner is involved.

### Validate Job

The validation job has only `contents: read` and a reasonable timeout. It:

1. Checks out the triggering revision without retaining credentials.
2. Installs a supported, fixed Node.js 22 LTS release.
3. Enables the pnpm version pinned in `package.json` through Corepack.
4. Runs `pnpm install --frozen-lockfile`.
5. Runs `pnpm lint`.
6. Runs `pnpm build`, which performs strict TypeScript checking and the Vite production build.
7. Uploads `dist/` as a short-lived diagnostic artifact.

There is no test step because the repository has no test command or test suite.

### Pull Request Image Check

After validation, pull requests build `Dockerfile.dokploy` explicitly for `linux/arm64` with BuildKit and the GitHub Actions cache. The image is not loaded, published, or made available to Dokploy. No deployment secret or package write permission is exposed.

### Release Job

After validation, a push to `main` or a manual run whose ref is `main` executes a release job with `contents: read` and `packages: write`. It:

1. Checks out the exact validated commit.
2. Normalizes the repository-derived `ghcr.io/owner/repository` image path to lowercase.
3. Authenticates to GHCR as `${{ github.actor }}` using `${{ secrets.GITHUB_TOKEN }}`.
4. Generates OCI metadata and two tags:
   - `sha-${{ github.sha }}` as the immutable rollback tag.
   - `latest` for the main branch consumed by Dokploy.
5. Builds and pushes only `linux/arm64`, using the GitHub Actions BuildKit cache.
6. Calls the Dokploy deployment webhook only after the push step succeeds.

The release job uses a fixed concurrency group with `cancel-in-progress: false`. This serializes the full publish-and-webhook sequence and prevents a later commit from changing `latest` while an earlier release is being deployed.

The webhook URL is provided only through the job environment from `${{ secrets.DOKPLOY_DEPLOY_WEBHOOK_URL }}`. The request uses a POST, fails on non-2xx responses, applies connection and total timeouts, retries a limited number of transient failures, suppresses the response body, and never enables shell tracing.

Automatic webhook invocation is enabled by default and may be temporarily disabled by setting the repository variable `DOKPLOY_AUTO_DEPLOY_ENABLED` to `false`. Image publication continues while deployment is disabled.

## Docker Image

Update only `Dockerfile.dokploy`, the production file identified by repository instructions. Keep a two-stage build:

- A version-pinned official Node.js 22 LTS Alpine image installs the lockfile-resolved dependencies and runs the existing `pnpm build` command.
- A version-pinned official Nginx Alpine image contains only Nginx, `ops/nginx/default.conf`, and `dist/`.

Both official image families support `linux/arm64`. Node.js 20 will be replaced because it is end-of-life. Build context copies will be explicit where practical, and `.dockerignore` will exclude development, documentation, Git, CI, environment, log, cache, and build-output files. No secret is accepted as a Docker `ARG` or persisted as an `ENV`.

The runtime continues to listen on port 80 and uses the current Nginx configuration, including real HTTP 404 responses for unknown hard-loaded routes.

## Dokploy Integration and Rollback

The repository contains no API integration capable of modifying the Dokploy image tag. The approved integration therefore uses the application deployment webhook and configures Dokploy to pull:

`ghcr.io/kevelmun/web-portfolio:latest`

For a private package, Dokploy receives a separate GitHub credential with only `read:packages`; it never receives `GITHUB_TOKEN` or write permission.

Every successful release also preserves a tag in the form `ghcr.io/kevelmun/web-portfolio:sha-FULL_COMMIT_SHA`. To roll back, the operator changes the Dokploy Docker Image field from `:latest` to the selected immutable `:sha-FULL_COMMIT_SHA` tag, saves, deploys, verifies the deployment and routes, and leaves that immutable tag selected until deliberately returning to `:latest`.

The current Git-based Dokploy build mechanism will not be removed or altered by repository automation. Switching Dokploy to Registry/Docker Image remains a manual, reversible production operation after the published image is validated.

## Security and Reliability

- All third-party actions are pinned to full commit SHAs with comments naming their release versions.
- Workflow and job permissions follow least privilege; only the release job can write packages.
- No `pull_request_target`, self-hosted runner, PAT publication credential, secret build argument, or external-PR deployment is used.
- Jobs have timeouts, immutable tags provide rollback, GitHub retains workflow logs and build summaries, and `dist/` is retained briefly for diagnostics.
- Base image versions are fixed and documented so Renovate or Dependabot can update them intentionally later.
- The workflow does not modify Dokploy, GHCR visibility, repository settings, or external infrastructure automatically.

## Verification Plan

Before completion:

1. Validate workflow YAML syntax and run a GitHub Actions-specific linter if available.
2. Run `pnpm install --frozen-lockfile`, `pnpm lint`, and `pnpm build` inside the configured development container.
3. Build `Dockerfile.dokploy` for `linux/arm64` with Buildx.
4. Inspect the produced image platform and contents.
5. Start the image, verify `/` and `/workspace` return 200, verify an unknown route returns a real 404, and stop the test container.
6. Review the final diff for secrets, unintended application changes, workflow permission scope, trigger conditions, immutable tags, and webhook ordering.

If Docker remains unavailable locally, the missing image build/runtime evidence will be reported as a limitation rather than represented as completed.
