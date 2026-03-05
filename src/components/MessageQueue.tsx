import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Database,
  Mail,
  Minimize2,
  Rabbit,
  Settings,
  UserPlus,
} from "lucide-react";

type MsgType = "auth" | "email" | "data";
type MsgStatus = "published" | "exchange" | "queued" | "processing" | "done";

interface Message {
  id: string;
  type: MsgType;
  status: MsgStatus;
}

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

  const publish = React.useCallback((type: MsgType) => {
    const id = Math.random().toString(36).slice(2, 9);
    setMessages((prev) => [...prev, { id, type, status: "published" }]);

    window.setTimeout(() => {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: "exchange" } : m)));
    }, 350);

    window.setTimeout(() => {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: "queued" } : m)));
    }, 900);
  }, []);

  React.useEffect(() => {
    if (!isExpanded) {
      return;
    }

    const interval = window.setInterval(() => {
      if (Math.random() > 0.5) {
        publish(messageTypes[Math.floor(Math.random() * messageTypes.length)]);
      }
    }, 2500);

    return () => window.clearInterval(interval);
  }, [isExpanded, publish]);

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

        window.setTimeout(() => {
          setMessages((curr) =>
            curr.map((m) => (m.id === nextQueued.id ? { ...m, status: "done" } : m))
          );

          window.setTimeout(() => {
            setMessages((curr) => curr.filter((m) => m.id !== nextQueued.id));
          }, 380);
        }, 1450);
      });

      return changed ? next : prev;
    });
  }, [messages]);

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
            className="fixed right-6 bottom-24 z-[100] w-[calc(100vw-3rem)] overflow-hidden rounded-xl border border-border bg-background/95 shadow-2xl shadow-black/20 backdrop-blur-xl md:w-[620px]"
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
              className="overflow-x-auto p-3 md:p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <div className="relative flex min-w-[320px] md:min-w-[500px] items-stretch justify-between gap-2 md:gap-4 scale-75 md:scale-100 origin-top-left md:origin-center">
                <div className="pointer-events-none absolute inset-0 z-0 flex items-center opacity-20">
                  <div className="w-full border-t-2 border-dashed border-border/80" />
                </div>

            <div className="relative z-10 flex flex-col justify-center gap-3 md:gap-6 pt-8">
              <div className="absolute top-0 w-full text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Producers
              </div>
              {messageTypes.map((type) => {
                const config = THEME[type];
                const Icon = config.icon;
                return (
                  <div key={type} className="relative flex items-center">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => publish(type)}
                      className={`group z-10 flex h-12 w-12 items-center justify-center rounded-lg border ${config.border} bg-card transition-colors hover:bg-muted cursor-pointer`}
                      title={`Publicar evento ${type}`}
                    >
                      <Icon className={`h-5 w-5 ${config.text} transition-transform group-hover:scale-110`} />
                    </motion.button>
                    <div className="absolute left-full ml-4 flex h-8 w-8 items-center gap-1">
                      {messages
                        .filter((m) => m.status === "published" && m.type === type)
                        .map((m) => (
                          <MsgDot key={m.id} message={m} />
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="z-10 flex items-center justify-center pt-8">
              <div className="relative">
                <div className="absolute -top-8 w-full text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Router
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="relative flex h-20 w-20 items-center justify-center rounded-full border border-border/70 bg-card shadow-[0_0_30px_rgba(15,23,42,0.22)]"
                >
                  <Activity className="h-8 w-8 text-muted-foreground/65" />
                  <div className="absolute inset-[-4px] rounded-full border border-dashed border-border/45" />
                </motion.div>
                <div className="pointer-events-none absolute inset-0 flex flex-wrap items-center justify-center gap-1 p-4">
                  {messages
                    .filter((m) => m.status === "exchange")
                    .map((m) => (
                      <MsgDot key={m.id} message={m} />
                    ))}
                </div>
              </div>
            </div>

            <div className="relative z-10 flex flex-col justify-center gap-3 md:gap-6 pt-8">
              <div className="absolute top-0 flex w-full justify-between">
                <div className="w-20 md:w-32 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Queues
                </div>
                <div className="w-12 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Workers
                </div>
              </div>
              {messageTypes.map((type) => {
                const config = THEME[type];
                const processingMsg = messages.find(
                  (m) => m.type === type && (m.status === "processing" || m.status === "done")
                );
                return (
                  <div key={type} className="flex items-center gap-2 md:gap-4">
                    <div className="relative flex h-10 w-20 md:w-32 items-center justify-start gap-1.5 overflow-hidden rounded-full border border-border/80 bg-card/90 px-3 shadow-inner">
                      {messages
                        .filter((m) => m.status === "queued" && m.type === type)
                        .map((m) => (
                          <MsgDot key={m.id} message={m} />
                        ))}
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
                        <div className="absolute inset-0 flex items-center justify-center">
                          <MsgDot message={processingMsg} />
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
