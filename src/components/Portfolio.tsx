import * as React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Globe, Cpu, Database, Server, Camera, Code2, Rocket, Download, Smartphone, Moon, Sun, Box, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from "recharts";
import { InteractiveTerminal } from "@/components/InteractiveTerminal";

// ————————————————————————————————————————————————————————————
// Single‑file React portfolio page
// Tailwind + shadcn/ui + framer-motion + lucide-react
// Replace links, projects, and contact info with your own data.
// ————————————————————————————————————————————————————————————

const skills = {
  lenguajes: [
    "Python", "TypeScript", "JavaScript", "PHP (Laravel)", "SQL", "Bash",
  ],
  frameworks: [
    "React", "Next.js", "Laravel", "FastAPI", "Flask", "Node.js",
  ],
  datosIA: [
    "Computer Vision (OpenCV, Ultralytics, ONNX)",
    "Deep Learning (PyTorch, TensorFlow)",
    "NLP (spaCy, Transformers)",
    "Data Science (pandas, scikit-learn)",
    "MLOps (MLflow, Weights & Biases)",
  ],
  microservicios: [
    "Docker", "Kubernetes", "gRPC/REST", "CI/CD (GitHub Actions)", "Message Brokers (Kafka, RabbitMQ)",
  ],
  bd: ["MySQL", "PostgreSQL", "Redis", "MongoDB"],
  otras: ["Linux", "Nginx", "Vite", "Vitest/Jest", "Playwright", "Tailwind CSS"],
};

const projects = [
  {
    title: "Fruit-Ripeness",
    description:
      "Repositorio para la extracción de imágenes desde nubes de puntos 3D (formato .ply) generadas por el escáner POP2; el flujo lee/recorta nubes, extrae información de color y genera imágenes proyectadas con máscaras." ,
    tags: ["Python", "Open3D", "OpenCV", "Point Cloud Processing", "Data Extraction"],
    links: { demo: "#", code: "https://github.com/kevelmun/Fruit-Ripeness" },
    icon: <Camera className="w-5 h-5" />,

  },
  {
    title: "StereoThermal",
    description:
      "Sistema de visión que integra cámaras estéreo y térmica con captura sincronizada, calibración e imagen-registro para aplicaciones avanzadas de procesamiento de imágenes.",
    tags: ["Python", "OpenCV", "LightGlue", "Image Registration", "Stereo Vision", "Thermal Imaging"],
    links: { demo: "#", code: "https://github.com/kevelmun/StereoThermal" },
    icon: <Box className="w-5 h-5" />,

  },
  {
    title: "VoiceChat-AzureOllamaAgent",
    description:
      "Aplicación de chat por voz que integra los servicios de Azure (Speech-to-Text y Text-to-Speech) con el modelo Ollama 3.2, para convertir voz en texto, procesar con el modelo y devolver respuesta en voz.",
    tags: ["Python", "Azure Speech", "Text-to-Speech", "Voice Recognition", "LLM Agents", "Ollama"],
    links: { demo: "#", code: "https://github.com/kevelmun/VoiceChat-AzureOllamaAgent" },
    icon: <Mic className="w-5 h-5" />,

  },
];

