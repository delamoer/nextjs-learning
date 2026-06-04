// dashboard/layout.tsx —— 仪表盘的嵌套布局
// AuthGuard 包裹：未登录会自动跳转到 /login
// 只有 /dashboard 及其子路由需要登录保护

import { Sidebar } from "@/components/sidebar";
import { AuthGuard } from "@/components/auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
