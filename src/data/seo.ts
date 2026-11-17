import { identity, publications } from './site';

export const canonical = new URL('/', identity.domain).href;
export const socialImage = new URL('/og.png', canonical).href;
export const socialImageAlt = 'Kevin Elihan Muñoz Calva · Co-Tech Lead y desarrollador Full Stack · Valencia, España';

export const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${canonical}#person`,
      name: identity.name,
      alternateName: ['Kevin Elihan Muñoz', 'Kevin Muñoz', 'Elihan Muñoz', 'Elihan', identity.handle],
      url: canonical,
      image: new URL('/images/retrato.webp', canonical).href,
      jobTitle: 'Co-Tech Lead y desarrollador Full Stack',
      description: identity.headline,
      address: { '@type': 'PostalAddress', addressLocality: 'Valencia', addressCountry: 'ES' },
      alumniOf: { '@type': 'CollegeOrUniversity', name: 'Escuela Superior Politécnica del Litoral (ESPOL)' },
      knowsAbout: ['Desarrollo de software', 'Desarrollo web', 'Microservicios', 'Arquitectura orientada a eventos', 'Modernización de sistemas legacy', 'Laravel', 'React', 'Visión por computador', 'Agentes de IA'],
      sameAs: [identity.github, identity.linkedin],
      subjectOf: publications.map((publication) => ({ '@id': `https://doi.org/${publication.doi}` })),
    },
    {
      '@type': 'WebSite',
      '@id': `${canonical}#website`,
      name: `Portafolio de ${identity.name}`,
      url: canonical,
      inLanguage: 'es',
      about: { '@id': `${canonical}#person` },
    },
    {
      '@type': 'ProfilePage',
      '@id': `${canonical}#profile`,
      url: canonical,
      name: identity.name,
      inLanguage: 'es',
      isPartOf: { '@id': `${canonical}#website` },
      mainEntity: { '@id': `${canonical}#person` },
    },
    ...publications.map((publication) => ({
      '@type': 'ScholarlyArticle',
      '@id': `https://doi.org/${publication.doi}`,
      url: `https://doi.org/${publication.doi}`,
      headline: publication.title,
      identifier: publication.doi,
      author: { '@id': `${canonical}#person` },
    })),
  ],
};
