import { motion } from "framer-motion";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InteractiveTerminal } from "@/components/InteractiveTerminal";
import { itemReveal, staggerContainer } from "@/components/portfolio/motion";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  darkMode: boolean;
  headline: string;
  intro: string;
  availability: string;
  tags: string[];
}

export function HeroSection({
  darkMode,
  headline,
  intro,
  availability,
  tags,
}: HeroSectionProps) {
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative overflow-hidden py-20 md:py-28">
      <div className="hero-noise pointer-events-none absolute inset-0" />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-[1.08fr_0.92fr]">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          <motion.div variants={itemReveal}>
            <Badge className="rounded-full border border-primary/20 bg-primary/15 px-4 py-1 text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              {availability}
            </Badge>
          </motion.div>

          <motion.h1
            variants={itemReveal}
            id="hero-title"
            className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl"
          >
            {headline}
          </motion.h1>

          <motion.p variants={itemReveal} className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            {intro}
          </motion.p>

          <motion.div variants={itemReveal} className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border/80 bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.div variants={itemReveal} className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#proyectos" className={cn(buttonVariants({ variant: "default" }), "rounded-full px-5")}> 
              Explorar proyectos
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a
              href="/cv-kevin-munoz.pdf"
              download="CV-Kevin-Munoz.pdf"
              className={cn(buttonVariants({ variant: "outline" }), "rounded-full border-primary/30 bg-transparent px-5")}
            >
              <Download className="mr-2 h-4 w-4" />
              Descargar CV
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary/20 via-secondary/25 to-transparent blur-2xl" />
          <div className="relative">
            <InteractiveTerminal darkMode={darkMode} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
