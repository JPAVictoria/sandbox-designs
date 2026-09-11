"use client";

import { useEffect, useState } from "react";

export function useDarkMode() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, [dark]);

  return [dark, () => setDark((prev) => !prev)];
}
