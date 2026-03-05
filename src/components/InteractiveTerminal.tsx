import * as React from "react";
import { X, TerminalSquare } from "lucide-react";
import { profile, projects, skillCategories } from "@/components/portfolio/data";

interface InteractiveTerminalProps {
  onClose: () => void;
}

const availableCommands = [
  "help",
  "about",
  "skills",
  "contact",
  "projects",
  "clear",
  "whoami",
  "date",
] as const;

function resolveCommand(command: string): string[] {
  const normalized = command.trim().toLowerCase();

  if (!normalized) {
    return [];
  }

  if (normalized === "help") {
    return [
      "Comandos disponibles:",
      ...availableCommands.map((cmd) => ` - ${cmd}`),
    ];
  }

  if (normalized === "about") {
    return [profile.intro];
  }

  if (normalized === "skills") {
    return skillCategories.map(
      (category) => `${category.title}: ${category.items.slice(0, 4).join(", ")}`
    );
  }

  if (normalized === "contact") {
    return [
      `Email: ${profile.social.email.replace("mailto:", "")}`,
      `GitHub: ${profile.social.github}`,
      `LinkedIn: ${profile.social.linkedin}`,
    ];
  }

  if (normalized === "projects") {
    return projects.map((project) => ` - ${project.title}`);
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

export function InteractiveTerminal({ onClose }: InteractiveTerminalProps) {
  const [command, setCommand] = React.useState("");
  const [lines, setLines] = React.useState<string[]>([
    "Terminal iniciada.",
    "Escribe 'help' para comenzar.",
  ]);
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

    const response = resolveCommand(trimmed);
    setLines((current) => [...current, `$ ${trimmed}`, ...response]);
    setCommand("");
  }, [command]);

  return (
    <div className="w-[min(92vw,560px)] rounded-2xl border border-primary/30 bg-card/95 shadow-[0_20px_70px_rgba(136,57,239,0.22)] dark:shadow-[0_20px_70px_rgba(203,166,247,0.32)] backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-primary/20 px-4 py-3">
        <div className="flex items-center gap-2 text-foreground">
          <TerminalSquare className="h-4 w-4" />
          <p className="font-mono text-sm">kevelmun@portfolio:~</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1.5 text-foreground transition-colors duration-200 hover:bg-primary/20 hover:text-foreground cursor-pointer"
          aria-label="Cerrar terminal"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={outputRef}
        className="h-64 overflow-y-auto border-b border-primary/20 bg-background/65 px-4 py-3 font-mono text-sm"
      >
        {lines.map((line, index) => (
          <p key={`${line}-${index}`} className="mb-1 text-foreground/90">
            {line}
          </p>
        ))}
      </div>

      <div className="flex items-center gap-2 px-4 py-3 font-mono text-sm">
        <span className="text-primary">$</span>
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
