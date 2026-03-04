import * as React from "react";

const STORAGE_KEY = "portfolio:dark-mode";

export function useDarkMode() {
  const [darkMode, setDarkMode] = React.useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const storedPreference = window.localStorage.getItem(STORAGE_KEY);
    if (storedPreference !== null) {
      return storedPreference === "true";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, String(darkMode));
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.style.colorScheme = darkMode ? "dark" : "light";
  }, [darkMode]);

  const toggleDarkMode = React.useCallback(() => {
    setDarkMode((current) => !current);
  }, []);

  return { darkMode, setDarkMode, toggleDarkMode };
}
