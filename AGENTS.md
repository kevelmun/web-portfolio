# Agent Context and Rules

## Environment
- We are working inside a Docker container.
- Ensure that commands, network ports, and file paths reflect a containerized development environment.
- Use the provided terminals when necessary to interact with the container.

## Command Execution
- For any command execution, use: `docker exec -it <container name> <command>`
- Always prefix commands with the appropriate Docker execution syntax.
- Replace `<container name>` with the actual container name (e.g., `web-portfolio`, `app`, etc.).

## Design System Target
When redesigning or adding new components, always follow the `portfolio-design` system:

**Theme:**
- Background: `#0F172A`
- Primary: `#1E293B`
- Secondary: `#334155`
- CTA (Green): `#22C55E`
- Text: `#F8FAFC`

**Typography:**
- Fonts: `Archivo` and `Space Grotesk`

**Style:**
- Vibrant, block-based, geometric shapes, high color contrast, modern, energetic.
- Avoid flat design without depth.
- Prefer hover state interactions, smooth transitions (150-300ms).
- Always use `cursor-pointer` for interactable elements.
- Use Lucide icons instead of emojis.
