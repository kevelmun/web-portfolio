/**
 * Todo el contenido del portafolio vive aquí.
 * Fuente: contexto-portafolio-kevin.md (bóveda del CV, nov. 2026).
 *
 * Regla: nada inventado. Lo que falta se declara en `pending` y se pinta
 * como un hueco visible. Cuando no quede ninguno, pon SHOW_PENDING en false
 * (o bórralos) antes de publicar.
 */
export const SHOW_PENDING = false;

export const identity = {
  name: 'Kevin Elihan Muñoz Calva',
  short: 'Elihan',
  handle: 'kevelmun',
  location: 'Valencia, España',
  availability: 'Jornada parcial, hasta 30 h semanales',
  domain: 'https://kevelmun.dev',
  email: '3lihan.m.c@gmail.com',
  github: 'https://github.com/kevelmun',
  linkedin: 'https://www.linkedin.com/in/kevelmun',
  headline:
    'Co-Tech Lead y desarrollador Full Stack: arquitectura de microservicios, modernización de sistemas legacy e IA aplicada al desarrollo.',
  now: 'Ahora estudio un máster en dirección y gestión de proyectos.',
};

export const about = {
  // Borrador del contexto, sin nombrar la universidad.
  text: '¡Hola! Soy Elihan. Empecé programando un poco de todo: webs, apps, un videojuego en realidad virtual y hasta cámaras que ven en 3D. Con el tiempo pasé de escribir código a decidir cómo se construye y a acompañar al equipo que lo hace. Hoy sigo ese camino en Valencia, estudiando dirección de proyectos, y trabajo a diario con agentes de IA. Si sigues bajando, te cuento cómo fue cada etapa.',
  path: [
    'Programar de todo: web, móvil, VR y datos',
    'Investigar en visión por computador',
    'Consolidarme como Full Stack',
    'Liderar técnicamente al equipo',
    'Formalizar el salto a la gestión de proyectos',
  ],
  sheet: [
    { k: 'Rol', v: 'Co-Tech Lead · Full Stack' },
    { k: 'Base', v: 'Valencia, España' },
    { k: 'Idiomas', v: 'Español nativo · Inglés B2 (lectura y escucha C1)' },
    { k: 'Disponible', v: 'Hasta 30 h semanales' },
    { k: 'En curso', v: 'Máster en Dirección y Gestión de Proyectos' },
  ],
};

export interface Role {
  title: string;
  dates: string;
  stack?: string[];
  bullets: string[];
  pending?: string[];
}
export interface Job {
  org: string;
  orgNote?: string;
  place?: string;
  roles: Role[];
}

