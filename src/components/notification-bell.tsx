// 通知铃铛：顶部导航栏的通知图标 + 弹出面板
"use client";

import { useNotifications } from "@/hooks/use-notifications";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const typeIcons = {
  info: "ℹ️",
  success: "✅",
  warning: "⚠️",
  error: "🔴",
};

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  // 只显示最近 5 条
  const recentNotifications = notifications.slice(0, 5);

  return (
    <Popover>
      <PopoverTrigger>
        <div className="relative cursor-pointer p-2 rounded-lg hover:bg-gray-100">
          <span className="text-xl">🔔</span>
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadCount}
            </span>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end">
        {/* 头部 */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="font-medium text-sm">通知</p>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:underline"
            >
              全部已读
            </button>
          )}
        </div>

        {/* 通知列表 */}
        <div className="max-h-72 overflow-y-auto">
          {recentNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 border-b last:border-0 ${
                !n.read ? "bg-blue-50/50" : ""
              }`}
            >
              <span className="text-sm mt-0.5">{typeIcons[n.type]}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!n.read ? "font-medium" : "text-gray-600"}`}>
                  {n.title}
                </p>
                <p className="text-xs text-gray-400 truncate">{n.message}</p>
                <p className="text-xs text-gray-300 mt-1">{n.createdAt}</p>
              </div>
              {!n.read && (
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              )}
            </div>
          ))}
        </div>

        {/* 底部 */}
        <div className="border-t px-4 py-2">
          <Link
            href="/dashboard/notifications"
            className="block text-center text-xs text-blue-600 hover:underline"
          >
            查看全部通知
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
