// 权限控制组件：没权限就不渲染
// 两种用法：
// 1. <Can permission="user:delete">只有有权限才看到</Can>
// 2. usePermission("user:delete") 返回 boolean（在逻辑里判断）
"use client";

import { useAuth } from "@/hooks/use-auth";
import { hasPermission, type Permission } from "@/lib/auth";

// 组件方式：包裹住需要权限控制的内容
interface CanProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode; // 无权限时显示的内容（可选）
}

export function Can({ permission, children, fallback = null }: CanProps) {
  const { user } = useAuth();

  if (!user || !hasPermission(user.role, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Hook 方式：返回 boolean，用在逻辑判断里
export function usePermission(permission: Permission): boolean {
  const { user } = useAuth();
  if (!user) return false;
  return hasPermission(user.role, permission);
}
