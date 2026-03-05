import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { itemReveal, staggerContainer } from "@/components/portfolio/motion";
import { SectionBlock } from "@/components/portfolio/ui/SectionBlock";
import type { ServiceItem } from "@/components/portfolio/types";

interface ServicesSectionProps {
  icon: LucideIcon;
  services: ServiceItem[];
}

export function ServicesSection({ icon, services }: ServicesSectionProps) {
  return (
    <SectionBlock
      id="servicios"
      title="Servicios"
      description="Soluciones digitales para negocio: desde presencia web hasta plataformas internas con arquitectura modular y preparación para escalar."
      icon={icon}
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-5 md:grid-cols-2"
      >
        {services.map((service) => (
          <motion.div key={service.title} variants={itemReveal}>
            <Card className="portfolio-card h-full rounded-3xl border-border/70">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>{service.description}</p>
                <ul className="flex flex-wrap gap-2">
                  {service.deliverables.map((deliverable) => (
                    <li
                      key={deliverable}
                      className="rounded-full border border-border/70 bg-background/85 px-3 py-1 text-xs font-medium"
                    >
                      {deliverable}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </SectionBlock>
  );
}
