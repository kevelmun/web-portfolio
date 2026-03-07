import * as React from "react";
import { X, TerminalSquare } from "lucide-react";
import { projects as defaultProjects } from "@/components/portfolio/data";
import type { ProjectItem } from "@/components/portfolio/types";
import { cn } from "@/lib/utils";

interface InteractiveTerminalProps {
  onClose?: () => void;
  className?: string;
  outputClassName?: string;
  inputClassName?: string;
  promptClassName?: string;
  shellLabel?: string;
  projects?: ProjectItem[];
  initialLines?: string[];
  hideHeader?: boolean;
}

const helpOutput = [
  "╔══════════════════════════════════════════════════════════════╗",
  "║                     AVAILABLE COMMANDS                       ║",
  "╚══════════════════════════════════════════════════════════════╝",
  "",
  "  > help       :: muestra los comandos disponibles",
  "  > about      :: resumen profesional",
  "  > skills     :: stack, herramientas y fortalezas",
  "  > projects   :: proyectos destacados",
  "  > contact    :: enlaces de contacto",
  "  > whoami     :: identidad actual",
  "  > date       :: fecha del sistema",
  "  > clear      :: limpiar consola",
];

const aboutOutput = [
  "╔══════════════════════════════════════════════════════════════╗",
  "║                         ABOUT ME                             ║",
  "╚══════════════════════════════════════════════════════════════╝",
  "",
  "Kevin Elihan Muñoz Calva",
  "Co-Technical Lead · Full-Stack Engineer · AI Builder",
  "",
  "Nacido en Macará, Loja - Ecuador.",
  "Graduado de la Universidad Politécnica del Litoral.",
  "",
  "Diseño y construyo productos digitales con enfoque en escalabilidad,",
  "arquitectura clara y resultados medibles. Tengo experiencia liderando",
  "soluciones modernas basadas en microservicios, desarrollo Full-Stack,",
  "arquitecturas orientadas a eventos e integración de IA para producción.",
  "",
  "Mi stack principal gira alrededor de Laravel, Node.js y ecosistemas web",
  "modernos, combinando ingeniería de software, infraestructura y visión",
  "de producto para resolver problemas complejos de negocio.",
];

const skillsOutput = [
  "┌─ skills ─────────────────────────────────────────────────────┐",
  "│ Backend        ██████████  Laravel · Node.js · Express       │",
  "│ Frontend       █████████░  React · Next.js · Vue · Angular   │",
  "│ Architecture   █████████░  DDD · Microservices · EDA         │",
  "│ AI / Agents    ████████░░  Codex · Claude · Copilot          │",
  "│ Infra          ████████░░  Docker · Kubernetes · Dokploy     │",
  "│ Cloud          ███████░░░  Google · Oracle · AWS · Azure     │",
  "└──────────────────────────────────────────────────────────────┘",
];

const contactOutput = [
  "┌─ contact ────────────────────────────────────────────────────┐",
  "│ mail     → 3lihan.m.c@gmail.com                              │",
  "│ github   → https://github.com/kevelmun                       │",
  "│ linkedin → https://www.linkedin.com/in/kevelmun              │",
  "└──────────────────────────────────────────────────────────────┘",
];

function getProjectsOutput(projects: ProjectItem[]) {
  const hasEasterEgg = projects.some((project) => project.isEasterEgg);

  return [
    "╔══════════════════════════════════════════════════════════════╗",
    "║                      FEATURED PROJECTS                       ║",
    "╚══════════════════════════════════════════════════════════════╝",
    "",
    "  [01] Fruit-Ripeness",
    "       Computer vision aplicado al análisis de madurez.",
    "",
    "  [02] StereoThermal",
    "       Procesamiento visual y análisis térmico/estéreo.",
    "",
    "  [03] VoiceChat-AzureOllamaAgent",
    "       Agentes conversacionales e integración de IA en producción.",
    ...(hasEasterEgg
      ? [
          "",
          "  [??] Escape from the Dark (Universitario)",
          "       Videojuego plataformer en Godot :D",
        ]
      : []),
  ];
}

