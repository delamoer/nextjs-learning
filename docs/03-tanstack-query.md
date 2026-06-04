# TanStack Query 数据请求

## 为什么不直接用 useEffect + fetch？

| 手动方式（useEffect） | TanStack Query |
|----------------------|----------------|
| 自己管 loading/error/data 三个 state | 自动管理 |
| 自己处理缓存 | 自动缓存，相同 queryKey 不重复请求 |
| 自己处理竞态（快速切换） | 自动处理 |
| 自己写 refetch 逻辑 | 窗口聚焦自动重新请求 |
| 自己处理乐观更新 | 内置支持 |

一句话：TanStack Query 把你在 useEffect 里手动做的那些事情全自动化了。

## 核心 API

### useQuery — 查询数据

```tsx
import { useQuery } from "@tanstack/react-query";

const { data, isLoading, error } = useQuery({
  queryKey: ["users"],     // 缓存 key（数组格式）
  queryFn: fetchUsers,     // 请求函数（返回 Promise）
});

// 用 queryKey 标识数据：
// ["users"]           → 用户列表
// ["users", 5]        → id=5 的用户
// ["users", { page: 2 }] → 第2页
```

### useMutation — 增删改

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

const deleteMutation = useMutation({
  mutationFn: (id: number) => deleteUser(id),
  onSuccess: () => {
    // 操作成功后刷新列表缓存
    queryClient.invalidateQueries({ queryKey: ["users"] });
  },
});

// 调用
deleteMutation.mutate(userId);
deleteMutation.isPending  // 是否正在执行
```

## Vue 对比

| Vue | React + TanStack Query |
|-----|----------------------|
| mounted + axios | useQuery |
| 手动 loading 变量 | isLoading 自动管理 |
| watch + 重新请求 | queryKey 变了自动重新请求 |
| 没有内置方案 | 缓存、去重、自动刷新全内置 |

## 项目中的架构分层

```
src/
  lib/api.ts          ← API 层：定义请求函数和数据类型
  hooks/use-users.ts  ← Hook 层：用 useQuery/useMutation 封装
  app/.../page.tsx    ← 页面层：调用 Hook，只管渲染
```

页面组件不关心数据怎么来的，只调 `useUsers()` 拿数据。换后端只改 api.ts，页面不用动。

## Provider 配置

TanStack Query 需要 Provider 包裹应用。在 Next.js 中的标准做法：

```tsx
// src/components/providers.tsx
"use client";  // Provider 需要 'use client'
import { QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// src/app/layout.tsx（Server Component）
import { Providers } from "@/components/providers";
// 在 body 里包裹
<Providers>{children}</Providers>
```

## TypeScript 要点

```tsx
// 定义类型，所有地方共享
export interface User {
  id: number;
  name: string;
  role: "管理员" | "编辑" | "用户";  // 联合类型
}

// Omit 工具类型：排除某些字段
// 新增用户时不需要传 id 和 createdAt
type CreateUserData = Omit<User, "id" | "createdAt">;
```
