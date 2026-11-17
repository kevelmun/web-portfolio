# Sistema visual Elihan

La versión activa usa Astro. Las fuentes de verdad son `src/styles/tokens.css` y `src/styles/global.css`, importadas por `src/layouts/Base.astro`.

- Temas: `night` y `parchment` en `html[data-theme]`.
- Tipografía: Cormorant Garamond para títulos, Geist para cuerpo y Geist Mono para metadatos. Se sirve desde paquetes locales.
- Superficies: `--bg-canvas`, `--bg-surface`, `--bg-raised`, `--bg-sunken`.
- Texto: `--text-primary`, `--text-secondary`, `--text-muted`.
- Color y foco: `--brand`, `--gold`, `--link`, `--focus-ring`.
- Usar la escala `--space-*`, `--radius-*` y los tokens de duración.
- Conservar navegación por teclado, foco visible, lectura sin JavaScript y movimiento reducido.
- Reutilizar componentes Astro; no reintroducir las dependencias React/Tailwind de la versión anterior.

La documentación `design-system/ide-workspace/MASTER.md` describe una vista histórica retirada; no gobierna el sitio actual.
