import * as React from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Files,
  GitBranch,
  Moon,
  Play,
  Search,
  Settings,
  Sun,
  TerminalSquare,
  User,
  X,
} from "lucide-react";
import { InteractiveTerminal } from "@/components/InteractiveTerminal";
import {
  contactChannels,
  experiences,
  focusAreas,
  heroTags,
  profile,
  serviceItems,
  skillCategories,
} from "@/components/portfolio/data";
import type { ProjectItem } from "@/components/portfolio/types";
import { cn } from "@/lib/utils";

type MobileOverlay = "explorer" | "terminal" | null;
type DocumentGroup = "root" | "workspace";
type DocumentLanguage = "js" | "py" | "go" | "ts" | "json" | "sh" | "md";

interface WorkspaceDocument {
  id: string;
  filename: string;
  language: DocumentLanguage;
  group: DocumentGroup;
  path: string[];
  lines: string[];
}

interface IdeWorkspaceProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  visibleProjects: ProjectItem[];
  konamiActivated: boolean;
  onReturnToMain: () => void;
}

const menuItems = ["File", "Edit", "Selection", "View", "Go", "Run", "Terminal"] as const;
const terminalTabs = ["PROBLEMS", "OUTPUT", "DEBUG CONSOLE", "TERMINAL", "PORTS"] as const;
const tabsDropzoneId = "tabs-dropzone";

function getExplorerDragId(documentId: string) {
  return `explorer:${documentId}`;
}

function getTabDragId(documentId: string) {
  return `tab:${documentId}`;
}

const activityButtons: Array<{
  id: "files" | "search" | "git" | "run";
  label: string;
  icon: LucideIcon;
}> = [
  { id: "files", label: "Explorer", icon: Files },
  { id: "search", label: "Search", icon: Search },
  { id: "git", label: "Source Control", icon: GitBranch },
  { id: "run", label: "Run", icon: Play },
];

function escapeValue(value: string) {
  return JSON.stringify(value);
}

function formatList(values: string[]) {
  return `[${values.map((value) => escapeValue(value)).join(", ")}]`;
}

