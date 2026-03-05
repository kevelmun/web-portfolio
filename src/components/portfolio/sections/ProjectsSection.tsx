import { motion } from "framer-motion";
import { ExternalLink, Github, Rocket, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { itemReveal, staggerContainer } from "@/components/portfolio/motion";
import { SectionBlock } from "@/components/portfolio/ui/SectionBlock";
import type { ProjectItem } from "@/components/portfolio/types";
import { cn } from "@/lib/utils";

interface ProjectsSectionProps {
  icon: LucideIcon;
  projects: ProjectItem[];
}

export function ProjectsSection({ icon, projects }: ProjectsSectionProps) {
  return (
    <SectionBlock
      id="proyectos"
      title="Proyectos destacados"
      description="Trabajo técnico con orientación práctica: investigación aplicada, integración multimodal y sistemas basados en IA con enfoque productivo."
      icon={icon}
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project) => {
          const ProjectIcon = project.icon;
          const isEasterEggProject = Boolean(project.isEasterEgg);
          const ActionIcon = isEasterEggProject ? ExternalLink : Github;

          return (
            <motion.div
              key={project.title}
              variants={itemReveal}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              whileHover={{ y: -6, scale: 1.02 }}
              layout
              className="h-full"
            >
              <Card className={cn(
                "portfolio-card group rounded-3xl border-2 border-secondary bg-background/50 hover:bg-secondary/40 hover:border-primary transition-all duration-300 relative overflow-hidden flex h-full min-h-[430px] flex-col cursor-pointer",
                isEasterEggProject &&
                  "border-dashed border-primary/75 ring-2 ring-primary/25 shadow-[0_0_0_1px_rgba(136,57,239,0.16),0_0_28px_rgba(136,57,239,0.16)]"
              )}>
                {/* Geometric accent */}
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-colors" />
                {isEasterEggProject ? (
                  <div className="absolute top-3 right-3 z-20 rounded-full border border-primary/60 bg-primary/15 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                    Easter Egg
                  </div>
                ) : null}
                
                <CardHeader className="space-y-3 pb-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary transform group-hover:rotate-12 transition-transform duration-300">
                      <ProjectIcon className="h-6 w-6" />
                    </span>
                    {isEasterEggProject ? (
                      <Badge variant="outline" className="rounded-full border-accent bg-accent/10 text-xs font-semibold text-foreground px-3 py-1">
                        <Sparkles className="mr-1 h-3 w-3 text-accent" />
                        Desbloqueado
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="rounded-full border-primary bg-primary/10 text-xs font-semibold text-foreground px-3 py-1">
                        <Rocket className="mr-1 h-3 w-3 text-primary" />
                        Activo
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="min-h-[3.8rem] line-clamp-2 font-display text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-4 text-sm text-foreground/80 relative z-10">
                  <p className="text-base line-clamp-4">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tags.slice(0,3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="rounded-lg border-none bg-secondary/80 text-foreground px-3 py-1 text-xs font-medium"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-4 space-y-4 pt-4 border-t border-secondary/50">
                    <p className="text-sm font-medium line-clamp-2">
                      <Sparkles className="mr-2 inline h-4 w-4 text-primary" />
                      {project.impact}
                    </p>
                    <a
                      href={project.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({ variant: "default" }),
                        "w-full rounded-2xl font-bold h-12 transition-all",
                        isEasterEggProject
                          ? "bg-accent hover:bg-accent/90 text-accent-foreground group-hover:shadow-[0_0_20px_rgba(4,165,229,0.35)]"
                          : "bg-primary hover:bg-primary/90 text-background group-hover:shadow-[0_0_20px_rgba(136,57,239,0.3)]"
                      )}
                    >
                      <ActionIcon className="mr-2 h-5 w-5" />
                      {project.actionLabel ?? "Explorar Código"}
                    </a>
                    {isEasterEggProject ? (
                      <p className="text-center text-[11px] text-muted-foreground/90">
                        Proyecto universitario amateur.
                      </p>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </SectionBlock>
  );
}
