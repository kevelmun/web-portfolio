# Contexto del proyecto

Portafolio de Kevin Elihan Muñoz Calva. Desde noviembre de 2026 usa **Astro estático**, TypeScript y pnpm.

## Entorno y comandos

- Node **22.23.4** o superior compatible con Astro; Docker usa `node:22.23.4-alpine3.24`.
- pnpm **10.23.0**, fijado en `package.json`. Mantener únicamente `pnpm-lock.yaml`.
- Entorno de desarrollo: `docker compose up --build`, puerto 5173.
- Ejecutar comandos del proyecto dentro del contenedor: `docker compose exec portfolio pnpm lint`, `pnpm build`, `pnpm test`.
- `pnpm lint` ejecuta `astro check`; `pnpm test` necesita un build previo y comprueba HTML/SEO. `pnpm test:http http://HOST:PORT` verifica un servidor Nginx de producción accesible.

## Estructura

- `src/data/site.ts`: contenido, identidad y perfiles.
- `src/data/seo.ts`: canonical, imagen social y grafo Person/WebSite/ProfilePage/ScholarlyArticle.
- `src/layouts/Base.astro`: metadatos, fuentes locales, navegación y tema.
- `src/pages/index.astro`: página principal; `llms.txt.ts`: resumen opcional generado.
- `src/styles/tokens.css` y `global.css`: sistema visual Elihan, temas `night` y `parchment`.
- `src/assets/sotita.png`: original optimizado a WebP por Astro durante el build.
- `public/`: recursos con URL estable, robots, sitemap, imagen social y páginas 404/410.

## Diseño y contenido

Usar tokens CSS semánticos y componentes Astro existentes; no añadir React/Tailwind para componentes estáticos. Fuentes: Cormorant Garamond, Geist y Geist Mono, servidas localmente. Preferencia de tema en `localStorage['eh-theme']`.

No inventar empleos, métricas, titulaciones, perfiles ni testimonios. Los datos estructurados deben coincidir con el texto visible. No publicar el teléfono personal heredado.

Las referencias se renderizan una vez; el cliente clona las tarjetas solo para la animación. Mantener lectura sin JavaScript y con movimiento reducido.

Las funciones que no sean Baseline ampliamente disponible llevan detección de soporte y respaldo, como el scrollspy de `Base.astro`. El tema Noche por defecto es decisión de marca; el sitio no sigue `prefers-color-scheme`.

## URLs y despliegue

- Canonical: `https://kevelmun.dev/`. Conservar dominio y rutas de los recursos públicos heredados.
- `/workspace` y `/workspace/`: HTTP 410, sin sustitución equivalente.
- Rutas desconocidas: HTTP 404 real; nunca fallback SPA con 200.
- `www`: redirección 301 al dominio raíz, con la misma ruta y consulta.
- Producción Dokploy: `Dockerfile.dokploy`, Nginx en puerto interno **80**. HTTPS termina en el proxy.

- No cambiar políticas de Cloudflare, publicar, hacer commit o push sin que el usuario lo solicite.

## Verificación

Comprobar tipos, build, pruebas de HTML/SEO y respuestas HTTP de la imagen. Revisar móvil/escritorio, navegación, tema, retrato, carrusel y ausencia de JavaScript cuando se modifique la presentación.

Actualizar `lastmod` del sitemap solo cuando cambie de forma significativa el contenido publicado, no en cada build. Conservar archivos o metas de verificación de buscadores si se incorporan en el futuro.