function createWorkspaceDocuments(visibleProjects: ProjectItem[]): WorkspaceDocument[] {
  return [
    {
      id: "about",
      filename: "AboutMe.js",
      language: "js",
      group: "root",
      path: ["PORTFOLIO", "AboutMe.js"],
      lines: [
        "/**",
        ` * ${profile.headline}`,
        ` * ${profile.intro}`,
        " */",
        "",
        "const developer = {",
        `  name: ${escapeValue(profile.name)},`,
        `  role: ${escapeValue(profile.headline)},`,
        `  location: ${escapeValue(profile.location)},`,
        `  availability: ${escapeValue(profile.availability)},`,
        `  focus: ${formatList(heroTags)},`,
        "};",
        "",
        "export default function getBio() {",
        `  return ${escapeValue(profile.intro)};`,
        "}",
      ],
    },
    {
      id: "projects",
      filename: "Projects.py",
      language: "py",
      group: "root",
      path: ["PORTFOLIO", "Projects.py"],
      lines: [
        "projects = [",
        ...visibleProjects.flatMap((project, index) => [
          "    {",
          `        "title": ${escapeValue(project.title)},`,
          `        "stack": ${formatList(project.tags)},`,
          `        "impact": ${escapeValue(project.impact)},`,
          `        "url": ${escapeValue(project.codeUrl)},`,
          `        "bonus": ${project.isEasterEgg ? "True" : "False"},`,
          "    }" + (index < visibleProjects.length - 1 ? "," : ""),
        ]),
        "]",
        "",
        "def list_titles():",
        '    return [project["title"] for project in projects]',
      ],
    },
    {
      id: "experience",
      filename: "Experience.go",
      language: "go",
      group: "root",
      path: ["PORTFOLIO", "Experience.go"],
      lines: [
        "package portfolio",
        "",
        "type Experience struct {",
        "    Role    string",
        "    Company string",
        "    Period  string",
        "    Bullets []string",
        "}",
        "",
        "var Timeline = []Experience{",
        ...experiences.flatMap((experience, index) => [
          "    {",
          `        Role: ${escapeValue(experience.role)},`,
          `        Company: ${escapeValue(experience.company)},`,
          `        Period: ${escapeValue(experience.period)},`,
          `        Bullets: ${formatList(experience.bullets)},`,
          "    }" + (index < experiences.length - 1 ? "," : ""),
        ]),
        "}",
      ],
    },
    {
      id: "skills",
      filename: "Skills.ts",
      language: "ts",
      group: "workspace",
      path: ["PORTFOLIO", "workspace", "Skills.ts"],
      lines: [
        "export const skills = {",
        ...skillCategories.flatMap((category, index) => [
          `  ${category.id}: {`,
          `    title: ${escapeValue(category.title)},`,
          `    summary: ${escapeValue(category.summary)},`,
          `    items: ${formatList(category.items)},`,
          "  }" + (index < skillCategories.length - 1 ? "," : ""),
        ]),
        "};",
      ],
    },
    {
      id: "services",
      filename: "Services.json",
      language: "json",
      group: "workspace",
      path: ["PORTFOLIO", "workspace", "Services.json"],
      lines: [
        "{",
        '  "services": [',
        ...serviceItems.flatMap((service, index) => [
          "    {",
          `      "title": ${escapeValue(service.title)},`,
          `      "description": ${escapeValue(service.description)},`,
          `      "deliverables": ${formatList(service.deliverables)}`,
          "    }" + (index < serviceItems.length - 1 ? "," : ""),
        ]),
        "  ]",
        "}",
      ],
    },
    {
      id: "contact",
      filename: "Contact.sh",
      language: "sh",
      group: "workspace",
      path: ["PORTFOLIO", "workspace", "Contact.sh"],
      lines: [
        "#!/usr/bin/env bash",
        "",
        `export EMAIL=${escapeValue(profile.social.email.replace("mailto:", ""))}`,
        `export GITHUB=${escapeValue(profile.social.github)}`,
        `export LINKEDIN=${escapeValue(profile.social.linkedin)}`,
        `export CV_URL=${escapeValue(profile.cvUrl)}`,
        "",
        ...contactChannels.map(
          (channel) => `${channel.label.toUpperCase()}=${escapeValue(channel.href)}`
        ),
      ],
    },
    {
      id: "resume",
      filename: "Resume.md",
      language: "md",
      group: "workspace",
      path: ["PORTFOLIO", "workspace", "Resume.md"],
      lines: [
        "# Resume Snapshot",
        "",
        `- Name: ${profile.name}`,
        `- Location: ${profile.location}`,
        `- Availability: ${profile.availability}`,
        "",
        "## Focus Areas",
        ...focusAreas.map((area) => `- ${area.title}: ${area.description}`),
      ],
    },
  ];
}

function getLanguageBadge(language: DocumentLanguage) {
  switch (language) {
    case "js":
      return { label: "JS", className: "bg-[var(--ide-badge-js-bg)] text-[var(--ide-badge-js-text)]" };
    case "py":
      return { label: "PY", className: "bg-[var(--ide-badge-py-bg)] text-[var(--ide-badge-py-text)]" };
    case "go":
      return { label: "GO", className: "bg-[var(--ide-badge-go-bg)] text-[var(--ide-badge-go-text)]" };
    case "ts":
      return { label: "TS", className: "bg-[var(--ide-badge-ts-bg)] text-[var(--ide-badge-ts-text)]" };
    case "json":
      return { label: "{}", className: "bg-[var(--ide-badge-json-bg)] text-[var(--ide-badge-json-text)]" };
    case "sh":
      return { label: "SH", className: "bg-[var(--ide-badge-sh-bg)] text-[var(--ide-badge-sh-text)]" };
    case "md":
      return { label: "MD", className: "bg-[var(--ide-badge-md-bg)] text-[var(--ide-badge-md-text)]" };
    default:
      return { label: "FILE", className: "bg-[var(--ide-badge-js-bg)] text-[var(--ide-badge-js-text)]" };
  }
}

function highlightPlainSegment(segment: string, key: string) {
  const propertyPattern = /([A-Za-z_][\w-]*)(?=\s*:)/g;
  const fragments: React.ReactNode[] = [];
  let lastIndex = 0;

  segment.replace(propertyPattern, (match, _group, offset) => {
    if (offset > lastIndex) {
      fragments.push(segment.slice(lastIndex, offset));
    }

    fragments.push(
      <span key={`${key}-property-${offset}`} className="text-[var(--ide-token-property)]">
        {match}
      </span>
    );

    lastIndex = offset + match.length;
    return match;
  });

  if (lastIndex < segment.length) {
    fragments.push(segment.slice(lastIndex));
  }

  return fragments.length > 0 ? fragments : [segment];
}

