# Portafolio de Elihan

Portafolio de **Kevin Elihan Muñoz Calva** en [kevelmun.dev](https://kevelmun.dev/). El HTML contiene el perfil, experiencia, proyectos, publicaciones y referencias sin depender de JavaScript.

## Desarrollo con pnpm y Docker

Requisitos: Docker Desktop en ejecución. La imagen fija Node 22.23.4 y el proyecto fija pnpm 10.23.0.

```sh
docker compose up --build
```

Abrir [localhost:5173](http://localhost:5173). El código se monta para recarga automática.

```sh
docker compose exec portfolio pnpm lint
docker compose exec portfolio pnpm build
docker compose exec portfolio pnpm test
```

Sin Docker, usar Node compatible, `corepack enable`, `pnpm install --frozen-lockfile` y los mismos comandos pnpm. No generar un lockfile de npm.

## Probar la imagen de producción

```sh
docker compose -f docker-compose.prod.yml up --build -d
```

Abrir [localhost:8080](http://localhost:8080). Si está activo el contenedor de desarrollo:

```sh
docker compose exec portfolio pnpm test:http http://host.docker.internal:8080
```

La construcción de la imagen ejecuta tipos, build y pruebas SEO. Nginx sirve en el puerto interno 80; Dokploy mantiene la terminación HTTPS.

## Editar el contenido

- Perfil, trayectoria, proyectos y referencias: `src/data/site.ts`.
- Datos estructurados y canonical: `src/data/seo.ts`.
- Layout y metadatos: `src/layouts/Base.astro`.
- Tokens y estilos: `src/styles/`.
- Captura de Sotita: `src/assets/sotita.png`, optimizada por Astro.
- Imagen social de 1200 × 630: `public/og.png`.
- Sitemap: `public/sitemap.xml`; modificar `lastmod` solo ante cambios significativos.
- El PDF heredado sigue accesible en `/cv-kevin-munoz.pdf`. Revisar su vigencia antes de promocionarlo de nuevo.

## Despliegue e indexación

La aplicación existente puede seguir desplegando el repositorio `web-portfolio`, rama `main`, con `Dockerfile.dokploy` y puerto 80. No se requiere cambiar dominio, DNS ni propiedad de Search Console por el cambio de framework.
