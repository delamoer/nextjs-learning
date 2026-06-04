// 路由守卫：未登录重定向到 /login
// 类比 Vue Router 的 beforeEach 导航守卫
// React 没有全局导航守卫，用组件包裹的方式实现
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, init } = useAuth();
  const router = useRouter();

  // 首次挂载时从 localStorage 恢复登录状态
  useEffect(() => {
    init();
  }, [init]);

  // 加载完毕后，未登录则跳转
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  // 加载中显示 loading
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-400">加载中...</p>
      </div>
    );
  }

  // 未登录（正在跳转）
  if (!user) {
    return null;
  }

  // 已登录，渲染子组件
  return <>{children}</>;
}
