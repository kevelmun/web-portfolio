# Despliegue ARM64 con GitHub Actions, GHCR y Dokploy

Esta guía describe el corte manual hacia imágenes de contenedor ya construidas. No ejecuta cambios en GitHub, GHCR ni Dokploy por sí misma, y no incluye credenciales ni URL de webhook.

## Arquitectura final

El workflow valida el proyecto y construye la imagen de producción en runners hospedados por GitHub para `linux/arm64`. En una publicación de `main`, GHCR recibe primero una etiqueta inmutable de ese commit. Dokploy consume después la etiqueta móvil `latest`, descarga la imagen y la ejecuta en el puerto interno `80`; no compila código de la aplicación.

Las ejecuciones de publicación están serializadas en la cola `portfolio-production-release`, con `cancel-in-progress: false` y `queue: max` (máximo 100). Por ello, cada ejecución de release encolada conserva y publica su propia imagen `sha-...`; no se cancela porque haya llegado un commit más reciente. Solo una ejecución que comprueba que su SHA aún es la punta de `main` puede promover `latest` y solicitar el despliegue.

## Workflow y eventos

El workflow se llama `CI, GHCR and Dokploy` y está en [`.github/workflows/ci-ghcr-dokploy.yml`](../.github/workflows/ci-ghcr-dokploy.yml).

- Un `pull_request` dirigido a `main` valida con `pnpm install --frozen-lockfile`, `pnpm lint` y `pnpm build`, y construye la imagen ARM64 sin publicarla ni recibir secretos.
- Un `push` a `main` valida y puede publicar/desplegar.
- `workflow_dispatch` permite una ejecución manual, pero el release solo procede cuando la referencia es `refs/heads/main`.

No hay comando ni suite de pruebas automatizadas configurados en este repositorio. La validación existente es lint y build (este último incluye la comprobación estricta de TypeScript).

## Imagen, plataforma y etiquetas

El registry es `ghcr.io`; la imagen que consume producción es `ghcr.io/kevelmun/web-portfolio:latest`. Cada release publica primero la forma inmutable `ghcr.io/kevelmun/web-portfolio:sha-FULL_COMMIT_SHA`, donde `FULL_COMMIT_SHA` es el SHA completo del commit validado. La plataforma publicada es exclusivamente `linux/arm64`.

El workflow añade metadatos OCI: origen (`org.opencontainers.image.source`), revisión (`org.opencontainers.image.revision`) y la fecha estándar generada por `docker/metadata-action`. La caché de BuildKit usa GitHub Actions con el scope `portfolio-arm64`, tanto al leer como al escribir (`mode=max`).

## Configuración de GitHub y GHCR