const experiences = [
  {
    role: "Desarrollador de Software Full‑Stack",
    company: "FUNIBER · Guayaquil, Ecuador",
    period: "Enero 2025 — Presente",
    bullets: [
      "Microservicios escalables con Laravel y React; refactor de proyectos legacy (PHP 5.6) hacia arquitecturas modernas.",
      "Automatización de reportes, migraciones y optimización de queries en MySQL/PostgreSQL.",
      "Mensajería asíncrona con RabbitMQ y WebSocket broadcasting con Laravel Reverb.",
      "Uso de IA y herramientas de productividad para acelerar desarrollo y documentación (Scrum con Asana/Slack).",
    ],
  },
  {
    role: "Técnico Investigador en Visión por Computadora",
    company: "CiDIS · ESPOL · Guayaquil, Ecuador",
    period: "Junio 2024 — Mayo 2025",
    bullets: [
      "Plataforma de visión estéreo para integrar módulos de procesamiento existentes.",
      "Block‑matching y ML para mapas de disparidad; segmentación/detección (YOLO) y nubes de puntos.",
      "Fusión multimodal RGB‑Térmico (LWIR) y análisis de benchmarks/papers.",
    ],
  },
  {
    role: "Ciencia e Ingeniería de Datos",
    company: "ESPOL · Guayaquil, Ecuador",
    period: "Mayo 2023 — Agosto 2023",
    bullets: [
      "Web scraping de Twitter (X) para análisis de criminalidad en Guayaquil.",
      "Limpieza, construcción de datasets y gráficos analíticos para preguntas de negocio.",
    ],
  },
  {
    role: "Desarrollador Web y Móvil",
    company: "Hangaroa S.A. · Guayaquil, Ecuador",
    period: "Septiembre 2022 — Enero 2023",
    bullets: [
      "Mockups y desarrollo de app móvil, web y panel administrador (frontend y backend).",
      "Seguimiento ágil con Pivotal Tracker y corrección de bugs.",
    ],
  },
  {
    role: "Desarrollo de Videojuegos (VR)",
    company: "ESPOL · Guayaquil, Ecuador",
    period: "Junio 2023 — Septiembre 2023",
    bullets: [
      "Bosque Virtual La Prosperina para Meta Quest 2: objeto Monocular y NPC guía.",
    ],
  },
];

