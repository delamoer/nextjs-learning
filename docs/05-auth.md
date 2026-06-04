# 鉴权：登录 + 路由守卫

## 整体流程

```
用户访问 /dashboard
    ↓
AuthGuard 检查登录状态
    ↓
未登录 → 重定向到 /login
已登录 → 渲染 dashboard 内容
    ↓
登录页提交 → 调 API → 成功存 localStorage → 跳转 /dashboard
```

## 实现方式

### 1. 鉴权状态管理（Zustand store）

```tsx
// src/hooks/use-auth.ts
import { create } from "zustand";

const useAuth = create((set) => ({
  user: null,
  login: async (email, password) => {
    const user = await loginAPI(email, password);
    saveAuth(user);      // 存 localStorage
    set({ user });
  },
  logout: () => {
    clearAuth();         // 清 localStorage
    set({ user: null });
  },
  init: () => {
    const user = getAuth();  // 从 localStorage 恢复
    set({ user, isLoading: false });
  },
}));
```

### 2. 路由守卫组件

```tsx
// src/components/auth-guard.tsx
"use client";

export function AuthGuard({ children }) {
  const { user, isLoading, init } = useAuth();
  const router = useRouter();

  useEffect(() => { init() }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");  // 未登录跳转
    }
  }, [isLoading, user]);

  if (isLoading) return <p>加载中...</p>;
  if (!user) return null;
  return <>{children}</>;
}
```

### 3. 在 layout 中使用

```tsx
// src/app/dashboard/layout.tsx
import { AuthGuard } from "@/components/auth-guard";

export default function DashboardLayout({ children }) {
  return (
    <AuthGuard>
      <Sidebar />
      <main>{children}</main>
    </AuthGuard>
  );
}
```

只有 `/dashboard` 下的页面被保护，`/login` 和 `/about` 不受影响。

## Vue 对比

| Vue Router | Next.js |
|-----------|---------|
| router.beforeEach 全局守卫 | AuthGuard 组件包裹 |
| meta: { requiresAuth: true } | 哪个 layout 加 AuthGuard 哪里需要登录 |
| this.$router.push('/login') | router.replace('/login') |
| Vuex 存 token | Zustand store + localStorage |

## 为什么用 Zustand 而不是 Context？

- 登录状态需要在很多地方读取（侧边栏、守卫、页面）
- Zustand 不需要 Provider 包裹，任何组件直接 `useAuth()` 就能用
- API 更简洁：`create((set) => ({ ... }))` 一行定义 store

## 测试账号

- 管理员：admin@example.com / 123456
- 普通用户：user@example.com / 123456

## 实际项目中的差异

本项目用 localStorage 模拟。真实项目中：
- 登录后后端返回 JWT token
- token 存在 httpOnly cookie 里（更安全）
- 每次请求带 token，后端验证
- Next.js 可用 middleware.ts 做服务端路由守卫（性能更好）
