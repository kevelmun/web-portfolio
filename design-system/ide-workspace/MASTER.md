# Design System Master File

> **Scope:** Esta carpeta gobierna exclusivamente la experiencia `IdeWorkspace`.
> No reemplaza `design-system/portfolio-design`; ambos sistemas comparten contenido, no piel visual.

---

**Project:** ide-workspace
**Generated:** 2026-03-05
**Category:** Portfolio / IDE Workspace

## Global Rules

### Visual Direction

- Inspiración: IDE literal, con menú superior, activity bar, explorer, tabs, breadcrumb, editor y terminal inferior
- Base estética: superficies planas, bordes sutiles, cero cards flotantes o paneles redondeados tipo dashboard
- Interacción: hover states visibles, transiciones 150-300ms, foco claro, `cursor-pointer` en controles
- Tipografía: `Archivo` para labels de interfaz y `Fira Code` para editor/terminal

### Color Palette

| Role | Dark Theme | Light Theme |
|------|------------|-------------|
| Workspace Background | `#181825` | `#eff1f5` |
| Top Bar | `#11111b` | `#eff1f5` |
| Activity / Explorer | `#11111b` | `#e6e9ef` |
| Tabs Surface | `#1e1e2e` | `#dce0e8` |
| Active Tab / Panels | `#1e1e2e` | `#ffffff` |
| Editor Surface | `#181825` | `#ffffff` |
| Active Accent | `#89dceb` | `#04a5e5` |
| Secondary Accent | `#cba6f7` | `#8839ef` |
| Main Text | `#cdd6f4` | `#4c4f69` |
| Muted Text | `#a6adc8` | `#6c6f85` |
| Borders | `#313244` | `#bcc0cc` |

### Layout Rules

- Estructura mínima: top bar + activity rail + explorer + tabs + editor + terminal + status bar
- En desktop la terminal va acoplada abajo del editor
- En mobile explorer y terminal se convierten en overlays / paneles desplegables
- El editor siempre es la superficie principal de lectura
- Evitar inspector lateral o métricas tipo dashboard si rompen la ilusión de IDE real

### Content Rules

- `IdeWorkspace` no inventa contenido paralelo: debe renderizar la misma data de `src/components/portfolio/data.ts`
- Los documentos representan secciones del portfolio como archivos navegables
- El unlock del proyecto bonus por Konami debe reflejarse en el documento de proyectos

### Avoid

- Cards tipo SaaS/dashboard dentro del workspace
- Decoración innecesaria que rompa la sensación de aplicación de escritorio
- Ocultar acciones principales de tema, retorno al portfolio o terminal
