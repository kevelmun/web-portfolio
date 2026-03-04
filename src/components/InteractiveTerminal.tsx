import * as React from "react";
import { Brain, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TerminalCategory = "architecture" | "product" | "ai" | "delivery";

interface CommandDefinition {
  cmd: string;
  category: TerminalCategory;
  title: string;
}

const commands: CommandDefinition[] = [
  { cmd: "cat architecture.spec", category: "architecture", title: "Arquitectura" },
  { cmd: "cat product.stack", category: "product", title: "Producto Web" },
  { cmd: "python run_vision_ai.py", category: "ai", title: "IA Aplicada" },
  { cmd: "cat delivery.pipeline", category: "delivery", title: "Entrega" },
];

const content: Record<TerminalCategory, string[]> = {
  architecture: [
    "- Diseño de APIs orientadas a dominio",
    "- Refactor de sistemas legacy en módulos",
    "- Integración de mensajería asíncrona",
    "- Estándares de documentación técnica",
  ],
  product: [
    "- Frontend React/Next.js con UX consistente",
    "- Backends Laravel/Node.js mantenibles",
    "- Integración de auth, caché y testing",
    "- Optimización para rendimiento y SEO",
  ],
  ai: [
    "- Visión por computadora para escenarios reales",
    "- Pipelines de preparación de datos",
    "- Entrenamiento y evaluación de modelos",
    "- Integración pragmática de LLMs",
  ],
  delivery: [
    "- Contenedores Docker para entornos homogéneos",
    "- CI/CD para despliegues repetibles",
    "- Observabilidad para diagnóstico temprano",
    "- Enfoque en confiabilidad operacional",
  ],
};

export function InteractiveTerminal({ darkMode }: { darkMode: boolean }) {
  const [activeCategory, setActiveCategory] =
    React.useState<TerminalCategory>("architecture");
  const [displayedLines, setDisplayedLines] = React.useState<string[]>([]);
  const [isTyping, setIsTyping] = React.useState(false);

  React.useEffect(() => {
    const selectedCommand = commands.find((command) => command.category === activeCategory);
    if (!selectedCommand) {
      return;
    }

    setIsTyping(true);
    setDisplayedLines([`$ ${selectedCommand.cmd}`]);

    const lines = content[activeCategory];
    let lineIndex = 0;

    const timer = window.setInterval(() => {
      if (lineIndex >= lines.length) {
        setIsTyping(false);
        window.clearInterval(timer);
        return;
      }

      const line = lines[lineIndex];
      setDisplayedLines((current) => [...current, line]);
      lineIndex += 1;
    }, 160);

    return () => window.clearInterval(timer);
  }, [activeCategory]);

  return (
    <Card
      className={cn(
        "overflow-hidden rounded-[1.75rem] border shadow-2xl",
        darkMode
          ? "border-cyan-400/20 bg-slate-950/90 text-slate-100"
          : "border-slate-300/80 bg-slate-50/95 text-slate-800"
      )}
    >
      <CardHeader
        className={cn(
          "border-b pb-3",
          darkMode
            ? "border-cyan-400/15 bg-gradient-to-r from-slate-950 to-slate-900"
            : "border-slate-300/80 bg-gradient-to-r from-slate-100 to-white"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </div>
            <span className={cn("ml-2 font-mono text-xs", darkMode ? "text-cyan-200/80" : "text-slate-600")}>
              kevin@portfolio:~
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Terminal className={cn("h-4 w-4", darkMode ? "text-cyan-300/70" : "text-slate-500")} />
            <Brain className={cn("h-4 w-4", darkMode ? "text-cyan-300/70" : "text-slate-500")} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-5">
        <div className="flex flex-wrap gap-2">
          {commands.map((command) => (
            <Button
              key={command.category}
              size="sm"
              variant={activeCategory === command.category ? "secondary" : "outline"}
              onClick={() => setActiveCategory(command.category)}
              className={cn(
                "rounded-full px-3 font-mono text-xs",
                activeCategory === command.category
                  ? darkMode
                    ? "border-cyan-300/35 bg-cyan-500/20 text-cyan-100 hover:bg-cyan-500/30"
                    : "border-cyan-500/30 bg-cyan-500/10 text-cyan-800 hover:bg-cyan-500/20"
                  : darkMode
                    ? "border-slate-700 bg-slate-900/80 text-slate-300 hover:bg-slate-800"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              )}
            >
              {command.title}
            </Button>
          ))}
        </div>

        <div
          className={cn(
            "min-h-[188px] rounded-2xl border p-4 font-mono text-sm",
            darkMode
              ? "border-slate-800 bg-black/65"
              : "border-slate-300 bg-white"
          )}
        >
          {displayedLines.map((line, index) => (
            <p
              key={`${line}-${index}`}
              className={cn(
                "mb-1.5 leading-relaxed",
                index === 0
                  ? darkMode
                    ? "text-cyan-300"
                    : "text-cyan-700"
                  : darkMode
                    ? "text-slate-200"
                    : "text-slate-700"
              )}
            >
              {line}
              {index === displayedLines.length - 1 && isTyping ? (
                <span className={cn("ml-1 inline-block h-4 w-1 animate-pulse", darkMode ? "bg-cyan-300" : "bg-cyan-700")} />
              ) : null}
            </p>
          ))}

          {!isTyping && displayedLines.length > 0 ? (
            <p className={cn("font-mono text-sm", darkMode ? "text-cyan-300" : "text-cyan-700")}>$ <span className="animate-pulse">▊</span></p>
          ) : null}
        </div>

        <p className={cn("text-center text-xs", darkMode ? "text-slate-400" : "text-slate-600")}>
          Cambia de comando para explorar mis áreas principales de trabajo.
        </p>
      </CardContent>
    </Card>
  );
}
