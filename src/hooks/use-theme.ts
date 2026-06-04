// 主题管理：暗色模式切换 + 持久化
import { create } from "zustand";

type Theme = "light" | "dark" | "system";

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  init: () => void;
}

export const useTheme = create<ThemeStore>((set) => ({
  theme: "light",

  init: () => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("theme") as Theme | null;
    const theme = saved || "system";
    set({ theme });
    applyTheme(theme);
  },

  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem("theme", theme);
    applyTheme(theme);
  },
}));

// 实际应用 class 到 html 元素
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else if (theme === "light") {
    root.classList.remove("dark");
  } else {
    // system：跟随系统偏好
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }
}
