import {
  Box,
  Camera,
  Code2,
  Cpu,
  Database,
  Gamepad2,
  Github,
  Globe,
  Linkedin,
  Mail,
  Mic,
  Rocket,
  Server,
} from "lucide-react";
import type {
  ContactChannel,
  ExperienceItem,
  FocusArea,
  MetricItem,
  NavItem,
  ProjectItem,
  ServiceItem,
  SkillCategory,
} from "@/components/portfolio/types";

export const navItems: NavItem[] = [
  { label: "Sobre mí", href: "#sobre-mi" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Experiencia", href: "#experiencia" },
  { label: "Habilidades", href: "#habilidades" },
  { label: "Contacto", href: "#contacto" },
];

export const heroTags = [
  "Full-Stack Engineering",
  "Computer Vision",
  "Datos & IA aplicada",
  "Arquitecturas de microservicios",
];

export const impactMetrics: MetricItem[] = [
  { label: "Años construyendo software", value: "3+" },
  { label: "Stacks de producción", value: "12+" },
  { label: "Países objetivo de clientes", value: "LatAm + US" },
  { label: "Interés principal", value: "Sistemas escalables" },
];

export const focusAreas: FocusArea[] = [
  {
    title: "Arquitectura web moderna",
    description:
      "Construyo aplicaciones robustas desde la capa visual hasta la persistencia de datos, priorizando mantenibilidad y claridad técnica.",
    capabilities: ["React/Next.js", "Laravel/Node.js", "Diseño API-first"],
  },
  {
    title: "Integración de IA útil",
    description:
      "Integro modelos de visión y flujos de datos cuando generan ventaja real de producto, evitando complejidad innecesaria.",
    capabilities: ["Computer Vision", "MLOps inicial", "Automatización inteligente"],
  },
  {
    title: "Entrega profesional",
    description:
      "Diseño software listo para evolucionar con documentación, buenas prácticas, testing y despliegues repetibles.",
    capabilities: ["CI/CD", "Observabilidad", "Refactor legacy"],
  },
];

export const serviceItems: ServiceItem[] = [
  {
    title: "Web corporativa y portales",
    description:
      "Sitios y plataformas con diseño profesional, rendimiento sólido y estructura preparada para crecimiento.",
    deliverables: [
      "UX/UI moderno",
      "SEO técnico base",
      "Arquitectura modular",
    ],
  },
  {
    title: "Aplicaciones Full-Stack",
    description:
      "Desarrollo end-to-end de soluciones de negocio con frontend moderno, backend limpio y datos consistentes.",
    deliverables: [
      "React + Laravel/Node.js",
      "Auth y permisos",
      "Métricas de producto",
    ],
  },
  {
    title: "Integraciones y automatización",
    description:
      "Conecto APIs, procesos internos y servicios cloud para eliminar fricción operativa en equipos.",
    deliverables: ["Integración de APIs", "Flujos automáticos", "Mensajería asíncrona"],
  },
  {
    title: "Modernización de sistemas",
    description:
      "Evoluciono sistemas legacy a arquitecturas mantenibles sin perder continuidad de negocio.",
    deliverables: ["Refactor gradual", "Mejora de consultas SQL", "Migración segura"],
  },
];

export const projects: ProjectItem[] = [
  {
    title: "Fruit-Ripeness",
    description:
      "Pipeline de visión por computadora para estimar madurez de fruta desde nubes de puntos 3D (.ply), con extracción de color y proyecciones útiles para entrenamiento.",
    tags: ["Python", "Open3D", "OpenCV", "Point Cloud"],
    codeUrl: "https://github.com/kevelmun/Fruit-Ripeness",
    impact: "Preparación de datasets reproducible para investigación aplicada.",
    icon: Camera,
  },
  {
    title: "StereoThermal",
    description:
      "Sistema multimodal RGB estéreo + LWIR con captura sincronizada, calibración y registro para tareas de disparidad y análisis térmico confiable.",
    tags: ["Python", "OpenCV", "LightGlue", "Thermal Imaging"],
    codeUrl: "https://github.com/kevelmun/StereoThermal",
    impact: "Base técnica para experimentación de percepción multimodal.",
    icon: Box,
  },
  {
    title: "VoiceChat-AzureOllamaAgent",
    description:
      "Asistente de voz con Azure Speech y Ollama para flujo completo voz->texto->inferencia->respuesta hablada, orientado a productividad.",
    tags: ["Python", "Azure Speech", "Ollama", "LLM Agents"],
    codeUrl: "https://github.com/kevelmun/VoiceChat-AzureOllamaAgent",
    impact: "Arquitectura base para asistentes manos libres empresariales.",
    icon: Mic,
  },
];

export const universityEasterProject: ProjectItem = {
  title: "Scape from the Dark (Universitario)",
  description:
    "Videojuego de etapa universitaria publicado en Itch.io. Es un proyecto amateur hecho como parte de formación y experimentación temprana en desarrollo de juegos.",
  tags: ["Godot", "GDScript", "Game Design", "Proyecto Universitario"],
  codeUrl: "https://kevelmun.itch.io/scape-from-the-dark",
  impact:
    "Recuerdo técnico de mis tiempos universitarios: simple, nostálgico y enfocado en aprendizaje.",
  icon: Gamepad2,
  isEasterEgg: true,
  actionLabel: "Jugar en Itch.io",
};

export const experiences: ExperienceItem[] = [
  {
    role: "Desarrollador de Software Full-Stack",
    company: "FUNIBER · Guayaquil, Ecuador",
    period: "Enero 2025 - Presente",
    bullets: [
      "Desarrollo y mantenimiento de aplicaciones web y microservicios en proyectos modernos y legacy con Laravel/Node.js + React/Vue.",
      "Migración de sistemas en PHP 5.6 hacia arquitectura modular, mejorando mantenibilidad y escalabilidad.",
      "Optimización avanzada de consultas SQL en MySQL y PostgreSQL para flujos críticos.",
      "Integración de RabbitMQ y WebSocket broadcasting con Laravel Reverb para comunicación en tiempo real.",
    ],
  },
  {
    role: "Técnico Investigador en Visión por Computadora",
    company: "CiDIS · ESPOL · Guayaquil, Ecuador",
    period: "Junio 2024 - Mayo 2025",
    bullets: [
      "Diseño de plataforma de visión estéreo para integrar módulos de procesamiento existentes.",
      "Implementación de block-matching y modelos de ML para mapas de disparidad robustos.",
      "Procesamiento y fusión multimodal RGB-Térmico (LWIR) para resultados más confiables.",
      "Investigación continua de papers y benchmarks para prototipos de última generación.",
    ],
  },
  {
    role: "Ciencia e Ingeniería de Datos",
    company: "ESPOL · Guayaquil, Ecuador",
    period: "Mayo 2023 - Agosto 2023",
    bullets: [
      "Extracción de datos en X (Twitter) mediante web scraping para analizar patrones de criminalidad.",
      "Limpieza, normalización y construcción de datasets para análisis reproducible.",
      "Visualizaciones y reportes orientados a preguntas de negocio.",
    ],
  },
  {
    role: "Desarrollador Web y Móvil",
    company: "Hangaroa S.A. · Guayaquil, Ecuador",
    period: "Septiembre 2022 - Enero 2023",
    bullets: [
      "Liderazgo técnico en el primer release bajo metodología Scrum.",
      "Diseño de mockups y desarrollo full-stack de web, app móvil y panel administrador.",
      "Code reviews y corrección de bugs para estabilizar entregables.",
    ],
  },
];

export const skillCategories: SkillCategory[] = [
  {
    id: "web",
    label: "Web",
    title: "Desarrollo Web",
    summary: "Interfaces, APIs y experiencia de usuario de extremo a extremo.",
    icon: Globe,
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "Laravel",
      "Node.js",
      "REST/gRPC",
      "WebSockets",
      "Testing (Vitest/Jest)",
    ],
  },
  {
    id: "data",
    label: "Datos & IA",
    title: "Ciencia de Datos e IA",
    summary: "Modelado, preparación de datos y puesta en práctica orientada a producto.",
    icon: Database,
    items: [
      "PyTorch",
      "TensorFlow",
      "pandas",
      "scikit-learn",
      "spaCy",
      "Transformers",
      "MLflow",
      "Weights & Biases",
    ],
  },
  {
    id: "vision",
    label: "Visión",
    title: "Computer Vision",
    summary: "Percepción multimodal y procesamiento de imagen para escenarios reales.",
    icon: Code2,
    items: [
      "OpenCV",
      "YOLO",
      "Segmentación",
      "Estéreo visión",
      "Registro térmico",
      "Point Clouds",
      "OCR",
      "Tracking",
    ],
  },
  {
    id: "infra",
    label: "Infra",
    title: "Infraestructura & Delivery",
    summary: "Despliegues confiables y operación técnica para escalar sin fricción.",
    icon: Server,
    items: [
      "Docker",
      "Kubernetes",
      "RabbitMQ",
      "Kafka",
      "GitHub Actions",
      "Nginx",
      "Linux",
      "Monitoreo",
    ],
  },
];

