import * as React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { sectionReveal } from "@/components/portfolio/motion";

interface SectionBlockProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export function SectionBlock({
  id,
  title,
  description,
  icon: Icon,
  children,
  className,
}: SectionBlockProps) {
  return (
    <motion.section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("scroll-mt-28 py-8 md:py-10", className)}
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <Icon className="h-3.5 w-3.5" />
              Sección
            </div>
            <h2
              id={`${id}-title`}
              className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              {title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              {description}
            </p>
          </div>
        </div>

        {children}
      </div>
    </motion.section>
  );
}
