// 移动端侧边栏：用 Sheet（抽屉）组件
// 小屏幕时侧边栏隐藏，点击汉堡菜单弹出
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

interface NavItem {
  href: string;
  label: string;
  icon: string;
  permission?: Permission;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "仪表盘", icon: "📊" },
  { href: "/dashboard/users", label: "用户管理", icon: "👥", permission: "user:read" },
  { href: "/dashboard/notifications", label: "通知中心", icon: "🔔" },
  { href: "/dashboard/settings", label: "系统设置", icon: "⚙️", permission: "settings:read" },
];

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const visibleItems = navItems.filter((item) => {
    if (!item.permission) return true;
    if (!user) return false;
    return hasPermission(user.role, item.permission);
  });

  const handleLogout = () => {
    logout();
    router.push("/login");
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
        <span className="text-xl">☰</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-60 p-0">
        <div className="p-6">
          <h2 className="text-lg font-bold">管理后台</h2>
        </div>
        <nav className="p-4 space-y-1">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-gray-100 font-medium text-gray-900"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        {user && (
          <div className="absolute bottom-0 left-0 right-0 border-t p-4">
            <div className="mb-3 flex items-center gap-3">
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
