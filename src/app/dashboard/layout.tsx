import { Sidebar } from "@/components/sidebar";
import { AuthGuard } from "@/components/auth-guard";
import { NotificationBell } from "@/components/notification-bell";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileSidebar } from "@/components/mobile-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        {/* 桌面端侧边栏：lg 以上显示 */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <div className="flex flex-1 flex-col">
          {/* 顶部栏 */}
          <header className="flex items-center justify-between border-b bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900 lg:justify-end lg:px-8">
            {/* 移动端：汉堡菜单（lg 以下显示） */}
            <MobileSidebar />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <NotificationBell />
            </div>
          </header>

          {/* 主内容区 */}
          <main className="flex-1 p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