function isFrameLine(line: string) {
  return /^[╔╗╚╝╠╣═║┌┐└┘├┤┬┴─│\s]+$/.test(line) && line.trim().length > 0;
}

function getLineClassName(line: string) {
  if (!line.trim()) {
    return "h-3";
  }

  if (line.startsWith("$ ")) {
    return "text-primary";
  }

  if (isFrameLine(line)) {
    return "text-foreground/90";
  }

  if (line.trimStart().startsWith("> ")) {
    return "text-foreground";
  }

  return "text-foreground/90";
}

function resolveCommand(command: string, projects: ProjectItem[]): string[] {
  const normalized = command.trim().toLowerCase();

  if (!normalized) {
    return [];
  }

  if (normalized === "help") {
    return helpOutput;
  }

  if (normalized === "about") {
    return aboutOutput;
  }

  if (normalized === "skills") {
    return skillsOutput;
  }

  if (normalized === "contact") {
    return contactOutput;
  }

  if (normalized === "projects") {
    return getProjectsOutput(projects);
  }

  if (normalized === "whoami") {
    return ["kevelmun"];
  }

  if (normalized === "date") {
    return [
      new Date().toLocaleString("es-EC", {
        dateStyle: "full",
        timeStyle: "medium",
      }),
    ];
  }

  return [`Comando no reconocido: ${command}`, "Escribe 'help' para ver la lista."];
}

export function InteractiveTerminal({
  onClose,
  className,
  outputClassName,
  inputClassName,
  promptClassName,
  shellLabel = "kevelmun@portfolio:~",
  projects = defaultProjects,
  initialLines = [
    "Terminal iniciada.",
    "Escribe 'help' para comenzar.",
  ],
  hideHeader = false,
}: InteractiveTerminalProps) {
  const [command, setCommand] = React.useState("");
  const [lines, setLines] = React.useState<string[]>(initialLines);
  const outputRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  React.useEffect(() => {
    if (!outputRef.current) {
      return;
    }
    outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [lines]);

  const executeCommand = React.useCallback(() => {
    const trimmed = command.trim();
    if (!trimmed) {
      return;
    }

    if (trimmed.toLowerCase() === "clear") {
      setLines([]);
      setCommand("");
      return;
    }

    const response = resolveCommand(trimmed, projects);
    setLines((current) => [...current, `$ ${trimmed}`, ...response]);
    setCommand("");
  }, [command, projects]);

  return (
    <div
      className={cn(
        "w-[min(92vw,560px)] rounded-2xl border border-primary/30 bg-card/95 shadow-[0_20px_70px_rgba(136,57,239,0.22)] dark:shadow-[0_20px_70px_rgba(203,166,247,0.32)] backdrop-blur-xl",
        className
      )}
    >
      {hideHeader ? null : (
        <div className="flex items-center justify-between border-b border-primary/20 px-4 py-3">
          <div className="flex items-center gap-2 text-foreground">
            <TerminalSquare className="h-4 w-4" />
            <p className="font-mono text-sm">{shellLabel}</p>
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1.5 text-foreground transition-colors duration-200 hover:bg-primary/20 hover:text-foreground cursor-pointer"
              aria-label="Cerrar terminal"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      )}

      <div
        ref={outputRef}
        className={cn(
          "h-64 overflow-auto border-b border-primary/20 bg-background/65 px-4 py-3 font-mono text-[13px] leading-6",
          outputClassName
        )}
      >
        <div className="min-w-max">
          {lines.map((line, index) => (
            <div
              key={`${line}-${index}`}
              className={cn("whitespace-pre pr-4", getLineClassName(line))}
            >
              {line || " "}
            </div>
          ))}
        </div>
      </div>

      <div className={cn("flex items-center gap-2 px-4 py-3 font-mono text-sm", inputClassName)}>
        <span className={cn("text-primary", promptClassName)}>$</span>
        <input
          ref={inputRef}
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              executeCommand();
            }
          }}
          className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
          placeholder="Escribe un comando..."
          aria-label="Comando de terminal"
        />
      </div>
    </div>
  );
}
