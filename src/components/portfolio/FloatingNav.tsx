import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export interface FloatingNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface FloatingNavProps {
  visible: boolean;
  items: readonly FloatingNavItem[];
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export function FloatingNav({
  visible,
  items,
  activeSection,
  onNavigate,
}: FloatingNavProps) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="pointer-events-none fixed bottom-6 left-0 right-0 z-[80] flex justify-center px-4"
          aria-label="Navegación flotante"
        >
          <div className="pointer-events-auto flex max-w-fit items-center gap-1 overflow-x-auto rounded-full border border-border/70 bg-card/88 px-2 py-2 shadow-xl backdrop-blur-lg [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? "bg-primary/20 text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={`Ir a ${item.label}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </motion.nav>
      ) : null}
    </AnimatePresence>
  );
}
