// 主题切换按钮
"use client";

import { useTheme } from "@/hooks/use-theme";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { theme, setTheme, init } = useTheme();

  useEffect(() => {
    init();
  }, [init]);

  const icons = { light: "☀️", dark: "🌙", system: "💻" };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
        <span className="text-lg">{icons[theme]}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          ☀️ 浅色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          🌙 深色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          💻 跟随系统
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
