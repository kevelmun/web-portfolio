# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** portfolio-design
**Generated:** 2026-03-04 21:51:29
**Category:** Developer Tool / IDE

---

## Global Rules

### Color Palette

| Role | Dark Theme | Light Theme | CSS Variable |
|------|------------|-------------|--------------|
| Primary | `#cba6f7` | `#8839ef` | `--color-primary` |
| Secondary | `#585b70` | `#ccd0da` | `--color-secondary` |
| Accent | `#89dceb` | `#04a5e5` | `--color-accent` |
| Background | `#181825` | `#eff1f5` | `--color-background` |
| Card | `#1e1e2e` | `#ffffff` | `--color-card` |
| Border | `#313244` | `#bcc0cc` | `--color-border` |
| Muted | `#292c3c` | `#dce0e8` | `--color-muted` |
| Foreground | `#cdd6f4` | `#4c4f69` | `--color-foreground` |
| Ring | `#cba6f7` | `#8839ef` | `--color-ring` |
| Destructive | `#f38ba8` | `#d20f39` | `--color-destructive` |

**Color Notes:** Theme tokens are now dual-mode by default (`:root` light, `.dark` dark). Prefer semantic tokens (`background`, `card`, `foreground`, `muted`, `border`, `primary`, `accent`) over hardcoded hex in components.
