import * as React from "react";
import { MessageCircle, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionBlock } from "@/components/portfolio/ui/SectionBlock";
import type { ContactChannel } from "@/components/portfolio/types";
import { cn } from "@/lib/utils";

interface ContactSectionProps {
  icon: LucideIcon;
  channels: ContactChannel[];
  location: string;
  phone: string;
}

export function ContactSection({
  icon,
  channels,
  location,
  phone,
}: ContactSectionProps) {
  const onSubmit = React.useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("nombre") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("mensaje") ?? "").trim();

    const text = `Hola Kevin, soy ${name}.\\nEmail: ${email}\\n\\nContexto del proyecto:\\n${message}`;
    const whatsappUrl = `https://wa.me/593939133960?text=${encodeURIComponent(text)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <SectionBlock
      id="contacto"
      title="Conectemos"
      description="Si tienes una vacante, propuesta o proyecto, compárteme objetivos y contexto. Podemos continuar por WhatsApp o por correo."
      icon={icon}
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="portfolio-card rounded-3xl border-border/70">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Cuéntame tu reto</CardTitle>
            <p className="text-sm text-muted-foreground">
              Respondo rápido con una propuesta de enfoque técnico y próximos pasos.
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              <Input
                name="nombre"
                placeholder="Nombre"
                required
                className="h-11 rounded-xl border-border/80 bg-background/85"
              />
              <Input
                name="email"
                type="email"
                placeholder="Correo electrónico"
                required
                className="h-11 rounded-xl border-border/80 bg-background/85"
              />
              <Textarea
                name="mensaje"
                placeholder="Describe tu proyecto, objetivos y tiempos"
                rows={6}
                required
                className="rounded-xl border-border/80 bg-background/85"
              />
              <div className="flex flex-wrap gap-3">
                <Button type="submit" className="rounded-full">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
                <a
                  href="mailto:3lihan.m.c@gmail.com"
                  className={cn(buttonVariants({ variant: "outline" }), "rounded-full border-primary/25")}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Email directo
                </a>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="portfolio-card rounded-3xl border-border/70">
            <CardHeader>
              <CardTitle className="font-display text-xl">Canales oficiales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {channels.map((channel) => {
                const ChannelIcon = channel.icon;
                return (
                  <a
                    key={channel.label}
                    href={channel.href}
                    target={channel.href.startsWith("http") ? "_blank" : undefined}
                    rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-3 rounded-xl border border-border/70 bg-background/80 px-3 py-2 transition-colors hover:border-primary/35"
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <ChannelIcon className="h-4 w-4" />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-xs uppercase tracking-[0.13em] text-muted-foreground/90">
                        {channel.label}
                      </span>
                      <span className="text-sm font-medium text-foreground">{channel.value}</span>
                    </span>
                  </a>
                );
              })}
            </CardContent>
          </Card>

          <Card className="portfolio-card rounded-3xl border-border/70">
            <CardHeader>
              <CardTitle className="font-display text-xl">Ubicación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>{location}</p>
              <p>{phone}</p>
              <p className="rounded-xl border border-primary/25 bg-primary/10 px-3 py-2 text-xs text-primary">
                Abierto a colaboración remota y proyectos internacionales.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SectionBlock>
  );
}
