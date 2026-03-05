import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionBlock } from "@/components/portfolio/ui/SectionBlock";
import { itemReveal, staggerContainer } from "@/components/portfolio/motion";
import type { FocusArea, MetricItem } from "@/components/portfolio/types";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
      title="Philosophy & Stack"
      description="Creating elegant solutions to complex problems."
      icon={icon}
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-6 lg:grid-cols-[0.4fr_0.6fr]"
      >
        <motion.div variants={itemReveal} className="h-full">
          <Card className="portfolio-card overflow-hidden rounded-3xl border-2 border-secondary bg-primary/20 hover:border-primary transition-colors h-full flex flex-col group">
            <CardContent className="p-0 flex flex-col h-full">
              <div className="relative flex-1 overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10"></div>
                <img
                  src="/images/Me.PNG"
                  alt="Professional photo"
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={800}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="p-6 md:p-8 bg-gradient-to-t from-background/95 to-background/80 backdrop-blur-sm">
                <p className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight">{name}</p>
                <div className="w-12 h-2 bg-primary my-3 rounded-full"></div>
                <p className="inline-flex items-center gap-2 text-base md:text-lg text-foreground/80 font-medium font-mono">
                  <MapPin className="h-5 w-5 text-primary" />
                  {location}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemReveal} className="space-y-6">
          <Card className="portfolio-card rounded-3xl border-2 border-secondary bg-background/50 p-6 md:p-8 hover:border-primary/50 transition-colors">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="font-display text-3xl font-bold tracking-tight text-foreground">
                <span className="text-primary mr-2">/</span>Core Philosophy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-xl leading-relaxed text-foreground/80 font-medium">{summary}</p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {focusAreas.map((area, i) => (
              <Card key={area.title} className={cn("portfolio-card rounded-3xl border-2 border-secondary p-6 transition-all hover:-translate-y-1 hover:border-primary", i === 2 && "md:col-span-2")}>
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="font-display text-xl font-bold tracking-tight text-foreground">{area.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4 text-sm text-foreground/70">
                  <p className="font-medium min-h-[2.5rem]">{area.description}</p>
                  <ul className="space-y-3 mt-4 pt-4 border-t border-secondary/50">
                    {area.capabilities.map((capability) => (
                      <li key={capability} className="flex items-start gap-3">
                        <span className="h-2 w-2 rounded-sm bg-primary mt-1 flex-shrink-0" />
                        <span className="font-mono text-sm leading-relaxed">{capability}</span>
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
        className="mt-6 grid gap-4 grid-cols-2 lg:grid-cols-4"
      >
        {metrics.map((metric) => (
          <motion.div
            variants={itemReveal}
            key={metric.label}
            className="rounded-3xl border-2 border-secondary bg-primary/5 p-4 sm:p-5 hover:bg-primary/10 transition-colors flex flex-col justify-end min-h-[140px] sm:min-h-[150px]"
          >
            <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground break-words">{metric.value}</p>
            <p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-primary mt-2 break-words leading-tight">{metric.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </SectionBlock>
  );
}
