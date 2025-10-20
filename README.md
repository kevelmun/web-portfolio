# Web Portfolio – React + Vite + Tailwind

Personal portfolio built with React 18, Vite, TypeScript, Tailwind CSS, and a small local set of shadcn/ui-style components. It includes animations (Framer Motion), charts (Recharts), and a themed UI with light/dark mode.

This README covers local development, Docker usage, scripts, customization points (photo/CV), and deployment tips.

## Tech stack

- React 18 + TypeScript 5
- Vite 4 (dev server and build)
- Tailwind CSS 3 (+ tailwindcss-animate)
- Local UI components inspired by shadcn/ui (in `src/components/ui`)
- Framer Motion (animations)
- Recharts (radar chart in Skills section)
- lucide-react (icons)

## Prerequisites

- Node.js 18+ (Dockerfile uses `node:18-alpine`)
- npm 9+ (comes with Node 18)

Optional:

- Docker and Docker Compose (for containerized dev)

## Getting started (local)

1) Install dependencies

```bash
npm install
```

2) Start the dev server (Vite on port 5173)

```bash
npm run dev
```

3) Open the app

- http://localhost:5173

Build for production and locally preview the build:

```bash
npm run build
npm run preview
```

## Getting started (Docker)

This repository includes a dev-focused Dockerfile and a `docker-compose.yml` that mounts the source for instant reload in the container.

Run with Docker Compose:

```bash
docker compose up --build
```

Then open http://localhost:5173

Notes:

- Live reload works thanks to the project folder bind mount (`.:/app`).
- The container runs `npm run dev -- --host 0.0.0.0` to be reachable from your host.

## Available scripts

Defined in `package.json`:

- `npm run dev` – Start Vite dev server.
- `npm run build` – Type-check and build to `dist/`.
- `npm run preview` – Preview the production build locally.
- `npm run lint` – Lint with ESLint (requires your ESLint config if you plan to customize rules).

## Project structure

Key files and folders:

- `src/` – Application source
	- `App.tsx` and `main.tsx` – App entry
	- `components/` – UI and feature components
		- `ui/` – Local shadcn/ui-style primitives (Button, Card, Tabs, etc.)
		- `InteractiveTerminal.tsx` – Animated “terminal” used in the hero
		- `Portfolio.tsx` – Main page sections (hero, projects, skills, contact, etc.)
- `index.html` – Vite HTML entry
- `index.css` – Tailwind tokens, dark theme, and small animations
- `public/` – Static assets served at site root
- `vite.config.ts` – Vite config, including `@` alias to `src`
- `tailwind.config.js` – Tailwind setup + animate plugin
- `Dockerfile`, `docker-compose.yml` – Dev container config

Path alias:

- `@` → `./src` (e.g., `import { Button } from "@/components/ui/button"`)

## Customization

Update the following assets and content to personalize:

- Profile photo: `public/images/Me.PNG` (used in `Portfolio.tsx`). Replace with your image or adjust the path in code.
- CV download: place your file at `public/cv-kevin-munoz.pdf`, or update the link in `Portfolio.tsx` (section “CV”).
- Social links, contact info, projects, and experience: edit values in `src/components/Portfolio.tsx`.
- Colors and theme: tweak CSS variables in `src/index.css` and Tailwind theme tokens in `tailwind.config.js`.

## Environment variables

No environment variables are required for local development by default. If you introduce API keys or endpoints later, create a `.env` file (git-ignored) and reference variables using `import.meta.env` (Vite convention). Example:

```bash
VITE_API_BASE_URL=https://api.example.com
```

Use in code: `import.meta.env.VITE_API_BASE_URL`.

## Deployment

This is a static site once built (`dist/`). You can deploy to any static host:

- Vercel / Netlify: point to `npm run build` and serve `dist/`.
- GitHub Pages: build locally or in CI and publish `dist/`.
- Any static server: copy `dist/` to your server.

If you need a production container image, consider a multi-stage Docker build that serves `dist/` with a minimal web server (e.g., `nginx:alpine`). The included Dockerfile is tailored to development.

## Troubleshooting

- Port already in use (5173): stop other dev servers or set a different port `npm run dev -- --port 5174`.
- Node version: use Node 18+ for compatibility with the provided Dockerfile and tooling.
- Styles not applied: ensure Tailwind content globs include your file paths (already configured for `src/**`).
- Images or CV not found: verify files under `public/` and referenced paths in components.

## License

MIT. See the `LICENSE` file for details.
