# Next.js 错误处理约定文件

Next.js App Router 提供三个"约定文件"，放在对应路由文件夹下自动生效。

## loading.tsx — 自动 Loading 状态

页面加载时自动显示，数据到了自动切走。底层用了 React Suspense。

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <div className="flex justify-center p-8">加载中...</div>
}
```

**触发时机**：路由切换到该页面时，页面组件还没加载完就显示 loading。

## error.tsx — 错误边界

页面运行时报错，自动捕获并显示错误 UI，不会白屏。

```tsx
// app/dashboard/error.tsx
'use client' // 必须是客户端组件

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="p-8 text-center">
      <h2>出错了：{error.message}</h2>
      <button onClick={reset} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        重试
      </button>
    </div>
  )
}
```

**触发时机**：该路由下的页面组件抛出运行时错误。`reset` 会尝试重新渲染。

## not-found.tsx — 404 页面

```tsx
// app/not-found.tsx（根目录 = 全局 404）
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="p-8 text-center">
      <h2>页面不存在</h2>
      <Link href="/" className="text-blue-500 underline">回首页</Link>
    </div>
  )
}
```

**触发时机**：
- 访问不存在的路由
- 代码里手动调用 `notFound()` 函数

```tsx
import { notFound } from 'next/navigation'

// 在 Server Component 中
const data = await fetchData(id)
if (!data) notFound() // 跳转到最近的 not-found.tsx
```

## 三个文件对比

| 文件 | 作用 | 必须 'use client'? |
|------|------|-------------------|
| `loading.tsx` | 加载中占位 | 不需要 |
| `error.tsx` | 运行时错误捕获 + 重试 | **必须** |
| `not-found.tsx` | 404 页面 | 不需要 |

## Vue 对比

Vue 没有内置等价物，需要手动实现：

```vue
<!-- Vue 里要自己写 v-if -->
<template>
  <div v-if="loading">加载中...</div>
  <div v-else-if="error">出错了：{{ error.message }}</div>
  <div v-else>{{ data }}</div>
</template>
```

**Next.js 的优势**：放个文件就自动生效，不用每个页面写 `v-if` 判断。