// Cada viñeta sigue el mismo orden: qué hice → cómo lo hice → qué valor creó.
// Las tecnologías van en los chips, no en el texto.
export const experience: Job[] = [
  {
    org: 'FUNIBER',
    orgNote: 'Red internacional de formación universitaria',
    roles: [
      {
        title: 'Co-Technical Lead',
        dates: 'feb. 2026 – ago. 2026',
        stack: ['Laravel', 'PHP', 'Node.js', 'React', 'Vue', 'MySQL', 'PostgreSQL', 'RabbitMQ', 'Drupal', 'Astro', 'ZITADEL', 'EventCatalog', 'Agentes de IA'],
        bullets: [
          'Lideré la modernización de sistemas legacy hacia microservicios y comunicación por eventos, lo que mejoró la escalabilidad y la integración entre plataformas y redujo las caídas del servicio ante la alta demanda.',
          'Definí estándares de trabajo, revisé código y acompañé al equipo, para mantener la calidad de las entregas más allá de los requisitos mínimos.',
          'Coordiné la documentación técnica con DDD y un catálogo de eventos, de modo que recuperar el contexto y reactivar proyectos pausados fuera más rápido.',
        ],
      },
      {
        title: 'Desarrollador de Software Full Stack',
        dates: 'ene. 2025 – feb. 2026',
        stack: ['Laravel', 'PHP', 'Node.js', 'NestJS', 'React', 'Vue', 'MUI', 'MySQL', 'PostgreSQL', 'RabbitMQ', 'Laravel Reverb'],
        bullets: [
          'Participé en la planificación y ejecución de arquitecturas modernas (microservicios, mensajería asíncrona y tiempo real), lo que mejoró la seguridad y redujo los costes de incorporar nuevos usuarios.',
          'Monté reportes automatizados y migraciones de bases de datos, con lo que bajó el tiempo dedicado a los reportes recurrentes.',
          'Estimé y planifiqué proyectos transversales con otros equipos: alcance, esfuerzo técnico, dependencias, tiempos y recursos.',
        ],
      },
    ],
  },
  {
    org: 'CiDIS',
    orgNote: 'Centro de investigación · ESPOL',
    roles: [
      {
        title: 'Técnico Investigador en Visión por Computadora',
        dates: 'oct. 2024 – may. 2025',
        stack: ['Python', 'PyTorch', 'OpenCV', 'Open3D', 'Scikit-image', 'NumPy', 'YOLO'],
        bullets: [
          'Lideré la generación de datasets multidimensionales, estandarizando procesos y formando a quienes participaban, para mantener la calidad de los entregables.',
          'Desarrollé una plataforma de visión estéreo que reúne los módulos del centro en un solo lugar y resolvió su problema de organización.',
          'Comparé técnicas clásicas y de machine learning para reconstrucción 3D; el trabajo está recogido en las publicaciones de más abajo.',
        ],
      },
    ],
  },
  {
    org: 'Bosque Protector La Prosperina',
    orgNote: 'Voluntariado · ESPOL',
    roles: [
      {
        title: 'Desarrollo de videojuego VR',
        dates: 'jun. 2023 – sept. 2023',
        stack: ['Unity', 'Meta Quest 2'],
        bullets: [
          'Desarrollé los objetos interactivos y los NPCs del tutorial principal de «Bosque Virtual La Prosperina», un juego VR sobre el bosque protector, y documenté las nuevas funciones.',
        ],
      },
    ],
  },
  {
    org: 'Hangaroa S.A.',
    roles: [
      {
        title: 'Desarrollador Web y Móvil (Prácticas)',
        dates: 'sept. 2022 – ene. 2023',
        stack: ['Scrum', 'Pivotal Tracker', 'Mockups'],
        bullets: [
          'Hice de Scrum Master del equipo: coordiné las reuniones, seguí los avances y avisé a tiempo de bloqueos y retrasos, hasta llegar al primer release.',
          'Mantuve el seguimiento con el cliente desde los primeros prototipos hasta los entregables finales, para asegurar su satisfacción.',
          'Diseñé los mockups y desarrollé frontend y backend de la app móvil y de las webs de usuario y de administración de una conocida radio.',
        ],
      },
    ],
  },
];

export interface Project {
  name: string;
  kind: string;
  when: string;
  text: string;
  tags?: string[];
  link?: { label: string; href: string };
  pending?: string[];
  featured?: boolean;
}

export const projects: Project[] = [
  {
    name: 'Sotita',
    kind: 'Proyecto propio',
    when: '2026 – actualidad',
    text: 'App gratuita de finanzas personales para jóvenes y profesionales. Reúne gastos, ingresos y facturas recurrentes en una línea temporal, con dashboard de saldo, transacciones y flujo de caja. Beta cerrada en mayo de 2026 y beta abierta en agosto de 2026; anunciada para Google Play y App Store. Me encargo del desarrollo de la app en Flutter y de toda la infraestructura.',
    tags: ['Flutter', 'Supabase', 'Cloudflare Workers', 'Oracle Cloud', 'Dokploy', 'OpenRouter API', 'CI/CD en GitHub', 'Astro (web)', 'Sentry'],
    link: { label: 'sotita.com', href: 'https://sotita.com' },
    featured: true,
  },
  {
    name: 'Ciudad de las Artes y las Ciencias en 3D',
    kind: 'Trabajo en grupo',
    when: 'nov. 2026',
    text: 'Cubrí los estudios iniciales y la evolución de los presupuestos, y construí una maqueta 3D interactiva de 1957 a 2022, con un comparador de costes de las 16 partidas fiscalizadas en 2003: fecha, alcance, IVA y fuente de cada cifra.',
    tags: ['Three.js', 'Vite'],
    link: { label: 'Repositorio en GitHub', href: 'https://github.com/kevelmun/ciudad-artes-ciencias-3d' },
  },
  {
    name: 'Plataforma de visión estéreo',
    kind: 'Caso de investigación · CiDIS',
    when: '2024 – 2025',
    text: 'Una plataforma que integra varios módulos del centro: mapas de disparidad con block matching y con machine learning, nubes de puntos 3D y fusión de cámaras RGB, térmica y de profundidad. Enlaza con las publicaciones de más abajo.',
    tags: ['Python', 'PyTorch', 'OpenCV', 'Open3D', 'YOLO'],
    link: { label: 'Ver publicaciones', href: '#investigacion' },
  },
  {
    name: 'Bosque Virtual La Prosperina',
    kind: 'VR · Meta Quest 2',
    when: '2023',
    tags: ['Unity'],
    text: 'Objetos interactivos y NPCs del tutorial principal del juego, y la documentación de las nuevas funciones. Está aquí porque también construyo cosas que no son un CRUD.',
  },
];

