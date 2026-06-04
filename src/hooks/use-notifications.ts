// 通知状态管理（Zustand）
import { create } from "zustand";

export interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: "info" | "success" | "warning" | "error";
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  addNotification: (n: Omit<Notification, "id" | "read" | "createdAt">) => void;
}

export const useNotifications = create<NotificationStore>((set, get) => ({
  notifications: [
    { id: 1, title: "新用户注册", message: "用户「钱多多」完成注册", read: false, createdAt: "2分钟前", type: "info" },
    { id: 2, title: "系统更新", message: "系统将于今晚 22:00 进行维护", read: false, createdAt: "1小时前", type: "warning" },
    { id: 3, title: "导出完成", message: "用户数据已导出成功，请查收", read: true, createdAt: "3小时前", type: "success" },
    { id: 4, title: "异常告警", message: "API 响应时间超过 3s，请关注", read: false, createdAt: "5小时前", type: "error" },
    { id: 5, title: "用户反馈", message: "收到 3 条新的用户反馈", read: true, createdAt: "昨天", type: "info" },
  ],
  unreadCount: 3,

  markAsRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  addNotification: (n) =>
    set((state) => {
      const newNotification: Notification = {
        ...n,
        id: Date.now(),
        read: false,
        createdAt: "刚刚",
      };
      return {
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    }),
}));
