/**
 * 主题管理 — 暗色模式切换 + localStorage 持久化
 *
 * 暗色模式的实现原理（Tailwind CSS 方案）：
 * 1. 在 <html> 元素上添加/移除 class="dark"
 * 2. Tailwind 的 dark: 前缀类（如 dark:bg-gray-900）会根据这个 class 生效
 * 3. 用 localStorage 记住用户选择，刷新后保持
 *
 * 三种模式：
 * - light：始终浅色
 * - dark：始终深色
 * - system：跟随操作系统设置（macOS/Windows 的外观设置）
 *
 * 类比 Vue：Vue 项目中暗色模式实现思路完全一样，
 * 只是状态管理用 Pinia 代替 Zustand
 */
import { create } from "zustand";

/**
 * TypeScript 知识点：type 关键字定义类型别名
 * 这里定义了一个联合类型，变量只能是这三个值之一
 * 和 interface 的区别：type 适合简单类型（联合类型、基础类型别名），interface 适合对象结构
 */
type Theme = "light" | "dark" | "system";

interface ThemeStore {
  theme: Theme;          // 当前主题
  setTheme: (theme: Theme) => void;  // 切换主题
  init: () => void;      // 初始化（从 localStorage 读取）
}

export const useTheme = create<ThemeStore>((set) => ({
  theme: "light", // 默认值，init() 后会被 localStorage 的值覆盖

  /**
   * 初始化主题
   * 为什么需要 init？因为 Zustand store 在服务端和客户端都会执行
   * 但 localStorage 只存在于浏览器，服务端没有 window 对象
   * 所以要在客户端组件的 useEffect 中调用 init()
   */
  init: () => {
    // typeof window === "undefined" 表示当前在服务端（Node.js 环境）
    // 服务端没有 localStorage，直接 return 避免报错
    if (typeof window === "undefined") return;

    // 从 localStorage 读取用户之前的选择
    // `as Theme | null` 是类型断言：localStorage.getItem 返回 string | null
    // 我们确定存的值只会是 Theme 类型，所以用 as 告诉 TypeScript
    const saved = localStorage.getItem("theme") as Theme | null;
    const theme = saved || "system"; // 如果没有保存过，默认跟随系统
    set({ theme });
    applyTheme(theme);
  },

  /**
   * 切换主题：更新 state + 持久化到 localStorage + 应用 CSS class
   */
  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem("theme", theme); // 持久化，刷新后保持
    applyTheme(theme);
  },
}));

/**
 * 实际应用主题：操作 <html> 元素的 class
 *
 * Tailwind 暗色模式的工作机制：
 * - 配置 darkMode: "class"（在 tailwind.config.ts 中）
 * - <html class="dark"> → 所有 dark:xxx 类生效
 * - <html>（无 dark class）→ dark:xxx 类不生效
 *
 * window.matchMedia("(prefers-color-scheme: dark)")：
 * 浏览器 API，检测操作系统是否开启了暗色模式
 */
function applyTheme(theme: Theme) {
  const root = document.documentElement; // 即 <html> 元素
  if (theme === "dark") {
    root.classList.add("dark");
  } else if (theme === "light") {
    root.classList.remove("dark");
  } else {
    // system 模式：检测系统偏好
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }
}
