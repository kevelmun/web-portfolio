import * as React from "react";

export type PortfolioViewMode = "main" | "workspace";

const DARK_MODE_STORAGE_KEY = "portfolio:dark-mode";
export const VIEW_MODE_STORAGE_KEY = "portfolio:view-mode";

export function readStoredViewMode(): PortfolioViewMode {
  if (typeof window === "undefined") {
    return "main";
  }

  return window.localStorage.getItem(VIEW_MODE_STORAGE_KEY) === "workspace"
    ? "workspace"
    : "main";
}

export function usePortfolioPreferences() {
  const [darkMode, setDarkMode] = React.useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const storedPreference = window.localStorage.getItem(DARK_MODE_STORAGE_KEY);
    if (storedPreference !== null) {
      return storedPreference === "true";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [viewMode, setViewMode] = React.useState<PortfolioViewMode>(() => readStoredViewMode());

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(DARK_MODE_STORAGE_KEY, String(darkMode));
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.style.colorScheme = darkMode ? "dark" : "light";
  }, [darkMode]);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, viewMode);
  }, [viewMode]);

  const toggleDarkMode = React.useCallback(() => {
    setDarkMode((current) => !current);
  }, []);

  return {
    darkMode,
    setDarkMode,
    toggleDarkMode,
    viewMode,
    setViewMode,
  };
}
