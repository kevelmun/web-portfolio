import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionBlock } from "@/components/portfolio/ui/SectionBlock";
import { itemReveal, staggerContainer } from "@/components/portfolio/motion";
import type { FocusArea, MetricItem } from "@/components/portfolio/types";
import type { LucideIcon } from "lucide-react";

interface AboutSectionProps {
  icon: LucideIcon;
  name: string;
  location: string;
  summary: string;
  focusAreas: FocusArea[];
  metrics: MetricItem[];
}

export function AboutSection({
  icon,
  name,
  location,
  summary,
  focusAreas,
  metrics,
}: AboutSectionProps) {
  return (
    <SectionBlock
      id="sobre-mi"
      title="Perfil profesional"
      description="Ingeniería de software orientada a producto, con foco en resultados, calidad técnica y evolución sostenible del código."
      icon={icon}
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]"
      >
        <motion.div variants={itemReveal}>
          <Card className="portfolio-card overflow-hidden rounded-3xl border-border/70">
            <CardContent className="p-5">
              <img
                src="/images/Me.PNG"
                alt="Foto profesional de Kevin Muñoz"
                loading="lazy"
                decoding="async"
                width={800}
                height={800}
                className="aspect-square w-full rounded-2xl object-cover"
              />
              <div className="mt-4">
                <p className="font-display text-xl font-semibold text-foreground">{name}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  {location}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemReveal} className="space-y-6">
          <Card className="portfolio-card rounded-3xl border-border/70">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Resumen ejecutivo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{summary}</p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            {focusAreas.map((area) => (
              <Card key={area.title} className="portfolio-card rounded-2xl border-border/70">
                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-lg leading-tight">{area.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>{area.description}</p>
                  <ul className="space-y-1.5">
                    {area.capabilities.map((capability) => (
                      <li key={capability} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>{capability}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {metrics.map((metric) => (
          <motion.div
            variants={itemReveal}
            key={metric.label}
            className="rounded-2xl border border-border/70 bg-card/70 p-4 backdrop-blur"
          >
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{metric.label}</p>
            <p className="mt-2 font-display text-2xl font-semibold text-foreground">{metric.value}</p>
          </motion.div>
        ))}
      </motion.div>
    </SectionBlock>
  );
}
