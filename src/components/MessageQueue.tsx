import * as React from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  Activity,
  Database,
  Mail,
  Minimize2,
  Rabbit,
  Settings,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

type MsgType = "auth" | "email" | "data";
type MsgStatus = "published" | "exchange" | "queued" | "processing" | "done";

interface Message {
  id: string;
  type: MsgType;
  status: MsgStatus;
}

const TYPE_LABELS: Record<MsgType, string> = {
  auth: "Auth",
  email: "Email",
  data: "Data",
};

const THEME = {
  auth: {
    icon: UserPlus,
    bg: "bg-cyan-400",
    text: "text-cyan-300",
    shadow: "shadow-cyan-400/50",
    border: "border-cyan-400/35",
  },
  email: {
    icon: Mail,
    bg: "bg-primary",
    text: "text-primary",
    shadow: "shadow-primary/50",
    border: "border-primary/35",
  },
  data: {
    icon: Database,
    bg: "bg-emerald-400",
    text: "text-emerald-300",
    shadow: "shadow-emerald-400/50",
    border: "border-emerald-400/35",
  },
} as const;

const messageTypes = Object.keys(THEME) as MsgType[];

export function MessageQueue() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const timeoutIdsRef = React.useRef<number[]>([]);

  const schedule = React.useCallback((callback: () => void, delay: number) => {
    const timeoutId = window.setTimeout(() => {
      timeoutIdsRef.current = timeoutIdsRef.current.filter((id) => id !== timeoutId);
      callback();
    }, delay);

    timeoutIdsRef.current.push(timeoutId);
    return timeoutId;
  }, []);

  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsExpanded(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  React.useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeoutIdsRef.current = [];
    };
  }, []);

  const publish = React.useCallback((type: MsgType) => {
    const id = Math.random().toString(36).slice(2, 9);
    setMessages((prev) => [...prev, { id, type, status: "published" }]);

    schedule(() => {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: "exchange" } : m)));
    }, 350);

    schedule(() => {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: "queued" } : m)));
    }, 900);
  }, [schedule]);

  React.useEffect(() => {
    setMessages((prev) => {
      let changed = false;
      let next = [...prev];

      messageTypes.forEach((type) => {
        const hasProcessing = next.some(
          (m) => m.type === type && m.status === "processing"
        );

        if (hasProcessing) {
          return;
        }

        const nextQueued = next.find((m) => m.type === type && m.status === "queued");
        if (!nextQueued) {
          return;
        }

        changed = true;
        next = next.map((m) =>
          m.id === nextQueued.id ? { ...m, status: "processing" } : m
        );

        schedule(() => {
          setMessages((curr) =>
            curr.map((m) => (m.id === nextQueued.id ? { ...m, status: "done" } : m))
          );

          schedule(() => {
            setMessages((curr) => curr.filter((m) => m.id !== nextQueued.id));
          }, 380);
        }, 1450);
      });

      return changed ? next : prev;
    });
  }, [messages, schedule]);

  const MsgDot = ({ message }: { message: Message }) => (
    <motion.div
      layoutId={`msg-${message.id}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={`h-3 w-3 shrink-0 rounded-full shadow-[0_0_8px] ${THEME[message.type].bg} ${THEME[message.type].shadow}`}
    />
  );

  const ProducerNodes = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      className={
        mobile
          ? "grid grid-cols-3 gap-3"
          : "relative z-10 flex w-[120px] flex-col items-start justify-center gap-6 pt-8"
      }
    >
      {mobile ? (
        <div className="col-span-full mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          Producers
        </div>
      ) : (
        <div className="absolute top-0 w-full text-start text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Producers
        </div>
      )}

      {messageTypes.map((type) => {
        const config = THEME[type];
        const Icon = config.icon;

        return (
          <div
            key={type}
            className={
              mobile
                ? "flex flex-col items-center gap-2 rounded-xl border border-border/70 bg-card/75 p-3"
                : "relative flex w-full justify-start"
            }
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => publish(type)}
              className={cn(
                "group z-10 flex items-center justify-center rounded-lg border bg-card transition-colors hover:bg-muted cursor-pointer",
                config.border,
                mobile ? "h-14 w-14" : "h-12 w-12"
              )}
              title={`Publicar evento ${type}`}
              aria-label={`Publicar evento ${TYPE_LABELS[type]}`}
            >
              <Icon className={cn("transition-transform group-hover:scale-110", config.text, mobile ? "h-6 w-6" : "h-5 w-5")} />
            </motion.button>

            {mobile ? (
              <>
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground">
                  {TYPE_LABELS[type]}
                </span>
                <motion.div layout className="flex min-h-3 items-center justify-center gap-1">
                  {messages
                    .filter((m) => m.status === "published" && m.type === type)
                    .map((m) => (
                      <MsgDot key={m.id} message={m} />
                    ))}
                </motion.div>
              </>
            ) : (
              <motion.div
                layout
                className="pointer-events-none absolute left-full ml-4 flex h-8 w-8 items-center gap-1"
              >
                {messages
                  .filter((m) => m.status === "published" && m.type === type)
                  .map((m) => (
                    <MsgDot key={m.id} message={m} />
                  ))}
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );

  const RouterNode = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn("z-10 flex items-center justify-center", mobile ? "" : "w-[110px] pt-8")}>
      <div className={cn("relative", mobile && "w-full rounded-2xl border border-border/70 bg-card/70 px-4 py-5")}>
        <div
          className={cn(
            "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
            mobile ? "mb-3 text-center" : "absolute -top-8 w-full text-center"
          )}
        >
          Router
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-border/70 bg-card shadow-[0_0_30px_rgba(15,23,42,0.22)]"
        >
          <Activity className="h-8 w-8 text-muted-foreground/65" />
          <div className="absolute inset-[-4px] rounded-full border border-dashed border-border/45" />
        </motion.div>
        <motion.div
          layout
          className="pointer-events-none absolute inset-0 flex flex-wrap items-center justify-center gap-1 p-4"
        >
          {messages
            .filter((m) => m.status === "exchange")
            .map((m) => (
              <MsgDot key={m.id} message={m} />
            ))}
        </motion.div>
      </div>
    </div>
  );

  const WorkerQueues = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      className={
        mobile
          ? "space-y-3"
          : "relative z-10 flex w-[176px] flex-col justify-center gap-6 pt-8"
      }
    >
      {mobile ? (
        <div className="mb-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          <span>Queues</span>
          <span>Workers</span>
        </div>
      ) : (
        <div className="absolute top-0 left-0 grid w-full grid-cols-[120px_44px] gap-3">
          <div className="text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Queues
          </div>
          <div className="text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Workers
          </div>
        </div>
      )}

      {messageTypes.map((type) => {
        const config = THEME[type];
        const processingMsg = messages.find(
          (m) => m.type === type && (m.status === "processing" || m.status === "done")
        );

        return (
          <div
            key={type}
            className={cn(
              "items-center",
              mobile
                ? "grid grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-xl border border-border/70 bg-card/75 p-3"
                : "grid w-full grid-cols-[120px_44px] gap-3"
            )}
          >
            <div className="min-w-0">
              {mobile ? (
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground">
                  {TYPE_LABELS[type]}
                </div>
              ) : null}
              <motion.div
                layout
                className="relative flex h-10 w-full items-center justify-start gap-1.5 overflow-hidden rounded-full border border-border/80 bg-card/90 px-3 shadow-inner"
              >
                {messages
                  .filter((m) => m.status === "queued" && m.type === type)
                  .map((m) => (
                    <MsgDot key={m.id} message={m} />
                  ))}
              </motion.div>
            </div>

            <div
              className={`relative flex h-12 w-12 items-center justify-center rounded-xl border bg-card transition-colors duration-300 ${
                processingMsg ? config.border : "border-border"
              }`}
            >
              <Settings
                className={`h-6 w-6 ${processingMsg ? `${config.text} animate-spin` : "text-muted-foreground"}`}
                style={{ animationDuration: "2s" }}
              />
              {processingMsg ? (
                <motion.div layout className="absolute inset-0 flex items-center justify-center">
                  <MsgDot message={processingMsg} />
                </motion.div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsExpanded((current) => !current)}
        className={`fixed ${isMobile ? "bottom-20 right-6" : "bottom-6 right-6"} z-[72] flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-xl transition-colors duration-200 hover:bg-primary/20 hover:text-foreground cursor-pointer`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isExpanded ? "Cerrar topología de mensajes" : "Abrir topología de mensajes"}
      >
        <Rabbit className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-3 top-4 bottom-28 z-[100] flex flex-col overflow-hidden rounded-xl border border-border bg-background/95 shadow-2xl shadow-black/20 backdrop-blur-xl md:inset-x-auto md:right-6 md:top-auto md:bottom-24 md:max-h-[680px] md:w-[620px]"
          >
            <div className="flex items-center justify-between border-b border-border/90 bg-card/80 p-3">
              <div className="flex items-center gap-2">
                <Rabbit className="h-5 w-5 text-primary" />
                <span className="text-sm font-mono font-medium text-foreground">
                  Message Broker Topology
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
                aria-label="Minimizar topología"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="min-h-0 flex-1 overflow-y-auto p-3 md:p-6"
            >
              <LayoutGroup id="message-topology">
                <div className="space-y-4 md:hidden">
                  <div className="text-xs text-muted-foreground">
                    Toca cualquier productor para publicar un evento y seguir su recorrido.
                  </div>
                  <ProducerNodes mobile />
                  <RouterNode mobile />
                  <WorkerQueues mobile />
                </div>

                <div className="relative hidden w-fit items-stretch gap-8 md:mx-auto md:grid md:grid-cols-[120px_110px_176px]">
                  <div className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 opacity-20">
                    <div className="w-full border-t-2 border-dashed border-border/80" />
                  </div>
                  <ProducerNodes />
                  <RouterNode />
                  <WorkerQueues />
                </div>
              </LayoutGroup>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
