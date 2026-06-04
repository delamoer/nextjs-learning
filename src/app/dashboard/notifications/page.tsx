"use client";

import { useNotifications } from "@/hooks/use-notifications";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const typeConfig = {
  info: { icon: "ℹ️", color: "bg-blue-50 border-blue-200" },
  success: { icon: "✅", color: "bg-green-50 border-green-200" },
  warning: { icon: "⚠️", color: "bg-yellow-50 border-yellow-200" },
  error: { icon: "🔴", color: "bg-red-50 border-red-200" },
};

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">通知中心</h1>
          <p className="mt-1 text-sm text-gray-500">
            共 {notifications.length} 条通知，{unreadCount} 条未读
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            全部标为已读
          </Button>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {notifications.map((n) => {
          const config = typeConfig[n.type];
          return (
            <div
              key={n.id}
              className={`flex items-start gap-4 rounded-lg border p-4 ${
                !n.read ? config.color : "bg-white"
              }`}
            >
              <span className="text-lg mt-0.5">{config.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className={`text-sm ${!n.read ? "font-semibold" : "font-medium text-gray-700"}`}>
                    {n.title}
                  </p>
                  {!n.read && <Badge variant="default" className="text-[10px] px-1.5 py-0">未读</Badge>}
                </div>
                <p className="mt-1 text-sm text-gray-500">{n.message}</p>
                <p className="mt-2 text-xs text-gray-400">{n.createdAt}</p>
              </div>
              {!n.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => markAsRead(n.id)}
                >
                  标为已读
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
