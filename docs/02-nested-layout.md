# 嵌套 Layout + Client Component

## 嵌套 Layout

Next.js 的 layout 可以嵌套。子文件夹的 layout 包裹在父 layout 里面：

```
src/app/layout.tsx            ← 根布局（所有页面共享）
  └─ src/app/dashboard/layout.tsx  ← 仪表盘布局（侧边栏）
      └─ src/app/dashboard/page.tsx     ← /dashboard
      └─ src/app/dashboard/users/page.tsx  ← /dashboard/users
```

**关键特性**：切换 `/dashboard/users` → `/dashboard/settings` 时，`dashboard/layout.tsx` 不会重新渲染。侧边栏保持不变，只有 `{children}` 部分更新。

## Vue 对比

```
<!-- Vue：嵌套 router-view -->
<!-- App.vue -->
<template>
  <router-view />  <!-- 外层 -->
</template>

<!-- DashboardLayout.vue -->
<template>
  <sidebar />
  <router-view />  <!-- 内层 -->
</template>
```

```tsx
// Next.js：嵌套 layout.tsx
// dashboard/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main>{children}</main>  {/* children = 当前页面 */}
    </div>
  )
}
```

## Server vs Client Component 实战

```tsx
// sidebar.tsx —— Client Component（需要 Hook）
"use client";  // ← 这一行声明

import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();  // 浏览器 API，需要 'use client'
  // ...
}
```

```tsx
// dashboard/layout.tsx —— Server Component（默认）
// 不需要 'use client'，因为它只做布局，没有交互逻辑
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />  {/* Server Component 可以导入 Client Component */}
      <main>{children}</main>
    </div>
  )
}
```

**规则**：Server Component 可以导入 Client Component，反过来不行。

## shadcn/ui

安装：`npx shadcn@latest add button badge separator`

使用：

```tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

<Button>点击</Button>
<Badge variant="secondary">标签</Badge>
```

shadcn/ui 不是 npm 包，而是把组件代码复制到你的 `src/components/ui/` 里。你可以直接改源码定制。

## 路径别名 @/

`@/` = `src/` 目录。`import { Sidebar } from "@/components/sidebar"` 等于从 `src/components/sidebar` 导入。在 `tsconfig.json` 里配置的。
