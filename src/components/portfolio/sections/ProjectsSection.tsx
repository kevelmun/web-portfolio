import { motion } from "framer-motion";
import { Github, Rocket } from "lucide-react";
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
        className="grid gap-5 lg:grid-cols-3"
      >
        {projects.map((project) => {
          const ProjectIcon = project.icon;
          return (
            <motion.div key={project.title} variants={itemReveal} whileHover={{ y: -6 }}>
              <Card className="portfolio-card group h-full rounded-3xl border-border/70 transition-all duration-300">
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                      <ProjectIcon className="h-5 w-5" />
                    </span>
                    <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/10 text-[11px] font-medium text-primary">
                      <Rocket className="mr-1 h-3 w-3" />
                      Activo
                    </Badge>
                  </div>
                  <CardTitle className="font-display text-xl leading-tight">{project.title}</CardTitle>
                </CardHeader>

                <CardContent className="flex h-full flex-col gap-4 text-sm text-muted-foreground">
                  <p>{project.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="rounded-full border border-border/60 bg-secondary/60 text-[11px]"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-auto space-y-3 pt-2">
                    <p className="rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-xs">
                      {project.impact}
                    </p>
                    <a
                      href={project.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({ variant: "default", size: "sm" }),
                        "w-full rounded-full"
                      )}
                    >
                      <Github className="mr-2 h-4 w-4" />
                      Ver código
                    </a>
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