export const contactChannels: ContactChannel[] = [
  {
    label: "GitHub",
    value: "github.com/kevelmun",
    href: "https://github.com/kevelmun",
    icon: Github,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/kevelmun",
    href: "https://www.linkedin.com/in/kevelmun",
    icon: Linkedin,
  },
  {
    label: "Email",
    value: "3lihan.m.c@gmail.com",
    href: "mailto:3lihan.m.c@gmail.com",
    icon: Mail,
  },
];

export const profile = {
  name: "Kevin Elihan Muñoz Calva",
  headline: "Ingeniero en Ciencias de la Computación",
  intro:
    "Diseño y construyo productos digitales con enfoque en escalabilidad, claridad técnica y resultados medibles. Combino desarrollo Full-Stack con experiencia en IA para producción y visión por computadora para resolver problemas de negocio complejos.",
  location: "Guayaquil, Ecuador",
  phone: "+593 93 913 3960",
  availability: "Disponible para proyectos y posiciones remotas.",
  social: {
    github: "https://github.com/kevelmun",
    linkedin: "https://www.linkedin.com/in/kevelmun",
    email: "mailto:3lihan.m.c@gmail.com",
  },
  cvUrl: "/cv-kevin-munoz.pdf",
};

export const sectionIcons = {
  about: Code2,
  services: Globe,
  projects: Rocket,
  experience: Server,
  skills: Cpu,
  contact: Mail,
  cv: Database,
};
