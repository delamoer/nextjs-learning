# App Router 文件路由

## 核心概念

Next.js 不需要手动配置路由。**文件夹结构 = 路由结构**。

## 路由规则

```
src/app/page.tsx              → /
src/app/about/page.tsx        → /about
src/app/dashboard/page.tsx    → /dashboard
src/app/users/page.tsx        → /users
src/app/users/[id]/page.tsx   → /users/123（动态路由）
```

每个路由文件夹里可以有这些特殊文件：

| 文件 | 作用 |
|------|------|
| `page.tsx` | 页面内容（必须有，否则这个路由不可访问） |
| `layout.tsx` | 布局（包裹 page 和子路由，切换路由时不重新渲染） |
| `loading.tsx` | 加载状态（自动显示在页面加载时） |
| `error.tsx` | 错误处理（页面出错时显示） |
| `not-found.tsx` | 404 页面 |

## Vue 对比

| Vue Router | Next.js App Router |
|------------|-------------------|
| `routes: [{ path: '/about', component: About }]` | 创建 `app/about/page.tsx` 文件就行 |
| `<router-link to="/about">` | `<Link href="/about">` |
| `<router-view />` | `{children}`（在 layout.tsx 里） |
| `this.$router.push('/about')` | `useRouter().push('/about')`（需要 `'use client'`） |
| 嵌套路由用 `children` 配置 | 文件夹嵌套就是嵌套路由 |

## Server Component vs Client Component

```tsx
// 默认是 Server Component（在服务器运行）
// ✓ 可以 async/await
// ✓ 可以直接查数据库
// ✗ 不能用 useState、useEffect、onClick 等

export default function Page() {
  return <h1>我在服务器渲染</h1>
}
```

```tsx
// 加 'use client' 变成 Client Component（在浏览器运行）
// ✓ 可以用 useState、useEffect、onClick 等
// ✗ 不能直接查数据库
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**判断标准**：需要交互（state、事件）→ 加 `'use client'`。纯展示 → 不加（默认 Server）。

## Link 组件

```tsx
import Link from "next/link";

// 普通链接
<Link href="/about">关于</Link>

// 带样式
<Link href="/dashboard" className="text-blue-600">仪表盘</Link>
```

跟 `<a>` 标签的区别：Link 不会刷新整个页面（客户端导航），a 标签会。

## TypeScript 注意点

```tsx
// props 用 interface 定义类型
interface StatCardProps {
  title: string;
  value: string;
}

function StatCard({ title, value }: StatCardProps) {
  return <div>{title}: {value}</div>
}
```
