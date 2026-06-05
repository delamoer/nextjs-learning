/**
 * 通知状态管理 — 使用 Zustand
 *
 * 重要：Zustand 是一个轻量级的全局状态管理库，类比 Vue 的 Pinia / Vuex。
 * 核心思路：用 create() 创建一个"store"，里面放 state（数据）和 actions（修改方法），
 * 然后在任意组件里调用 useXxx() 就能读取和修改数据，自动触发重渲染。
 *
 * 对比 Vue：
 *   - Vue 用 Pinia 的 defineStore() 创建 store → 这里用 Zustand 的 create()
 *   - Vue 用 state / getters / actions → Zustand 全部写在一个对象里
 *   - Vue 用 store.xxx 访问 → React 用 const { xxx } = useXxx() 解构
 *
 * 为什么选 Zustand 而不是 Redux？
 *   - 代码量少很多（Redux 需要 action + reducer + dispatch）
 *   - 不需要 Provider 包裹（Redux 需要在顶层加 <Provider store={store}>）
 *   - 对 TypeScript 更友好
 */
import { create } from "zustand";

/**
 * 通知的数据结构（TypeScript interface）
 *
 * TypeScript 知识点：interface 定义对象的形状/类型
 * 类比 Vue：相当于给 props 写 type 校验，但更严格
 * 加了 export 是因为其他文件（如 notification-bell.tsx）也需要用这个类型
 */
export interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;       // 是否已读
  createdAt: string;
  /**
   * TypeScript 知识点：联合类型（Union Type）
   * type 只能是这 4 个字符串之一，写错会报错
   * 类比 Vue 的 prop validator: (value) => ['info','success','warning','error'].includes(value)
   */
  type: "info" | "success" | "warning" | "error";
}

/**
 * Store 的类型定义：包含数据（state）和方法（actions）
 *
 * TypeScript 知识点：
 * - `(id: number) => void` 表示函数类型，接收一个 number 参数，无返回值
 * - `Omit<Notification, "id" | "read" | "createdAt">` 是 TypeScript 工具类型（Utility Type）
 *   意思是：从 Notification 类型中去掉 id、read、createdAt 三个字段
 *   因为添加通知时这三个字段由系统自动生成，调用者不需要传
 *   等价于手写 { title: string; message: string; type: ... }，但用 Omit 更 DRY
 */
interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  addNotification: (n: Omit<Notification, "id" | "read" | "createdAt">) => void;
}

/**
 * 创建 Zustand store
 *
 * create<NotificationStore>() 的泛型参数告诉 TypeScript 这个 store 的类型
 * 回调函数接收 set 和 get 两个参数：
 *   - set：修改 state 的唯一方式（类比 Vuex 的 commit / Pinia 的 $patch）
 *   - get：读取当前 state（在 action 里需要读取其他状态时用）
 *
 * 重要：set() 是浅合并（shallow merge），只需要传要改的字段
 * 例如 set({ unreadCount: 0 }) 只更新 unreadCount，不影响 notifications
 */
export const useNotifications = create<NotificationStore>((set, get) => ({
  // ===== State（数据）=====
  // 初始通知数据（实际项目中通常从 API 获取）
  notifications: [
    { id: 1, title: "新用户注册", message: "用户「钱多多」完成注册", read: false, createdAt: "2分钟前", type: "info" },
    { id: 2, title: "系统更新", message: "系统将于今晚 22:00 进行维护", read: false, createdAt: "1小时前", type: "warning" },
    { id: 3, title: "导出完成", message: "用户数据已导出成功，请查收", read: true, createdAt: "3小时前", type: "success" },
    { id: 4, title: "异常告警", message: "API 响应时间超过 3s，请关注", read: false, createdAt: "5小时前", type: "error" },
    { id: 5, title: "用户反馈", message: "收到 3 条新的用户反馈", read: true, createdAt: "昨天", type: "info" },
  ],
  unreadCount: 3, // 未读数量（和上面 read: false 的数量一致）

  // ===== Actions（修改数据的方法）=====

  /**
   * 标记单条通知为已读
   * set() 接收一个函数，参数 state 是当前状态
   * 用 map 遍历数组，找到目标 id 的通知，把 read 改为 true
   *
   * 重要：{ ...n, read: true } 是展开运算符，创建一个新对象
   * React/Zustand 要求不可变更新（immutable update），不能直接 n.read = true
   * 类比 Vue：Vue 可以直接 this.notification.read = true（响应式代理自动追踪）
   *         React 必须返回新对象才能触发重渲染
   */
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

  /** 全部标记已读：把所有通知的 read 都改为 true */
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  /**
   * 添加新通知
   * 用 Date.now() 作为唯一 id（时间戳，毫秒级，简易方案）
   * 新通知放在数组最前面（最新的在最上面）
   */
  addNotification: (n) =>
    set((state) => {
      const newNotification: Notification = {
        ...n,           // 展开调用者传入的 title、message、type
        id: Date.now(), // 自动生成 id
        read: false,    // 新通知默认未读
        createdAt: "刚刚",
      };
      return {
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    }),
}));