export const publications: { title: string; venue: string; doi: string; pending?: string[] }[] = [
  {
    title: 'Stereo Vision Techniques: A Comparative Study of Traditional and Machine Learning-Based Approaches',
    venue: 'Computer Vision and Robotics (CVR 2025) · Springer, LNNS vol. 1772 · 2026',
    doi: '10.1007/978-3-032-14044-9_33',
  },
  {
    title: 'Detecting and Characterizing Group Interactions Using 3D Spatial Data to Enhance Human-Robot Engagement',
    venue: 'RCVE ’25: 3rd International Conference on Robotics, Control and Vision Engineering · ACM, pp. 26–34 · 2025',
    doi: '10.1145/3747393.3747398',
  },
  {
    title: 'Deep learning for banana deformity classification: evaluating 2D and 3D domains',
    venue: 'CVIT 2026: Seventh International Conference on Computer Vision and Information Technology, Milán · Proc. SPIE vol. 14321 · 2026',
    doi: '10.1117/12.3122985',
  },
];

// Recomendaciones de LinkedIn, copiadas a mano (LinkedIn no permite incrustarlas).
// Cada `text` es un fragmento literal de la recomendación; la versión completa está en LinkedIn.
export const recommendations: { name: string; role: string; relation: string; when: string; text: string }[] = [
  {
    name: 'María José Bravo Macías',
    role: 'Líder de equipo · Diseñadora UI',
    relation: 'Fue mi supervisora directa',
    when: 'ago. 2026',
    text: 'Algo que valoro especialmente es que no se limita a ejecutar una idea: si identifica una oportunidad de mejora, la plantea y propone una solución concreta, lo que hace que las conversaciones sean mucho más constructivas.',
  },
  {
    name: 'Rommel Sebastián Soriano García',
    role: 'Software Developer',
    relation: 'Mismo equipo',
    when: 'ago. 2026',
    text: 'Es un desarrollador completo, innovador y seguro de sí mismo. Propone ideas, las defiende con criterio y no se conforma con lo básico. Además es muy colaborador: siempre dispuesto a ayudar, a revisar código o a resolver problemas en conjunto.',
  },
  {
    name: 'Maria Gabriela Rodríguez',
    role: 'Analista de Negocios + Product Owner en FUNIBER',
    relation: 'Mismo equipo',
    when: 'ago. 2026',
    text: 'Se destaca por su capacidad para generar ideas innovadoras, encontrar soluciones eficientes y asumir nuevos desafíos con compromiso y creatividad.',
  },
  {
    name: 'Melanni Hidrovo Intriago',
    role: 'Junior Software Developer · Full-stack',
    relation: 'Estuvo a mi cargo',
    when: 'ago. 2026',
    text: 'Es un desarrollador que no se limita a resolver el problema puntual de una tarea, sino que analiza el contexto y va más allá, identificando posibles factores que podrían verse afectados antes de realizar cambios.',
  },
  {
    name: 'Angelly Maria Loor Guerrero',
    role: 'Software QA Developer',
    relation: 'Trabajamos en equipos distintos',
    when: 'ago. 2026',
    text: 'Como QA, tuve la oportunidad de validar varios de sus desarrollos y siempre generó la confianza necesaria para mantener una comunicación abierta. Destaco especialmente su disposición para escuchar observaciones, recibir recomendaciones y trabajar en conjunto para encontrar la mejor solución.',
  },
  {
    name: 'Diana Lizeth Espejo Gavilán',
    role: 'Ingeniera de Sistemas',
    relation: 'Fue mi Project Manager',
    when: 'sept. 2026',
    text: 'Tiene excelentes habilidades tanto personales como profesionales, le gusta mucho aprender temas nuevos y siempre está dispuesto a ayudar a todos. Es un excelente ser humano.',
  },
  {
    name: 'Joan Gutierrez',
    role: 'Ingeniero en Sistemas',
    relation: 'Trabajamos en equipos distintos',
    when: 'ago. 2026',
    text: 'Se caracteriza no solo por implementar soluciones de manera efectiva, sino también por buscar constantemente generar un valor adicional con cada una de ellas.',
  },
  {
    name: 'Loberlly Salazar Aspiazu',
    role: 'Full-Stack Developer & UX/UI Designer',
    relation: 'Trabajamos en equipos distintos',
    when: 'jul. 2026',
    text: 'Él refleja muy bien lo que significa ser ingeniero: siempre está buscando la mejor manera de resolver los problemas y encontrar soluciones eficientes. Su curiosidad lo impulsa a aprender constantemente, investigar y llegar al fondo de cada situación hasta encontrar una respuesta.',
  },
  {
    name: 'Kevin Andrade',
    role: 'Ingeniero en Sistemas',
    relation: 'Estuvo a mi cargo',
    when: 'ago. 2026',
    text: 'Innovador, atento, seguro, colaborativo, responsable y con gran mentorazgo.',
  },
  {
    name: 'Leslye Torres Casanova',
    role: 'Analista de Calidad de Software',
    relation: 'Estudiamos juntos',
    when: 'jul. 2026',
    text: 'Además de su talento técnico, es una persona responsable, colaborativa y comprometida con cada proyecto en el que participa.',
  },
];
export const recommendationsPending: string[] = [];
export const recommendationsUrl = 'https://www.linkedin.com/in/kevelmun/details/recommendations/';