function renderHighlightedLine(line: string, lineNumber: number) {
  const trimmed = line.trim();

  if (
    trimmed.startsWith("/**") ||
    trimmed.startsWith("*/") ||
    trimmed.startsWith("*") ||
    trimmed.startsWith("#")
  ) {
    return (
      <div className="ide-code-line grid grid-cols-[46px_minmax(0,1fr)] gap-4 px-5 py-1.5">
        <span className="select-none text-right font-mono text-xs text-[var(--ide-line-number)]">
          {lineNumber}
        </span>
        <code className="block whitespace-pre-wrap break-words font-mono text-[14px] italic text-[var(--ide-token-comment)]">
          {line || " "}
        </code>
      </div>
    );
  }

  const tokenPattern =
    /(".*?"|'.*?'|`.*?`|\b(?:export|default|function|const|return|package|type|var|def|True|False)\b|\b\d+\b)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let matchIndex = 0;

  line.replace(tokenPattern, (match, _group, offset) => {
    const segment = line.slice(lastIndex, offset);
    if (segment) {
      parts.push(...highlightPlainSegment(segment, `${lineNumber}-${matchIndex}`));
    }

    let className = "text-[var(--ide-text)]";

    if (/^["'`]/.test(match)) {
      className = "text-[var(--ide-token-string)]";
    } else if (/^\d+$/.test(match)) {
      className = "text-[var(--ide-token-number)]";
    } else {
      className = "text-[var(--ide-token-keyword)]";
    }

    parts.push(
      <span key={`${lineNumber}-token-${matchIndex}`} className={className}>
        {match}
      </span>
    );

    lastIndex = offset + match.length;
    matchIndex += 1;
    return match;
  });

  if (lastIndex < line.length) {
    parts.push(...highlightPlainSegment(line.slice(lastIndex), `${lineNumber}-tail`));
  }

  return (
    <div className="ide-code-line grid grid-cols-[46px_minmax(0,1fr)] gap-4 px-5 py-1.5">
      <span className="select-none text-right font-mono text-xs text-[var(--ide-line-number)]">
        {lineNumber}
      </span>
      <code className="block whitespace-pre-wrap break-words font-mono text-[14px] text-[var(--ide-text)]">
        {parts.length > 0 ? parts : " "}
      </code>
    </div>
  );
}

function ExplorerItem({
  document,
  active,
  onOpen,
}: {
  document: WorkspaceDocument;
  active: boolean;
  onOpen: (id: string) => void;
}) {
  const badge = getLanguageBadge(document.language);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: getExplorerDragId(document.id),
    data: {
      source: "explorer",
      documentId: document.id,
    },
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={() => onOpen(document.id)}
      style={{
        transform: CSS.Translate.toString(transform),
      }}
      className={cn(
        "ide-explorer-item flex w-full cursor-pointer items-center gap-3 border-l-2 px-3 py-2 text-left transition-colors duration-150 touch-none",
        active
          ? "border-[var(--ide-active)] bg-[var(--ide-explorer-active)] text-[var(--ide-text)]"
          : "border-transparent text-[var(--ide-muted)] hover:bg-[var(--ide-hover)] hover:text-[var(--ide-text)]",
        isDragging && "z-[3] opacity-70 shadow-[0_18px_30px_rgba(15,23,42,0.18)]"
      )}
      {...attributes}
      {...listeners}
    >
      <span
        className={cn(
          "inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-sm text-[9px] font-bold uppercase tracking-[0.08em]",
          badge.className
        )}
      >
        {badge.label}
      </span>
      <span className="truncate text-[15px]">{document.filename}</span>
    </button>
  );
}