1. Incorpore el workflow en `main` y confirme que los permisos del job de release son `contents: read` y `packages: write`.
2. Cree el secreto de repositorio `DOKPLOY_DEPLOY_WEBHOOK_URL` con la URL HTTPS del webhook de la aplicación existente en Dokploy. No lo guarde en el repositorio ni en una variable pública.
3. No cree un secreto para publicar en GHCR: GitHub Actions usa únicamente el `GITHUB_TOKEN` automático de cada job, con permiso `packages: write`; no es un secreto configurado por el operador. GitHub crea ese token para el job y su vigencia termina al finalizarlo. Consulte la documentación oficial de [GITHUB_TOKEN](https://docs.github.com/en/actions/concepts/security/github_token).
4. Opcionalmente, cree la variable de Actions `DOKPLOY_AUTO_DEPLOY_ENABLED`. Solo el valor exacto en minúsculas `false` suprime el POST al webhook; la publicación de `sha-FULL_COMMIT_SHA` y, si procede, la promoción de `latest` continúan.
5. Compruebe en GHCR que el paquete de contenedor pertenece a `kevelmun/web-portfolio` y que la cuenta que lo publique tiene acceso al paquete. La configuración de visibilidad no se modifica por el workflow.

## Credencial privada de solo lectura para Dokploy

Para una imagen privada, cree una credencial separada para Dokploy: un token clásico de GitHub, de una cuenta limitada adecuadamente, con solo el scope `read:packages` y acceso de lectura al paquete. Configure esa credencial en el registry de Dokploy; no reutilice el `GITHUB_TOKEN` de Actions.

No otorgue a Dokploy `write:packages`, `delete:packages`, permisos de escritura del repositorio ni permisos de workflow. GitHub documenta los scopes de paquetes y que `read:packages` permite descargar paquetes en [About permissions for GitHub Packages](https://docs.github.com/en/packages/learn-github-packages/about-permissions-for-github-packages).

Como alternativa, el paquete puede hacerse público manualmente únicamente si su contenido es seguro para ser público. En ese caso, deje vacías las credenciales de registry en Dokploy. El workflow no debe cambiar la visibilidad; los paquetes públicos del Container registry pueden descargarse anónimamente, según la [documentación de permisos de GitHub Packages](https://docs.github.com/en/packages/learn-github-packages/about-permissions-for-github-packages).

## Configuración manual de Dokploy como Docker Image/Registry

En la aplicación de portfolio existente en Dokploy, seleccione la fuente **Docker Image/Registry** y configure:

| Campo | Valor |
| --- | --- |
| Registry URL | `ghcr.io` |
| Imagen y etiqueta | `ghcr.io/kevelmun/web-portfolio:latest` |
| Puerto interno del contenedor | `80` |
| Build | Desactivado: Dokploy debe hacer pull y arrancar, sin build |

Use la credencial de solo lectura anterior si el paquete es privado. El repositorio no identifica el nombre ni el ID externos del servicio Dokploy: use la aplicación existente del portfolio que actualmente construye `Dockerfile.dokploy`.

## Primera activación segura

1. Haga merge del workflow en `main`.
2. Ejecute o espere un release y compruebe que finaliza en verde.
3. Inspeccione en GHCR el manifest ARM64 y las etiquetas `latest` y `sha-FULL_COMMIT_SHA` correspondientes al mismo release.
4. Configure en Dokploy la credencial de solo lectura, si la imagen es privada.
5. Solo después de validar la imagen, cambie la fuente de la aplicación existente a Docker Image/Registry con la configuración anterior.
6. Active un único despliegue controlado y compruebe logs y rutas.
7. Conserve el mecanismo de despliegue actual hasta que la aceptación esté completa; no lo retire durante esta validación.

## Comprobación del despliegue

Después de un release, confirme lo siguiente:

- El run de GitHub Actions está en verde y su release publicó una etiqueta `sha-...` y `latest` que apuntan a la imagen esperada.
- GHCR muestra un manifest `linux/arm64` para esas etiquetas.
- El log de Dokploy muestra pull y reinicio, sin etapa de build.
- Las cargas HTTP de `/` y `/workspace` devuelven `200`.
- Una carga dura de una ruta inexistente devuelve HTTP `404` real (por ejemplo, `/route-that-does-not-exist`), no un fallback `200`.

## Desactivar temporalmente el despliegue automático

Defina la variable de Actions `DOKPLOY_AUTO_DEPLOY_ENABLED=false`. Con ese valor exacto se omite el webhook y el release aún publica la imagen. Para reactivarlo, elimine la variable o cámbiela a cualquier valor distinto de `false`.

## Rollback exacto a `sha-FULL_COMMIT_SHA`

1. Seleccione el SHA completo de un workflow que se haya desplegado correctamente.
2. Verifique en GHCR que existe `ghcr.io/kevelmun/web-portfolio:sha-FULL_COMMIT_SHA` para ese SHA.
3. En Dokploy, cambie la imagen configurada a esa etiqueta inmutable exacta, guarde y despliegue.
4. Confirme en el log el pull/reinicio sin build y vuelva a verificar `/`, `/workspace` y el HTTP `404` de una ruta inexistente.
5. Mantenga la etiqueta inmutable seleccionada hasta decidir explícitamente volver a `latest`.

## Volver de una etiqueta inmutable a `latest`

Tras aceptar una nueva release, configure de nuevo `ghcr.io/kevelmun/web-portfolio:latest` en Dokploy, guarde y despliegue de forma controlada. Verifique que `latest` y la etiqueta `sha-FULL_COMMIT_SHA` que pretende servir apuntan a la misma release antes de solicitar el despliegue.

## Limitaciones y mantenimiento

`latest` no es una transacción compartida con la referencia Git de GitHub ni con el webhook de Dokploy. El workflow hace una lectura de `main` antes de promocionar, otra después, y una lectura final inmediatamente antes del POST. Si observa una carrera normal tras promover `latest`, restaura el `latest` previo y omite Dokploy. Si la carrera ocurre en el bootstrap sin un `latest` previo, falla sin webhook porque no hay una etiqueta anterior que restaurar.

Estas comprobaciones reducen carreras observables, pero no proporcionan atomicidad absoluta entre la referencia GitHub, la etiqueta GHCR y el webhook: `main` puede cambiar después de la lectura final y antes de que Dokploy reciba el POST. El webhook solo fuerza a Dokploy a hacer pull de la etiqueta que ya tiene configurada; no puede seleccionar dinámicamente la nueva etiqueta inmutable.

El POST usa reintentos, por lo que un fallo de red con resultado incierto puede producir solicitudes duplicadas; el operador debe revisar los logs de Dokploy antes de repetir una intervención manual. Las respuestas HTTP 3xx no se consideran una confirmación de éxito del webhook con la opción `--fail-with-body`; use una URL final HTTPS que responda satisfactoriamente. Revise periódicamente y actualice de forma intencional los pines de imágenes base y acciones, validando el workflow y la imagen antes de adoptar cada actualización.
