# Zustand 状态管理

## 什么时候用

| 场景 | 方案 |
|------|------|
| 组件内部状态 | useState |
| 父子传递 | props |
| 2-3 层传递 | props（不要过早用全局状态） |
| 跨层级/全局共享 | Zustand 或 Context |

Zustand 比 Context 好在哪：不需要 Provider 包裹，用起来更简单。

## 基础用法

```tsx
import { create } from "zustand";

// 定义 store（状态 + 操作 写在一起）
interface CounterStore {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

const useCounter = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// 在组件中使用（不需要 Provider！）
function Counter() {
  const { count, increment } = useCounter();
  return <button onClick={increment}>{count}</button>
}
```

## Vue 对比

| Vuex | Zustand |
|------|---------|
| state | 直接定义属性 |
| mutations | set 函数 |
| actions | 普通 async 函数 |
| getters | 直接在组件里算或用 selector |
| 需要 Vue.use(Vuex) | 不需要 Provider |
| 一个大 store | 可以多个独立 store |

## 项目中的用法：鉴权 store

```tsx
// src/hooks/use-auth.ts
const useAuth = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,

  init: () => {
    const user = getAuth();        // 从 localStorage 恢复
    set({ user, isLoading: false });
  },

  login: async (email, password) => {
    const user = await loginAPI(email, password);
    saveAuth(user);
    set({ user, isLoading: false });
  },

  logout: () => {
    clearAuth();
    set({ user: null });
  },
}));
```

任何组件都能直接用：

```tsx
const { user, logout } = useAuth();
// 不需要 Provider 包裹，不需要 useContext
```

## 异步操作

Zustand 不需要特殊语法处理异步，直接 async/await：

```tsx
const useStore = create((set) => ({
  data: null,
  loading: false,

  fetchData: async () => {
    set({ loading: true });
    const data = await fetch("/api/data").then(r => r.json());
    set({ data, loading: false });
  },
}));
```

## 选择器（性能优化）

```tsx
// 不好：每次 store 任何字段变化都重渲染
const { user, count } = useStore();

// 好：只在 user 变化时重渲染
const user = useStore((state) => state.user);
```

## 多个 Store

```tsx
// 按功能拆分，各管各的
const useAuth = create(...)    // 鉴权
const useTheme = create(...)   // 主题
const useCart = create(...)     // 购物车
```

## Zustand vs Redux vs Context

| | Context | Zustand | Redux (RTK) |
|---|---------|---------|-------------|
| 复杂度 | 低 | 低 | 中 |
| 需要 Provider | 是 | 否 | 是 |
| 适合场景 | 简单全局配置 | 中小型状态 | 大型复杂状态 |
| 学习成本 | 几乎没有 | 很低 | 中等 |
| DevTools | 无 | 有 | 有 |

**推荐**：大部分项目用 Zustand 就够了。除非你加入的团队已经在用 Redux。