function SortableTab({
  document,
  active,
  canClose,
  onSelect,
  onClose,
}: {
  document: WorkspaceDocument;
  active: boolean;
  canClose: boolean;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
}) {
  const badge = getLanguageBadge(document.language);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: getTabDragId(document.id),
    data: {
      source: "tabs",
      documentId: document.id,
    },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 2 : undefined,
      }}
      className={cn("shrink-0", isDragging && "opacity-80")}
    >
      <button
        type="button"
        onClick={() => onSelect(document.id)}
        className={cn(
          "ide-tab relative inline-flex cursor-pointer items-center gap-3 border-r border-[var(--ide-border)] px-5 py-4 text-left text-[15px] transition-colors duration-150 touch-none",
          active
            ? "bg-[var(--ide-tab-active)] text-[var(--ide-text)]"
            : "bg-[var(--ide-tab)] text-[var(--ide-muted)] hover:bg-[var(--ide-hover)] hover:text-[var(--ide-text)]",
          isDragging && "shadow-[0_16px_30px_rgba(15,23,42,0.18)]"
        )}
        {...attributes}
        {...listeners}
      >
        {active ? <span className="absolute left-0 top-0 h-[2px] w-full bg-[var(--ide-active)]" /> : null}
        <span
          className={cn(
            "inline-flex h-[18px] w-[18px] items-center justify-center rounded-sm text-[9px] font-bold uppercase tracking-[0.08em]",
            badge.className
          )}
        >
          {badge.label}
        </span>
        <span>{document.filename}</span>
        {canClose ? (
          <span
            role="button"
            tabIndex={0}
            onClick={(event) => {
              event.stopPropagation();
              onClose(document.id);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                event.stopPropagation();
                onClose(document.id);
              }
            }}
            className="inline-flex h-5 w-5 items-center justify-center rounded-sm text-[var(--ide-muted)] transition-colors duration-150 hover:bg-[var(--ide-hover)] hover:text-[var(--ide-text)]"
            aria-label={`Cerrar ${document.filename}`}
          >
            <X className="h-3.5 w-3.5" />
          </span>
        ) : null}
      </button>
    </div>
  );
}

