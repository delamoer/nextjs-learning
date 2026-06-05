/**
 * 移动端侧边栏 — 响应式设计的核心组件
 *
 * 设计思路：
 * - 大屏幕（lg 以上，即 >= 1024px）：显示固定的桌面端侧边栏（在 layout.tsx 里）
 * - 小屏幕（< 1024px）：桌面侧边栏隐藏，改用这个"抽屉式"侧边栏
 *
 * UI 模式：Sheet（抽屉/侧拉面板）
 * 从屏幕边缘滑出的浮层，点击遮罩或关闭按钮收起。
 * 类比 Vue + Element UI 的 el-drawer 组件
 *
 * 响应式方案对比：
 *   Vue：一般用 v-if + window.innerWidth 或 CSS media query
 *   React/Tailwind：直接在 className 里用响应式前缀（如 lg:hidden）
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { hasPermission, getRoleName, type Permission } from "@/lib/auth";

/**
 * 导航项的类型定义
 * permission? 表示可选：有些页面所有人都能看（如仪表盘），有些需要权限（如用户管理）
 */
interface NavItem {
  href: string;
  label: string;
  icon: string;
  permission?: Permission; // Permission 是在 lib/auth.ts 中定义的联合类型
}

/**
 * 导航配置数组
 * 将导航数据抽成常量，方便维护。增删改菜单只需改这个数组
 * 类比 Vue Router 的路由配置表 routes[]
 */
const navItems: NavItem[] = [
  { href: "/dashboard", label: "仪表盘", icon: "📊" },
  { href: "/dashboard/users", label: "用户管理", icon: "👥", permission: "user:read" },
  { href: "/dashboard/notifications", label: "通知中心", icon: "🔔" },
  { href: "/dashboard/settings", label: "系统设置", icon: "⚙️", permission: "settings:read" },
];

export function MobileSidebar() {
  // 控制抽屉开关状态
  const [open, setOpen] = useState(false);

  /**
   * Next.js 路由 hooks：
   * - usePathname()：获取当前路径（如 "/dashboard/users"），用于高亮当前菜单项
   *   类比 Vue Router 的 this.$route.path
   * - useRouter()：获取路由实例，可以用 router.push() 编程式导航
   *   类比 Vue Router 的 this.$router.push()
   */
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  /**
   * 根据用户权限过滤可见的导航项
   * 没有 permission 要求的菜单项所有人都能看
   * 有 permission 要求的需要检查当前用户角色是否包含该权限
   */
  const visibleItems = navItems.filter((item) => {
    if (!item.permission) return true;  // 无权限要求，直接显示
    if (!user) return false;           // 未登录，隐藏
    return hasPermission(user.role, item.permission);
  });

  const handleLogout = () => {
    logout();
    router.push("/login"); // 编程式导航到登录页
    setOpen(false);        // 关闭抽屉
  };

  return (
    /**
     * Sheet 组件的受控模式：
     * - open={open}：由我们的 state 控制开关（受控组件模式）
     * - onOpenChange={setOpen}：点击遮罩/按关闭按钮时，Sheet 调用这个函数通知我们
     *
     * 类比 Vue 的 v-model：
     *   <el-drawer v-model="open"> 等价于这里的 open + onOpenChange
     */
    <Sheet open={open} onOpenChange={setOpen}>
      {/**
       * lg:hidden — Tailwind 响应式类
       * 意思：在 lg（>= 1024px）屏幕上隐藏此按钮
       * 因为大屏幕已经有桌面版侧边栏了，不需要汉堡菜单
       *
       * Tailwind 响应式断点（从小到大）：sm(640) md(768) lg(1024) xl(1280) 2xl(1536)
       */}
      <SheetTrigger className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
        <span className="text-xl">☰</span>
      </SheetTrigger>

      {/* side="left" 表示从左侧滑出（默认是右侧） */}
      <SheetContent side="left" className="w-60 p-0">
        <div className="p-6">
          <h2 className="text-lg font-bold">管理后台</h2>
        </div>

        {/* 导航菜单列表 */}
        <nav className="p-4 space-y-1">
          {visibleItems.map((item) => {
            // 判断当前路径是否匹配此菜单项（用于高亮样式）
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)} // 点击导航后关闭抽屉
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-gray-100 font-medium text-gray-900"  // 激活状态样式
                    : "text-gray-600 hover:bg-gray-50"         // 普通状态样式
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* 底部用户信息区域 */}
        {user && (
          <div className="absolute bottom-0 left-0 right-0 border-t p-4">
            <div className="mb-3 flex items-center gap-3">
              {/* 用户名首字母做头像 */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                {user.name[0]}
              </div>
              <div className="text-sm">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-gray-400">{getRoleName(user.role)}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full" onClick={handleLogout}>
              退出登录
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
