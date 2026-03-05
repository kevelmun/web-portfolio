import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Briefcase,
  Code2,
  Cpu,
  Home,
  Mail,
  Rocket,
  TerminalSquare,
  Wrench,
} from "lucide-react";
import { InteractiveTerminal } from "@/components/InteractiveTerminal";
import { MessageQueue } from "@/components/MessageQueue";
import { PortfolioFooter } from "@/components/portfolio/PortfolioFooter";
import { FloatingNav } from "@/components/portfolio/FloatingNav";
import { PortfolioHeader } from "@/components/portfolio/PortfolioHeader";
import {
  contactChannels,
  experiences,
  focusAreas,
  heroTags,
  impactMetrics,
  navItems,
  profile,
  projects,
  sectionIcons,
  serviceItems,
  skillCategories,
  universityEasterProject,
} from "@/components/portfolio/data";
import { useDarkMode } from "@/components/portfolio/hooks/useDarkMode";
import { useKonamiCode } from "@/components/portfolio/hooks/useKonamiCode";
import { AboutSection } from "@/components/portfolio/sections/AboutSection";
import { ContactSection } from "@/components/portfolio/sections/ContactSection";
import { ExperienceSection } from "@/components/portfolio/sections/ExperienceSection";
import { HeroSection } from "@/components/portfolio/sections/HeroSection";
import { ProjectsSection } from "@/components/portfolio/sections/ProjectsSection";
import { ResumeSection } from "@/components/portfolio/sections/ResumeSection";
import { ServicesSection } from "@/components/portfolio/sections/ServicesSection";
import { SkillsSection } from "@/components/portfolio/sections/SkillsSection";

const floatingNavItems = [
  { id: "hero", label: "Inicio", icon: Home },
  { id: "sobre-mi", label: "Perfil", icon: Code2 },
  { id: "servicios", label: "Servicios", icon: Wrench },
  { id: "proyectos", label: "Proyectos", icon: Rocket },
  { id: "experiencia", label: "Experiencia", icon: Briefcase },
  { id: "habilidades", label: "Skills", icon: Cpu },
  { id: "contacto", label: "Contacto", icon: Mail },
] as const;

const bootMessages = [
  "Inicializando entorno portfolio...",
  "Cargando componentes del rediseño...",
  "Configurando paneles interactivos...",
  "Aplicando distribución de secciones...",
  "Sistema listo.",
];

