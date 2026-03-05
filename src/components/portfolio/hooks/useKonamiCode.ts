import * as React from "react";

interface KonamiCodeHookResult {
  activated: boolean;
  unlocked: boolean;
  reset: () => void;
}

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
] as const;

const RESET_AFTER_MS = 5000;
const UNLOCK_STORAGE_KEY = "portfolio:easter-university-project";

export function useKonamiCode(): KonamiCodeHookResult {
  const [activated, setActivated] = React.useState(false);
  const [unlocked, setUnlocked] = React.useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.localStorage.getItem(UNLOCK_STORAGE_KEY) === "true";
  });
  const [, setKeySequence] = React.useState<string[]>([]);
  const resetTimeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const pressedKey = event.key.length === 1 ? event.key.toLowerCase() : event.key;

      setKeySequence((currentSequence) => {
        const nextSequence = [...currentSequence, pressedKey].slice(-KONAMI_CODE.length);

        if (nextSequence.join(",") === KONAMI_CODE.join(",")) {
          setActivated(true);
          setUnlocked(true);
          window.localStorage.setItem(UNLOCK_STORAGE_KEY, "true");
          if (resetTimeoutRef.current) {
            window.clearTimeout(resetTimeoutRef.current);
          }

          resetTimeoutRef.current = window.setTimeout(() => {
            setActivated(false);
            setKeySequence([]);
          }, RESET_AFTER_MS);

          return [];
        }

        return nextSequence;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  React.useEffect(
    () => () => {
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    },
    []
  );

  const reset = React.useCallback(() => {
    if (resetTimeoutRef.current) {
      window.clearTimeout(resetTimeoutRef.current);
    }
    setActivated(false);
    setUnlocked(false);
    setKeySequence([]);
    window.localStorage.removeItem(UNLOCK_STORAGE_KEY);
  }, []);

  return { activated, unlocked, reset };
}