const Section = ({ id, title, icon, children }: { id: string; title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <section id={id} className="py-16 scroll-mt-24">
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-xl bg-primary/10 text-primary">{icon}</div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h2>
      </div>
      {children}
    </div>
  </section>
);

// ——— Interactive Radar component ———
function RadarProfiles({ darkMode }: { darkMode: boolean }) {
  const perfiles = darkMode ? [
    { key: 'Desarrollo web', color: '#3b82f6', opacity: 0.65 }, // Azul brillante para modo oscuro
    { key: 'Computer Vision', color: '#8b5cf6', opacity: 0.55 }, // Púrpura para modo oscuro
    { key: 'Datos & IA', color: '#10b981', opacity: 0.55 }, // Verde esmeralda para modo oscuro
  ] : [
    { key: 'Desarrollo web', color: '#0E1527', opacity: 0.65 }, // Azul oscuro para modo claro
    { key: 'Computer Vision', color: '#3A465B', opacity: 0.55 }, // Gris azulado para modo claro
    { key: 'Datos & IA', color: '#64748b', opacity: 0.55 }, // Gris para modo claro
  ];

  const base = [
    { dim: 'Frontend', 'Desarrollo web': 9, 'Computer Vision': 4, 'Datos & IA': 6 },
    { dim: 'Backend', 'Desarrollo web': 8, 'Computer Vision': 5, 'Datos & IA': 7 },
    { dim: 'APIs', 'Desarrollo web': 8, 'Computer Vision': 6, 'Datos & IA': 7 },
    { dim: 'DevOps', 'Desarrollo web': 5, 'Computer Vision': 2, 'Datos & IA': 2 },
    { dim: 'Bases de datos', 'Desarrollo web': 8, 'Computer Vision': 5, 'Datos & IA': 8 },
    { dim: 'ML/AI', 'Desarrollo web': 5, 'Computer Vision': 9, 'Datos & IA': 9 },
    { dim: 'Computer Vision', 'Desarrollo web': 5, 'Computer Vision': 7, 'Datos & IA': 6 },
    { dim: 'Data Eng', 'Desarrollo web': 7, 'Computer Vision': 5, 'Datos & IA': 7 },
  ];

  const [selected, setSelected] = React.useState<string[]>(perfiles.map(p => p.key));

  const toggle = (k: string) => {
    setSelected((prev: string[]) => prev.includes(k) ? prev.filter((x: string) => x !== k) : [...prev, k]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {perfiles.map(p => (
          <Button key={p.key} size="sm" variant={selected.includes(p.key) ? 'secondary' : 'outline'} onClick={() => toggle(p.key)}>
            {selected.includes(p.key) ? '✓ ' : ''}{p.key}
          </Button>
        ))}
        <Button size="sm" variant="ghost" onClick={() => setSelected(perfiles.map(p=>p.key))}>Mostrar todos</Button>
        <Button size="sm" variant="ghost" onClick={() => setSelected([])}>Ocultar todos</Button>
      </div>

      <div className="w-full h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart outerRadius={140} data={base}>
            <PolarGrid />
            <PolarAngleAxis dataKey="dim" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fontSize: 10 }} />
            {perfiles.filter(p => selected.includes(p.key)).map((p) => (
              <Radar key={p.key} name={p.key} dataKey={p.key} stroke={p.color} fill={p.color} fillOpacity={p.opacity} />
            ))}
            <Tooltip />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [darkMode, setDarkMode] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  React.useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Smooth reveal for sections (respects prefers-reduced-motion)
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add('reveal--visible');
          } else {
            el.classList.remove('reveal--visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    const sections = Array.from(document.querySelectorAll('section[id]')) as HTMLElement[];
    sections.forEach((s) => {
      s.classList.add('reveal');
      io.observe(s);
    });

    return () => io.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 text-foreground">
      {/* Nav */}
      <header className="backdrop-blur supports-[backdrop-filter]:bg-background/70 sticky top-0 z-50 border-b">
        <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="#hero" className="font-semibold tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 align-middle" />
            <span>Kevin Muñoz</span>
          </a>
          <div className="hidden sm:flex items-center gap-1">
            <a className="px-3 py-2 rounded-lg hover:bg-muted" href="#proyectos">Proyectos</a>
            <a className="px-3 py-2 rounded-lg hover:bg-muted" href="#experiencia">Experiencia</a>
            <a className="px-3 py-2 rounded-lg hover:bg-muted" href="#habilidades">Habilidades</a>
            <a className="px-3 py-2 rounded-lg hover:bg-muted" href="#contacto">Contacto</a>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Cambiar tema"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://github.com/kevelmun" target="_blank" rel="noreferrer" aria-label="GitHub">
                <Github className="w-5 h-5 align-middle" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://www.linkedin.com/in/kevelmun" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5 align-middle" />
              </a>
            </Button>
            <Button className="hidden sm:inline-flex items-center" asChild>
              <a href="#contacto" className="flex items-center">
                <Mail className="w-5 h-5 mr-2 align-middle" /> Contactar
              </a>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section id="hero" className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 size-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 size-72 rounded-full bg-secondary/10 blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge className="mb-4" variant="secondary">Disponible para proyectos</Badge>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
              Ingeniero en Ciencias de la Computación
            </h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary">Desarrollo Full‑Stack</Badge>
              <Badge variant="secondary">Computer Vision</Badge>
              <Badge variant="secondary">Datos & IA</Badge>
              <Badge variant="secondary">Microservicios</Badge>
            </div>
            <p className="mt-4 text-muted-foreground text-lg max-w-prose">
              Full‑Stack con foco en crear productos escalables y limpios: frontend y backend modernos, APIs bien diseñadas,
              bases de datos sólidas y despliegues confiables. Experiencia adicional en visión por computadora y ciencia de datos
              para llevar modelos a producción cuando aporta valor al negocio.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Rocket className="w-4 h-4 mr-2" />
                <a href="#proyectos">Ver proyectos</a>
              </Button>
              <Button variant="outline" asChild>
                <Download className="w-4 h-4 mr-2" /> 
                <a href="#cv">Descargar CV</a>
              </Button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <InteractiveTerminal darkMode={darkMode} />
          </motion.div>
        </div>
      </section>

      {/* Sobre mí / Foto + Resumen + Perfiles & Radar */}
      <Section id="sobre-mi" title="Sobre mí" icon={<Code2 className="w-5 h-5" />}>
        <div className="grid md:grid-cols-3 gap-6 items-start">
          <div className="flex flex-col gap-8 md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Kevin Elihan Muñoz Calva</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src="../../public/images/Me.PNG"
                  alt="Tu foto"
                  className="w-full max-w-sm aspect-square object-cover rounded-2xl mx-auto shadow"
                />
                <p className="text-xs text-muted-foreground mt-3 text-center">Ecuatoriano - 24 años</p>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2 flex flex-col h-full">
            <RadarProfiles darkMode={darkMode} />
          </div>

          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
                <CardDescription className="italic"><b>Experiencia más reciente:</b> Desarrollador Full‑Stack · Laravel, React, OpenApi - AsyncApi, TypeScript, MySQL · Microservicios y mensajería (RabbitMQ).</CardDescription>
              </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>Me especializo en entregar soluciones end‑to‑end: interfaces accesibles, APIs bien definidas y despliegues automatizados.</p>
                  <p>Trabajo habitualmente con metodologías ágiles (principalmente SCRUM) y diseño guiado por dominio (DDD) para alinear el software con las necesidades del negocio.</p>
                  <p>Doy prioridad a la documentación en dos niveles —alto nivel (arquitectura, decisiones) y bajo nivel (comentarios relevantes y ejemplos)— para facilitar mantenimiento y onboarding.</p>
                  <p>Integro herramientas de IA y automatización cuando aportan valor: las uso para mejorar eficiencia sin sacrificar calidad. Aunque gran parte de mi experiencia es anterior al "boom" de la IA, he incorporado estas herramientas a mi flujo de trabajo diario de forma exitosa.</p>
                  <p>Actualmente debido a las necesidades del mercado estoy aprendiendo soluciones no‑code / low‑code para automatizar procesos repetitivos y acelerar entregas en proyectos donde encajan bien.</p>
                </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Projects */}
      <Section id="proyectos" title="Proyectos Destacados" icon={<Rocket className="w-5 h-5" />}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <Card key={p.title} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">{React.cloneElement(p.icon, { className: 'w-5 h-5 align-middle' })}{p.title}</CardTitle>
                </div>
                <CardDescription>{p.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.tags.map((t) => (
                    <Badge key={t} variant="secondary">{t}</Badge>
                  ))}
                </div>
                <div className="flex gap-3">
                  {/* <Button variant="outline" size="sm" asChild>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    <a href={p.links.demo} target="_blank" rel="noreferrer">Demo</a>
                  </Button> */}
                  <Button variant="secondary" size="sm" asChild>
                    <Github className="w-4 h-4 mr-2" />
                    <a href={p.links.code} target="_blank" rel="noreferrer">Código</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Experience */}
      <Section id="experiencia" title="Experiencia" icon={<Server className="w-5 h-5" />}>
        <div className="grid md:grid-cols-2 gap-6">
          {experiences.map((e) => (
            <Card key={e.role} className="border-muted">
              <CardHeader>
                <CardTitle className="text-lg">{e.role} · <span className="text-primary">{e.company}</span></CardTitle>
                <CardDescription>{e.period}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {e.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Skills */}
      <Section id="habilidades" title="Habilidades" icon={<Cpu className="w-5 h-5" />}>
        <Tabs defaultValue="stack" className="w-full">
          <TabsList className="flex flex-wrap gap-2">
            <TabsTrigger value="stack">Stack</TabsTrigger>
            <TabsTrigger value="vision">Visión</TabsTrigger>
            <TabsTrigger value="web">Web</TabsTrigger>
            <TabsTrigger value="datos">Datos & IA</TabsTrigger>
            <TabsTrigger value="micro">Microservicios</TabsTrigger>
          </TabsList>
          <TabsContent value="stack" className="mt-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card><CardHeader><CardTitle>Lenguajes</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-2">{skills.lenguajes.map((s)=> <Badge key={s} variant="outline">{s}</Badge>)}</CardContent></Card>
              <Card><CardHeader><CardTitle>Frameworks</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-2">{skills.frameworks.map((s)=> <Badge key={s} variant="outline">{s}</Badge>)}</CardContent></Card>
              <Card><CardHeader><CardTitle>Bases de datos</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-2">{skills.bd.map((s)=> <Badge key={s} variant="outline">{s}</Badge>)}</CardContent></Card>
            </div>
          </TabsContent>
          <TabsContent value="vision" className="mt-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Camera className="w-5 h-5" /> Computer Vision</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">{skills.datosIA.slice(0,1).concat(["Detección", "Segmentación", "OCR", "Tracking"]).map((s)=> <Badge key={s} variant="secondary">{s}</Badge>)}</CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="web" className="mt-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" /> Desarrollo Web</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">{skills.frameworks.concat(["Auth", "Testing", "Caching"]).map((s)=> <Badge key={s} variant="secondary">{s}</Badge>)}</CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="datos" className="mt-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Database className="w-5 h-5" /> Datos & IA</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">{skills.datosIA.map((s)=> <Badge key={s} variant="secondary">{s}</Badge>)}</CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="micro" className="mt-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Server className="w-5 h-5" /> Microservicios</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">{skills.microservicios.map((s)=> <Badge key={s} variant="secondary">{s}</Badge>)}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Section>


      {/* Contact */}
      <Section id="contacto" title="Contacto" icon={<Mail className="w-5 h-5" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <Card className="w-full min-w-0">
            <CardHeader>
              <CardTitle>¿Hablamos?</CardTitle>
              <CardDescription>Completa el formulario y contacta conmigo por WhatsApp.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={(e)=>{
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const nombre = formData.get('nombre') as string;
                const email = formData.get('email') as string;
                const mensaje = formData.get('mensaje') as string;
                const textoWhatsApp = `Hola, soy ${nombre}.\nEmail: ${email}\n\nTe escribo por ${mensaje}`;
                const whatsappUrl = `https://wa.me/593939133960?text=${encodeURIComponent(textoWhatsApp)}`;
                window.open(whatsappUrl, '_blank');
              }}>
                <Input className="w-full" name="nombre" placeholder="Nombre" required />
                <Input className="w-full" name="email" type="email" placeholder="Email" required />
                <Textarea className="w-full" name="mensaje" placeholder="Cuéntame sobre tu proyecto" rows={5} required />
                <div className="flex-col gap-2 sm:flex-row sm:justify-start flex">
                  <Button type="submit">
                    <Smartphone className="w-4 h-4 mr-2" />
                    Contactar por WhatsApp
                  </Button>
                  <Button variant="outline" asChild>
                    <Mail className="w-4 h-4 mr-2" />
                    <a href="mailto:3lihan.m.c@gmail.com">Email directo</a>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          <Card className="w-full min-w-0">
            <CardHeader>
              <CardTitle>Información</CardTitle>
              <CardDescription>Enlaces oficiales de contacto.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm break-words">
                <div className="flex items-center gap-2"><Github className="w-5 h-5 align-middle" /><a className="underline-offset-4 hover:underline break-words" href="https://github.com/kevelmun" target="_blank" rel="noreferrer">github.com/kevelmun</a></div>
                <div className="flex items-center gap-2"><Linkedin className="w-5 h-5 align-middle" /><a className="underline-offset-4 hover:underline break-words" href="https://www.linkedin.com/in/kevelmun" target="_blank" rel="noreferrer">linkedin.com/in/kevelmun</a></div>
                <div className="flex items-center gap-2"><Mail className="w-5 h-5 align-middle" /><a className="underline-offset-4 hover:underline break-words" href="mailto:3lihan.m.c@gmail.com">3lihan.m.c@gmail.com</a></div>
                <div className="flex items-center gap-2"><Globe className="w-5 h-5 align-middle" /><span>Guayaquil, Ecuador · +593 93 913 3960</span></div>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* CV anchor */}
      <Section id="cv" title="Currículum" icon={<Database className="w-5 h-5" />}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Code2 className="w-5 h-5" /> ¿Estas Interesado?</CardTitle>
            <CardDescription>Descarga a continuación mi CV para mas información o para incluirme en tu proceso de selección.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <a 
                href="/cv-kevin-munoz.pdf" 
                download="CV-Kevin-Munoz.pdf"
                className="group"
              >
                <Card className="w-64 h-64 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 hover:border-primary/40">
                  <CardContent className="h-full flex flex-col items-center justify-center gap-4 p-8">
                    <div className="p-6 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Download className="w-16 h-16 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-semibold mb-1">Descargar CV</p>
                      <p className="text-sm text-muted-foreground">Formato PDF</p>
                    </div>
                  </CardContent>
                </Card>
              </a>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* Footer */}
      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between text-sm text-muted-foreground">
          <p className="flex items-center gap-2"><Cpu className="w-5 h-5 align-middle" /> Hecho con React, Tailwind y shadcn/ui.</p>
          <p>© {new Date().getFullYear()} Kevin Muñoz</p>
        </div>
      </footer>
    </div>
  );
}
