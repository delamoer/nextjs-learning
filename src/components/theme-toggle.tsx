/**
 * 主题切换按钮 — 使用 DropdownMenu（下拉菜单）模式
 *
 * UI 模式：DropdownMenu
 * 点击按钮弹出一个菜单列表，用户选择一项后关闭。
 * 和 Popover 的区别：Popover 里可以放任意内容，DropdownMenu 专门放操作列表
 *
 * 类比 Vue：
 *   Element UI 的 <el-dropdown> 组件
 *   Ant Design Vue 的 <a-dropdown>
 *
 * 组件结构（和 Popover 类似的"触发器 + 内容"模式）：
 * - DropdownMenu：容器
 * - DropdownMenuTrigger：触发按钮
 * - DropdownMenuContent：弹出的菜单面板
 * - DropdownMenuItem：菜单中的每一项
 */
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

  /**
   * useEffect：在组件挂载后执行副作用
   * 类比 Vue 的 onMounted(() => { ... })
   *
   * 为什么在这里调 init()？
   * 因为 init 需要访问 localStorage（浏览器 API），
   * 而 Next.js 的组件可能在服务端预渲染，服务端没有 localStorage
   * 所以必须在 useEffect 中调用（useEffect 只在客户端执行）
   *
   * [init] 是依赖数组：只有 init 函数变化时才重新执行
   * Zustand 的 store 方法引用是稳定的，所以实际上只会执行一次
   */
  useEffect(() => {
    init();
  }, [init]);

  // 主题对应的图标（用对象映射，简洁干净）
  const icons = { light: "☀️", dark: "🌙", system: "💻" };

  return (
    <DropdownMenu>
      {/* 触发按钮：显示当前主题的图标 */}
      {/* dark:hover:bg-gray-800 → 暗色模式下 hover 时的背景色 */}
      <DropdownMenuTrigger className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
        <span className="text-lg">{icons[theme]}</span>
      </DropdownMenuTrigger>

      {/* 下拉菜单内容 */}
      <DropdownMenuContent align="end">
        {/* 每个 MenuItem 点击后调用 setTheme 切换主题 */}
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
