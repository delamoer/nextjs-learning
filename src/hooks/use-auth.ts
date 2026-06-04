// 鉴权 Hook：管理登录状态
// 用 Zustand 做全局状态（比 Context 更简洁）
"use client";

import { create } from "zustand";
import { type AuthUser, getAuth, saveAuth, clearAuth, loginAPI } from "@/lib/auth";

// Zustand store：登录状态 + 操作方法
interface AuthStore {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  init: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  isLoading: true, // 初始 true，init 之后变 false
  error: null,

  // 应用启动时从 localStorage 恢复登录状态
  init: () => {
    const user = getAuth();
    set({ user, isLoading: false });
  },

  // 登录
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await loginAPI(email, password);
      saveAuth(user);
      set({ user, isLoading: false });
      return true;
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
      return false;
    }
  },

  // 登出
  logout: () => {
    clearAuth();
    set({ user: null });
  },
}));
