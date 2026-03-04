import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { itemReveal, staggerContainer } from "@/components/portfolio/motion";
import { SectionBlock } from "@/components/portfolio/ui/SectionBlock";
import type { ExperienceItem } from "@/components/portfolio/types";

interface ExperienceSectionProps {
  icon: LucideIcon;
  experiences: ExperienceItem[];
}

export function ExperienceSection({
  icon,
  experiences,
}: ExperienceSectionProps) {
  return (
    <SectionBlock
      id="experiencia"
      title="Experiencia profesional"
      description="Ejecución técnica en contextos de producto, investigación y modernización de sistemas con foco en estabilidad y evolución continua."
      icon={icon}
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="relative grid gap-5 md:grid-cols-2"
      >
        {experiences.map((experience) => (
          <motion.article key={`${experience.company}-${experience.role}`} variants={itemReveal}>
            <Card className="portfolio-card h-full rounded-3xl border-border/70">
              <CardHeader className="pb-4">
                <p className="text-xs uppercase tracking-[0.13em] text-primary">{experience.period}</p>
                <CardTitle className="font-display text-xl leading-tight">{experience.role}</CardTitle>
                <p className="text-sm font-medium text-muted-foreground">{experience.company}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {experience.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.article>
        ))}
      </motion.div>
    </SectionBlock>
  );
}