export function IdeWorkspace({
  darkMode,
  toggleDarkMode,
  visibleProjects,
  konamiActivated,
  onReturnToMain,
}: IdeWorkspaceProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const documents = React.useMemo(() => createWorkspaceDocuments(visibleProjects), [visibleProjects]);
  const documentsById = React.useMemo(
    () => new Map(documents.map((document) => [document.id, document])),
    [documents]
  );

  const [mobileOverlay, setMobileOverlay] = React.useState<MobileOverlay>(null);
  const [workspaceOpen, setWorkspaceOpen] = React.useState(true);
  const [openDocumentIds, setOpenDocumentIds] = React.useState<string[]>(["about", "projects", "experience"]);
  const [activeDocumentId, setActiveDocumentId] = React.useState("about");
  const [terminalVisible, setTerminalVisible] = React.useState(true);
  const { isOver: isTabsDropzoneOver, setNodeRef: setTabsDropzoneRef } = useDroppable({
    id: tabsDropzoneId,
  });
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  React.useEffect(() => {
    setOpenDocumentIds((current) => current.filter((docId) => documentsById.has(docId)));

    if (!documentsById.has(activeDocumentId) && documents[0]) {
      setActiveDocumentId(documents[0].id);
    }
  }, [activeDocumentId, documents, documentsById]);

  const activeDocument = documentsById.get(activeDocumentId) ?? documents[0];
  const openDocuments = openDocumentIds
    .map((documentId) => documentsById.get(documentId))
    .filter((document): document is WorkspaceDocument => Boolean(document));
  const openDocumentDragIds = React.useMemo(
    () => openDocumentIds.map((documentId) => getTabDragId(documentId)),
    [openDocumentIds]
  );
  const rootDocuments = documents.filter((document) => document.group === "root");
  const workspaceDocuments = documents.filter((document) => document.group === "workspace");

  const openDocument = React.useCallback(
    (documentId: string) => {
      setOpenDocumentIds((current) => (current.includes(documentId) ? current : [...current, documentId]));
      setActiveDocumentId(documentId);
      setMobileOverlay(null);
    },
    []
  );

  const closeDocument = React.useCallback(
    (documentId: string) => {
      setOpenDocumentIds((current) => {
        const next = current.filter((id) => id !== documentId);
        if (next.length === 0 && documents[0]) {
          setActiveDocumentId(documents[0].id);
          return [documents[0].id];
        }

        if (activeDocumentId === documentId) {
          setActiveDocumentId(next[next.length - 1]);
        }

        return next;
      });
    },
    [activeDocumentId, documents]
  );

  const handleTabDragEnd = React.useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeDocumentId = String(active.data.current?.documentId ?? active.id);
    const overDocumentId = over.id === tabsDropzoneId ? null : String(over.data.current?.documentId ?? over.id);
    const source = active.data.current?.source;

    if (source === "explorer") {
      setOpenDocumentIds((current) => {
        const withoutDraggedDocument = current.filter((id) => id !== activeDocumentId);

        if (over.id === tabsDropzoneId) {
          return [...withoutDraggedDocument, activeDocumentId];
        }

        const overIndex = overDocumentId ? withoutDraggedDocument.indexOf(overDocumentId) : -1;
        if (overIndex < 0) {
          return [...withoutDraggedDocument, activeDocumentId];
        }

        const next = [...withoutDraggedDocument];
        next.splice(overIndex + 1, 0, activeDocumentId);
        return next;
      });

      setActiveDocumentId(activeDocumentId);
      setMobileOverlay(null);
      return;
    }

    if (activeDocumentId === overDocumentId) {
      return;
    }

    setOpenDocumentIds((current) => {
      const oldIndex = current.indexOf(activeDocumentId);

      if (oldIndex < 0) {
        return current;
      }

      if (over.id === tabsDropzoneId) {
        return arrayMove(current, oldIndex, current.length - 1);
      }

      const newIndex = overDocumentId ? current.indexOf(overDocumentId) : -1;
      if (newIndex < 0) {
        return current;
      }

      return arrayMove(current, oldIndex, newIndex);
    });
  }, []);

  if (!activeDocument) {
    return null;
  }

  return (
    <div className="ide-workspace h-screen overflow-hidden">
      <motion.div
        initial={prefersReducedMotion ? undefined : { opacity: 0 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1 }}
        transition={prefersReducedMotion ? undefined : { duration: 0.24 }}
        className="flex h-screen flex-col overflow-hidden"
      >
        <header className="ide-menubar">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={onReturnToMain}
              className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-[var(--ide-muted)] transition-colors duration-150 hover:text-[var(--ide-text)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <div className="hidden items-center gap-5 md:flex">
              {menuItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="cursor-pointer text-sm text-[var(--ide-muted)] transition-colors duration-150 hover:text-[var(--ide-text)]"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden truncate px-4 text-sm text-[var(--ide-muted)] md:block">
            IDE Workspace Portfolio Concept
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOverlay("explorer")}
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-transparent text-[var(--ide-muted)] transition-colors duration-150 hover:border-[var(--ide-border)] hover:text-[var(--ide-text)] lg:hidden"
              aria-label="Abrir explorer"
            >
              <Files className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={toggleDarkMode}
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-transparent text-[var(--ide-muted)] transition-colors duration-150 hover:border-[var(--ide-border)] hover:text-[var(--ide-text)]"
              aria-label="Cambiar tema"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <div className="flex items-center gap-2">
              <span className="ide-window-dot" />
              <span className="ide-window-dot" />
              <span className="ide-window-dot" />
            </div>
          </div>
        </header>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleTabDragEnd}>
          <div className="flex min-h-0 flex-1 overflow-hidden">
          <aside className="hidden w-14 shrink-0 border-r border-[var(--ide-border)] bg-[var(--ide-activity-bar)] lg:flex lg:flex-col lg:items-center lg:justify-between lg:py-3">
            <div className="flex flex-col gap-1.5">
              {activityButtons.map((button, index) => {
                const Icon = button.icon;
                const active = index === 0;

                return (
                  <button
                    key={button.id}
                    type="button"
                    className={cn(
                      "ide-activity-button relative inline-flex h-12 w-12 cursor-pointer items-center justify-center text-[var(--ide-muted)] transition-colors duration-150 hover:text-[var(--ide-text)]",
                      active && "text-[var(--ide-active)]"
                    )}
                    aria-label={button.label}
                    title={button.label}
                  >
                    {active ? <span className="absolute left-0 top-2 bottom-2 w-[2px] bg-[var(--ide-active)]" /> : null}
                    <Icon className="h-5 w-5" />
                    {button.id === "git" ? (
                      <span className="absolute right-2 top-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--ide-accent-soft)] px-1 text-[10px] font-bold text-[var(--ide-active)]">
                        3
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                className="inline-flex h-12 w-12 cursor-pointer items-center justify-center text-[var(--ide-muted)] transition-colors duration-150 hover:text-[var(--ide-text)]"
                aria-label="Cuenta"
              >
                <User className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="inline-flex h-12 w-12 cursor-pointer items-center justify-center text-[var(--ide-muted)] transition-colors duration-150 hover:text-[var(--ide-text)]"
                aria-label="Ajustes"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </aside>

          <aside className="hidden w-[310px] shrink-0 border-r border-[var(--ide-border)] bg-[var(--ide-sidebar)] lg:flex lg:min-h-0 lg:flex-col">
            <div className="flex items-center justify-between px-6 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ide-muted)]">
                Explorer
              </p>
              <button
                type="button"
                className="cursor-pointer text-[var(--ide-muted)] transition-colors duration-150 hover:text-[var(--ide-text)]"
                aria-label="Opciones del explorer"
              >
                ...
              </button>
            </div>

            <div className="ide-scrollbar min-h-0 flex-1 overflow-y-auto pb-4">
              <div className="px-4">
                <div className="mb-2 flex items-center gap-2 px-3 text-[12px] font-semibold text-[var(--ide-text)]">
                  <ChevronDown className="h-4 w-4 text-[var(--ide-muted)]" />
                  PORTFOLIO
                </div>
                {rootDocuments.map((document) => (
                  <ExplorerItem
                    key={document.id}
                    document={document}
                    active={activeDocument.id === document.id}
                    onOpen={openDocument}
                  />
                ))}

                <button
                  type="button"
                  onClick={() => setWorkspaceOpen((current) => !current)}
                  className="mt-3 flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-[12px] font-semibold text-[var(--ide-muted)] transition-colors duration-150 hover:text-[var(--ide-text)]"
                >
                  {workspaceOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  workspace
                </button>
                {workspaceOpen ? (
                  <div className="pl-4">
                    {workspaceDocuments.map((document) => (
                      <ExplorerItem
                        key={document.id}
                        document={document}
                        active={activeDocument.id === document.id}
                        onOpen={openDocument}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </aside>

          <main className="flex min-w-0 min-h-0 flex-1 flex-col overflow-hidden bg-[var(--ide-editor-bg)]">
              <SortableContext items={openDocumentDragIds} strategy={horizontalListSortingStrategy}>
                <div
                  ref={setTabsDropzoneRef}
                  className={cn(
                    "ide-scrollbar flex items-end overflow-x-auto border-b border-[var(--ide-border)] bg-[var(--ide-tabs-bg)] transition-colors duration-150",
                    isTabsDropzoneOver && "bg-[var(--ide-hover)]"
                  )}
                >
                  {openDocuments.map((document) => (
                    <SortableTab
                      key={document.id}
                      document={document}
                      active={activeDocument.id === document.id}
                      canClose={openDocuments.length > 1}
                      onSelect={setActiveDocumentId}
                      onClose={closeDocument}
                    />
                  ))}
                </div>
              </SortableContext>

            <div className="border-b border-[var(--ide-border)] bg-[var(--ide-breadcrumb-bg)] px-6 py-3 text-[13px] text-[var(--ide-muted)]">
              {activeDocument.path.map((part, index) => (
                <React.Fragment key={`${part}-${index}`}>
                  <span className={index === activeDocument.path.length - 1 ? "text-[var(--ide-text)]" : undefined}>
                    {part}
                  </span>
                  {index < activeDocument.path.length - 1 ? " > " : null}
                </React.Fragment>
              ))}
            </div>

            <div className="ide-scrollbar flex-1 overflow-auto bg-[var(--ide-editor)]">
              <div className="min-w-[720px] py-6">
                {activeDocument.lines.map((line, index) => (
                  <React.Fragment key={`${activeDocument.id}-${index}`}>
                    {renderHighlightedLine(line, index + 1)}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <AnimatePresence initial={false}>
              {terminalVisible ? (
                <motion.div
                  initial={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                  animate={prefersReducedMotion ? undefined : { height: "auto", opacity: 1 }}
                  exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                  className="border-t border-[var(--ide-border)] bg-[var(--ide-terminal-shell)]"
                >
                  <div className="ide-scrollbar flex items-center gap-6 overflow-x-auto border-b border-[var(--ide-border)] px-6 py-2">
                    {terminalTabs.map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        className={cn(
                          "cursor-pointer whitespace-nowrap border-b-2 px-0 py-1 text-[12px] tracking-[0.04em] transition-colors duration-150",
                          tab === "TERMINAL"
                            ? "border-[var(--ide-active)] text-[var(--ide-text)]"
                            : "border-transparent text-[var(--ide-muted)] hover:text-[var(--ide-text)]"
                        )}
                      >
                        {tab}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setTerminalVisible(false)}
                      className="ml-auto inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm text-[var(--ide-muted)] transition-colors duration-150 hover:bg-[var(--ide-hover)] hover:text-[var(--ide-text)]"
                      aria-label="Ocultar terminal"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <InteractiveTerminal
                    className="!w-full !rounded-none !border-0 !bg-transparent !shadow-none"
                    outputClassName="h-44 border-b border-[var(--ide-border)] bg-transparent px-6 py-4 text-[13px]"
                    inputClassName="px-6 py-3"
                    promptClassName="text-[var(--ide-terminal-prompt)]"
                    shellLabel="kevelmun@portfolio:~"
                    initialLines={[
                      "kevelmun@portfolio:~$ npm run dev",
                      "> portfolio-react@0.0.0 dev",
                      "> vite --host 0.0.0.0",
                      "Local: http://localhost:5173/",
                      konamiActivated
                        ? "Bonus project unlocked and mounted in Projects.py"
                        : "Workspace ready. Usa 'projects' o 'contact'.",
                    ]}
                    projects={visibleProjects}
                    hideHeader
                  />
                </motion.div>
              ) : (
                <button
                  type="button"
                  onClick={() => setTerminalVisible(true)}
                  className="flex h-11 cursor-pointer items-center gap-2 border-t border-[var(--ide-border)] px-6 text-[13px] text-[var(--ide-muted)] transition-colors duration-150 hover:bg-[var(--ide-hover)] hover:text-[var(--ide-text)]"
                >
                  <TerminalSquare className="h-4 w-4" />
                  Show terminal
                </button>
              )}
            </AnimatePresence>
          </main>
          </div>
        </DndContext>

        <footer className="ide-statusbar ide-scrollbar overflow-x-auto">
          <div className="flex flex-nowrap items-center gap-6 whitespace-nowrap">
            <span>main*</span>
            <span>{activeDocument.filename}</span>
            <span>{darkMode ? "Dark" : "Light"} Theme</span>
          </div>
          <div className="flex flex-nowrap items-center gap-6 whitespace-nowrap">
            <span>UTF-8</span>
            <span>LF</span>
            <span>{activeDocument.language.toUpperCase()}</span>
          </div>
        </footer>
      </motion.div>

      <AnimatePresence>
        {mobileOverlay === "explorer" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-[rgba(15,23,42,0.56)] lg:hidden"
          >
            <button
              type="button"
              onClick={() => setMobileOverlay(null)}
              className="absolute inset-0 cursor-pointer"
              aria-label="Cerrar explorer"
            />
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="relative h-full w-[320px] max-w-[86vw] border-r border-[var(--ide-border)] bg-[var(--ide-sidebar)]"
            >
              <div className="flex items-center justify-between px-5 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ide-muted)]">
                  Explorer
                </p>
                <button
                  type="button"
                  onClick={() => setMobileOverlay(null)}
                  className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-transparent text-[var(--ide-muted)] transition-colors duration-150 hover:border-[var(--ide-border)] hover:text-[var(--ide-text)]"
                  aria-label="Cerrar explorer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="ide-scrollbar overflow-y-auto pb-4">
                <div className="px-4">
                  <div className="mb-2 flex items-center gap-2 px-3 text-[12px] font-semibold text-[var(--ide-text)]">
                    <ChevronDown className="h-4 w-4 text-[var(--ide-muted)]" />
                    PORTFOLIO
                  </div>
                  {rootDocuments.map((document) => (
                    <ExplorerItem
                      key={document.id}
                      document={document}
                      active={activeDocument.id === document.id}
                      onOpen={openDocument}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => setWorkspaceOpen((current) => !current)}
                    className="mt-3 flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-[12px] font-semibold text-[var(--ide-muted)] transition-colors duration-150 hover:text-[var(--ide-text)]"
                  >
                    {workspaceOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    workspace
                  </button>
                  {workspaceOpen ? (
                    <div className="pl-4">
                      {workspaceDocuments.map((document) => (
                        <ExplorerItem
                          key={document.id}
                          document={document}
                          active={activeDocument.id === document.id}
                          onOpen={openDocument}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
