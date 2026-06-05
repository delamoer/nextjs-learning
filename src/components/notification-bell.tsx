/**
 * 通知铃铛组件：顶部导航栏的通知图标 + 弹出面板
 *
 * 核心 UI 模式：Popover（弹出层）
 * 点击触发元素后弹出一个浮层，展示内容。
 * 类比 Vue：类似 Element UI 的 el-popover 组件
 *
 * 组件库：使用 shadcn/ui 的 Popover 组件（基于 Radix UI）
 * Radix UI 提供无样式但功能完善的基础组件（焦点管理、键盘导航、无障碍 ARIA 属性等）
 * shadcn/ui 在 Radix 基础上加了 Tailwind 样式
 */
"use client"; // 重要：使用了 hooks（useState 等），必须标记为客户端组件

import { useNotifications } from "@/hooks/use-notifications";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/** 通知类型对应的图标映射（简单对象，当常量用） */
const typeIcons = {
  info: "ℹ️",
  success: "✅",
  warning: "⚠️",
  error: "🔴",
};

export function NotificationBell() {
  /**
   * 从 Zustand store 中解构出需要的数据和方法
   * 类比 Vue：const store = useNotificationStore(); 然后 store.notifications
   *
   * 重要：Zustand 只会在你解构出来的字段变化时触发重渲染
   * 所以如果你只用 unreadCount，notifications 变化不会导致此组件重渲染
   * 这叫"自动选择性订阅"，比 Redux 的 useSelector 方便
   */
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  // 只显示最近 5 条（弹出面板空间有限，完整列表走"查看全部"链接）
  const recentNotifications = notifications.slice(0, 5);

  return (
    /**
     * Popover 组件结构说明：
     * - <Popover>：容器，管理 open/close 状态
     * - <PopoverTrigger>：触发器，点击它弹出内容
     * - <PopoverContent>：弹出的内容面板
     *
     * 类比 Vue + Element UI：
     *   <el-popover trigger="click">
     *     <template #reference>触发按钮</template>
     *     弹出内容
     *   </el-popover>
     */
    <Popover>
      <PopoverTrigger>
        {/* 铃铛图标 + 未读角标 */}
        <div className="relative cursor-pointer p-2 rounded-lg hover:bg-gray-100">
          <span className="text-xl">🔔</span>
          {/**
           * 条件渲染：有未读消息时才显示红色数字角标
           * 类比 Vue 的 v-if：{unreadCount > 0 && <元素>} 等价于 v-if="unreadCount > 0"
           * 这是 JSX 中最常用的条件渲染写法
           */}
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadCount}
            </span>
          )}
        </div>
      </PopoverTrigger>

      {/* align="end" 让弹出层右对齐触发器（否则会超出屏幕右边） */}
      <PopoverContent className="w-80 p-0" align="end">
        {/* 头部：标题 + "全部已读"按钮 */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="font-medium text-sm">通知</p>
          {/* 只有存在未读时才显示"全部已读"按钮 */}
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:underline"
            >
              全部已读
            </button>
          )}
        </div>

        {/* 通知列表（可滚动，max-h-72 限制高度） */}
        <div className="max-h-72 overflow-y-auto">
          {/**
           * 列表渲染：用 map 遍历数组
           * 类比 Vue 的 v-for：
           *   Vue: <div v-for="n in recentNotifications" :key="n.id">
           *   React: {list.map((n) => <div key={n.id}>)}
           *
           * 重要：key 必须是唯一且稳定的值，React 用它判断哪个元素需要更新
           */}
          {recentNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 border-b last:border-0 ${
                !n.read ? "bg-blue-50/50" : "" // 未读消息加浅蓝色背景
              }`}
            >
              {/* 通知类型图标 */}
              <span className="text-sm mt-0.5">{typeIcons[n.type]}</span>
              <div className="flex-1 min-w-0">
                {/* 未读消息标题加粗，已读变灰 */}
                <p className={`text-sm ${!n.read ? "font-medium" : "text-gray-600"}`}>
                  {n.title}
                </p>
                {/* truncate: 文字超长时显示省略号 */}
                <p className="text-xs text-gray-400 truncate">{n.message}</p>
                <p className="text-xs text-gray-300 mt-1">{n.createdAt}</p>
              </div>
              {/* 未读标记：右侧小蓝点 */}
              {!n.read && (
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              )}
            </div>
          ))}
        </div>

        {/* 底部：跳转到完整通知列表页面 */}
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
