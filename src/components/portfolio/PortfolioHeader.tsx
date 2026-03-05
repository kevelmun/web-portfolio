import { Cpu, Github, Linkedin, Mail, Moon, Sun } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/components/portfolio/types";

interface PortfolioHeaderProps {
  name: string;
  darkMode: boolean;
  navItems: NavItem[];
  onToggleTheme: () => void;
  social: {
    github: string;
    linkedin: string;
    email: string;
  };
}

export function PortfolioHeader({
  name,
  darkMode,
  navItems,
  onToggleTheme,
  social,
}: PortfolioHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4"
        aria-label="Navegación principal"
      >
        <a
          href="#hero"
          className="group inline-flex items-center gap-2 rounded-full border border-transparent px-2 py-1 transition-colors hover:border-primary/30"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Cpu className="h-4 w-4" />
          </span>
          <span className="font-display text-sm font-semibold tracking-wide text-foreground sm:text-base">
            {name}
          </span>
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            aria-label="Cambiar tema"
            className="rounded-full"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <a
            href={social.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "rounded-full"
            )}
          >
            <Github className="h-4 w-4" />
          </a>

          <a
            href={social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "rounded-full"
            )}
          >
            <Linkedin className="h-4 w-4" />
          </a>

          <a
            href={social.email}
            aria-label="Email"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "ml-1 hidden rounded-full px-4 sm:inline-flex"
            )}
          >
            <Mail className="mr-2 h-4 w-4" /> Contacto
          </a>
        </div>
      </nav>

      <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="whitespace-nowrap rounded-full border border-border/70 bg-card/85 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
          >
            {item.label}
          </a>
        ))}
      </div>
    </header>
  );
}
