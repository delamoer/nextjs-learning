"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { hasPermission, getRoleName, type Permission } from "@/lib/auth";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  permission?: Permission; // 需要什么权限才显示
}

// 菜单配置：设置页需要 settings:read 权限
const navItems: NavItem[] = [
  { href: "/dashboard", label: "仪表盘", icon: "📊" },
  { href: "/dashboard/users", label: "用户管理", icon: "👥", permission: "user:read" },
  { href: "/dashboard/settings", label: "系统设置", icon: "⚙️", permission: "settings:read" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // 根据权限过滤菜单
  const visibleItems = navItems.filter((item) => {
    if (!item.permission) return true;
    if (!user) return false;
    return hasPermission(user.role, item.permission);
  });

  return (
    <aside className="flex w-60 flex-col border-r bg-white">
      <div className="p-6">
        <h2 className="text-lg font-bold text-gray-900">管理后台</h2>
      </div>

      <Separator />

      <nav className="flex-1 p-4 space-y-1">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-gray-100 font-medium text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        {user && (
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
              {user.name[0]}
            </div>
            <div className="text-sm">
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-gray-400">{getRoleName(user.role)}</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-gray-500"
          onClick={handleLogout}
        >
          退出登录
        </Button>
      </div>
    </aside>
  );
}