export default function Portfolio() {
  const prefersReducedMotion = useReducedMotion();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { activated: konamiActivated, unlocked: universityProjectUnlocked } = useKonamiCode();

  const [loadingProgress, setLoadingProgress] = React.useState(0);
  const [loadingMessage, setLoadingMessage] = React.useState(bootMessages[0]);
  const [loadingVisible, setLoadingVisible] = React.useState(true);

  const [pointer, setPointer] = React.useState({ x: 0, y: 0 });
  const [showFloatingNav, setShowFloatingNav] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<(typeof floatingNavItems)[number]["id"]>("hero");
  const [terminalOpen, setTerminalOpen] = React.useState(false);
  const visibleProjects = React.useMemo(
    () => (universityProjectUnlocked ? [...projects, universityEasterProject] : projects),
    [universityProjectUnlocked]
  );

  const particles = React.useMemo(
    () =>
      Array.from({ length: 20 }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 8 + Math.random() * 9,
        delay: Math.random() * 2,
      })),
    []
  );

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setLoadingProgress((current) => {
        const increment = Math.floor(Math.random() * 8) + 6;
        const next = Math.min(current + increment, 100);
        const messageIndex = Math.min(
          Math.floor((next / 100) * (bootMessages.length - 1)),
          bootMessages.length - 1
        );
        setLoadingMessage(bootMessages[messageIndex]);
        return next;
      });
    }, 130);

    return () => window.clearInterval(timer);
  }, []);

  React.useEffect(() => {
    if (loadingProgress < 100) {
      return;
    }

    const timer = window.setTimeout(() => {
      setLoadingVisible(false);
    }, 450);

    return () => window.clearTimeout(timer);
  }, [loadingProgress]);

  React.useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const onMove = (event: MouseEvent) => {
      setPointer({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [prefersReducedMotion]);

  React.useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      setShowFloatingNav(scrollY > 180);

      let nextSection: (typeof floatingNavItems)[number]["id"] = floatingNavItems[0].id;
      for (const item of floatingNavItems) {
        const section = document.getElementById(item.id);
        if (section && scrollY + 220 >= section.offsetTop) {
          nextSection = item.id;
        }
      }
      setActiveSection(nextSection);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (!target) {
      return;
    }
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-10 motion-reduce:hidden"
        style={{
          background: `radial-gradient(520px circle at ${pointer.x}px ${pointer.y}px, color-mix(in srgb, var(--primary) 24%, transparent), transparent 56%)`,
        }}
      />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_15%_20%,rgba(136,57,239,0.15),transparent_34%),radial-gradient(circle_at_82%_12%,rgba(4,165,229,0.14),transparent_30%),linear-gradient(160deg,#eff1f5_0%,#e6e9ef_55%,#ccd0da_100%)] dark:bg-[radial-gradient(circle_at_15%_20%,rgba(203,166,247,0.18),transparent_34%),radial-gradient(circle_at_82%_12%,rgba(137,220,235,0.14),transparent_30%),linear-gradient(160deg,#1E1E2E_0%,#181825_55%,#11111B_100%)]" />

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden motion-reduce:hidden">
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute rounded-full bg-primary/20 dark:bg-secondary/30"
            style={{
              left: `${particle.left}%`,
              width: particle.size,
              height: particle.size,
              top: "100%",
            }}
            animate={prefersReducedMotion ? { opacity: 0 } : { y: [0, -900], opacity: [0, 0.9, 0] }}
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                    duration: particle.duration,
                    delay: particle.delay,
                  }
            }
          />
        ))}
      </div>

      <AnimatePresence>
        {loadingVisible ? (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex h-screen w-screen items-center justify-center"
            style={{
              backgroundColor: "color-mix(in srgb, var(--background) 98%, transparent)",
            }}
          >
            <div
              className="w-[min(90vw,560px)] rounded-2xl border border-primary/30 p-6 shadow-[0_20px_80px_rgba(136,57,239,0.18)] dark:shadow-[0_20px_80px_rgba(203,166,247,0.22)]"
              style={{ backgroundColor: "color-mix(in srgb, var(--card) 98%, transparent)" }}
            >
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-primary">Booting Portfolio</p>
              <p className="mb-5 text-lg text-foreground">{loadingMessage}</p>
              <div className="h-3 w-full overflow-hidden rounded-full border border-primary/30 bg-background">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary via-accent to-secondary"
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <p className="mt-2 text-right font-mono text-sm text-secondary">{loadingProgress}%</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <PortfolioHeader
        name={profile.name}
        darkMode={darkMode}
        navItems={navItems}
        onToggleTheme={toggleDarkMode}
        social={profile.social}
      />
      <FloatingNav
        visible={showFloatingNav}
        items={floatingNavItems}
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

      <main className="relative z-20">
        <HeroSection
          darkMode={darkMode}
          name={profile.name}
          headline={profile.headline}
          intro={profile.intro}
          availability={profile.availability}
          tags={heroTags}
          konamiActivated={konamiActivated}
        />
        <AboutSection
          icon={sectionIcons.about}
          name={profile.name}
          location={profile.location}
          summary={profile.intro}
          focusAreas={focusAreas}
          metrics={impactMetrics}
        />
        <ServicesSection icon={sectionIcons.services} services={serviceItems} />
        <ProjectsSection icon={sectionIcons.projects} projects={visibleProjects} />
        <ExperienceSection icon={sectionIcons.experience} experiences={experiences} />
        <SkillsSection icon={sectionIcons.skills} categories={skillCategories} />
        <ContactSection
          icon={sectionIcons.contact}
          channels={contactChannels}
          location={profile.location}
          phone={profile.phone}
        />
        <ResumeSection icon={sectionIcons.cv} cvUrl={profile.cvUrl} />
      </main>

      <PortfolioFooter year={new Date().getFullYear()} />
      <MessageQueue />

      <div className="fixed bottom-20 left-4 z-[72] md:bottom-6 md:left-6">
        <button
          type="button"
          onClick={() => setTerminalOpen((current) => !current)}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-xl transition-colors duration-200 hover:bg-primary/20 hover:text-foreground cursor-pointer"
          aria-label="Abrir terminal"
        >
          <TerminalSquare className="h-6 w-6" />
        </button>
      </div>

      <AnimatePresence>
        {terminalOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-4 z-[72] md:left-6"
          >
            <InteractiveTerminal onClose={() => setTerminalOpen(false)} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
