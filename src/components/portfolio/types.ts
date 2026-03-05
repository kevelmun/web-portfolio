import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: `#${string}`;
}

export interface FocusArea {
  title: string;
  description: string;
  capabilities: string[];
}

export interface MetricItem {
  label: string;
  value: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  deliverables: string[];
}

export interface ProjectItem {
  title: string;
  description: string;
  tags: string[];
  codeUrl: string;
  impact: string;
  icon: LucideIcon;
  isEasterEgg?: boolean;
  actionLabel?: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  bullets: string[];
}

export interface SkillCategory {
  id: string;
  label: string;
  title: string;
  summary: string;
  icon: LucideIcon;
  items: string[];
}

export interface ContactChannel {
  label: string;
  value: string;
  href: string;
  icon: LucideIcon;
}
