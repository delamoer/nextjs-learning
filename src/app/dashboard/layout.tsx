import { Sidebar } from "@/components/sidebar";
import { AuthGuard } from "@/components/auth-guard";
import { NotificationBell } from "@/components/notification-bell";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          {/* 顶部栏 */}
          <header className="flex items-center justify-end gap-2 border-b bg-white px-8 py-3 dark:border-gray-800 dark:bg-gray-900">
            <ThemeToggle />
            <NotificationBell />
          </header>
          {/* 主内容区 */}
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
