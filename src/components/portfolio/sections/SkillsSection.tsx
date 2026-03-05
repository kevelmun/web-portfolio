import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionBlock } from "@/components/portfolio/ui/SectionBlock";
import type { SkillCategory } from "@/components/portfolio/types";

interface SkillsSectionProps {
  icon: LucideIcon;
  categories: SkillCategory[];
}

export function SkillsSection({ icon, categories }: SkillsSectionProps) {
  return (
    <SectionBlock
      id="habilidades"
      title="Stack técnico"
      description="Conjunto de herramientas que uso para construir soluciones modernas con foco en desempeño, calidad de código y escalabilidad."
      icon={icon}
    >
      <Tabs defaultValue={categories[0]?.id ?? "web"}>
        <TabsList className="h-auto w-full flex-wrap gap-2 rounded-2xl border border-border/70 bg-card/80 p-2">
          {categories.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="rounded-xl border border-transparent px-3 py-2 text-xs font-medium data-[state=active]:border-primary/30"
              >
                <CategoryIcon className="mr-1.5 h-3.5 w-3.5" />
                {category.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map((category) => {
          const CategoryIcon = category.icon;
          return (
            <TabsContent key={category.id} value={category.id} className="mt-4">
              <Card className="portfolio-card rounded-3xl border-border/70">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display text-2xl">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <CategoryIcon className="h-4 w-4" />
                    </span>
                    {category.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{category.summary}</p>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <Badge
                      key={item}
                      variant="outline"
                      className="rounded-full border border-primary/35 bg-secondary/25 px-3 py-1 text-xs text-foreground hover:bg-secondary/40"
                    >
                      {item}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </SectionBlock>
  );
}