export const skills = [
  { group: 'Lenguajes', items: ['PHP', 'TypeScript', 'JavaScript', 'Python', 'SQL', 'C#', 'C++'] },
  { group: 'Backend', items: ['Laravel', 'Laravel Reverb', 'Node.js', 'NestJS', 'Express', 'FastAPI', 'Django', 'Hono', 'APIs REST', 'WebSockets', 'RabbitMQ', 'OpenAPI', 'AsyncAPI'] },
  { group: 'Frontend', items: ['React', 'Vue', 'Next.js', 'Astro', 'Angular', 'Ionic', 'MUI', 'Tailwind CSS', 'Bootstrap', 'Vuetify', 'Drupal (Headless CMS)', 'Diseño responsive'] },
  { group: 'Arquitectura', items: ['Microservicios', 'Arquitectura orientada a eventos', 'DDD', 'Arquitectura hexagonal', 'Vertical Slice', 'MVC', 'TDD', 'Modernización de legacy', 'EventCatalog'] },
  { group: 'Identidad y acceso', items: ['ZITADEL', 'IAM', 'OTP', 'SSO con terceros', 'Roles y permisos'] },
  { group: 'Datos', items: ['MySQL', 'PostgreSQL', 'MongoDB', 'ETL', 'Web scraping', 'Pandas', 'NumPy', 'Plotly', 'Matplotlib', 'Jupyter'] },
  { group: 'IA y visión', items: ['PyTorch', 'OpenCV', 'Open3D', 'YOLO', 'Scikit-learn', 'Visión estéreo', 'Nubes de puntos 3D', 'Fusión de sensores', 'LiDAR'] },
  { group: 'IA para desarrollo', items: ['Claude', 'Codex', 'MCP', 'Agentes personalizados'] },
  { group: 'Cloud y DevOps', items: ['Docker', 'Kubernetes', 'CI/CD (GitLab)', 'AWS', 'GCP', 'Azure', 'Oracle Cloud', 'Git'] },
  { group: 'Gestión', items: ['Scrum', 'Liderazgo de equipos', 'Mentoring', 'Estimación', 'Asana', 'Pivotal Tracker'] },
  { group: 'UX/UI', items: ['Figma', 'Figma Make', 'Stitch', 'Prototipado y mockups'] },
  { group: 'XR', items: ['Unity', 'Godot', 'Desarrollo VR (Meta Quest)'] },
];

export const education = [
  { title: 'Máster Universitario en Dirección y Gestión de Proyectos', org: 'Universitat Politècnica de València (UPV)', when: '2026 – en curso' },
  { title: 'Ingeniería en Computación', org: 'Escuela Superior Politécnica del Litoral (ESPOL)', when: 'oct. 2019 – oct. 2024' },
];

export const certifications: { title: string; org: string; when?: string; href?: string }[] = [
  { title: 'Especialización en Ingeniería de Datos con Azure', org: 'Smart Data · Lima, Perú', when: 'abr. – may. 2024' },
  { title: 'EF SET English Certificate: B2 Upper Intermediate (56/100)', org: 'Reading C1 · Listening C1', when: 'sept. 2026', href: 'https://cert.efset.org/qRw4mB' },
  { title: 'CCNA: Introduction to Networks', org: 'Cisco Networking Academy' },
  { title: 'Introduction to Packet Tracer', org: 'Cisco Networking Academy' },
];

export const award = {
  title: 'Estudiante Destacado de Prácticas de Servicio Comunitario',
  org: 'ESPOL',
};

export const nav = [
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'experiencia', label: 'Experiencia' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'investigacion', label: 'Investigación' },
  { id: 'skills', label: 'Skills' },
  { id: 'formacion', label: 'Formación' },
  { id: 'contacto', label: 'Contacto' },
];
