import { AboutSection } from "@/components/portfolio/sections/AboutSection";
import { ContactSection } from "@/components/portfolio/sections/ContactSection";
import { ExperienceSection } from "@/components/portfolio/sections/ExperienceSection";
import { HeroSection } from "@/components/portfolio/sections/HeroSection";
import { ProjectsSection } from "@/components/portfolio/sections/ProjectsSection";
import { ResumeSection } from "@/components/portfolio/sections/ResumeSection";
import { ServicesSection } from "@/components/portfolio/sections/ServicesSection";
import { SkillsSection } from "@/components/portfolio/sections/SkillsSection";
import { PortfolioFooter } from "@/components/portfolio/PortfolioFooter";
import { PortfolioHeader } from "@/components/portfolio/PortfolioHeader";
import { useDarkMode } from "@/components/portfolio/hooks/useDarkMode";
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
} from "@/components/portfolio/data";

export default function Portfolio() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="portfolio-shell min-h-screen text-foreground">
      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:shadow"
      >
        Saltar al contenido principal
      </a>

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="portfolio-orb portfolio-orb-left" />
        <div className="portfolio-orb portfolio-orb-right" />
        <div className="portfolio-grid" />
      </div>

      <PortfolioHeader
        name="Kevin Muñoz"
        darkMode={darkMode}
        navItems={navItems}
        onToggleTheme={toggleDarkMode}
        social={profile.social}
      />

      <main id="contenido-principal" className="relative z-10">
        <HeroSection
          darkMode={darkMode}
          headline={profile.headline}
          intro={profile.intro}
          availability={profile.availability}
          tags={heroTags}
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

        <ProjectsSection icon={sectionIcons.projects} projects={projects} />

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
    </div>
  );
}
