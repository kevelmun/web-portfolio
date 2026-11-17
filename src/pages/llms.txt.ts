import { identity, nav, publications } from '../data/site';
import { canonical } from '../data/seo';

// Resumen opcional para herramientas que decidan leerlo. No sustituye HTML ni sitemap.
export function GET() {
  return new Response([
    `# ${identity.name}`,
    '',
    `> ${identity.headline} Base actual: ${identity.location}. ${identity.now}`,
    '',
    '## Secciones',
    ...nav.map((section) => `- [${section.label}](${canonical}#${section.id})`),
    '',
    '## Perfiles',
    `- [GitHub](${identity.github})`,
    `- [LinkedIn](${identity.linkedin})`,
    '',
    '## Publicaciones',
    ...publications.map((publication) => `- [${publication.title}](https://doi.org/${publication.doi})`),
    '',
  ].join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
