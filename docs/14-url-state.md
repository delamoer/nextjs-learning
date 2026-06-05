# URL 状态同步

## 为什么用 URL 管理状态

把筛选条件、搜索词、分页等放到 URL 里，好处：

- **分享链接**：别人打开看到一样的筛选结果
- **刷新不丢失**：状态在 URL 里，刷新页面还在
- **浏览器前进/后退**：自动回到之前的状态

## useSearchParams — 读 URL 参数

```tsx
'use client'
import { useSearchParams } from 'next/navigation'

// URL: /products?category=phone&page=2
function ProductList() {
  const searchParams = useSearchParams()

  const category = searchParams.get('category') // 'phone'
  const page = searchParams.get('page')         // '2'（注意是字符串）

  return <div>分类：{category}，第 {page} 页</div>
}
```

## router.push — 写 URL 参数

```tsx
'use client'
import { useRouter, useSearchParams } from 'next/navigation'

function Filters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilter = (category: string) => {
    // 基于现有参数构建新的
    const params = new URLSearchParams(searchParams.toString())
    params.set('category', category)
    params.set('page', '1') // 切分类时重置页码

    router.push(`/products?${params.toString()}`)
  }

  return (
    <div>
      <button onClick={() => handleFilter('phone')}>手机</button>
      <button onClick={() => handleFilter('laptop')}>笔记本</button>
    </div>
  )
}
```

## 完整示例：搜索 + 分页

```tsx
'use client'
import { useRouter, useSearchParams } from 'next/navigation'

function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const query = searchParams.get('q') ?? ''
  const page = Number(searchParams.get('page') ?? '1')

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([k, v]) => params.set(k, v))
    router.push(`?${params.toString()}`)
  }

  return (
    <div>
      <input
        defaultValue={query}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            updateParams({ q: e.currentTarget.value, page: '1' })
          }
        }}
        placeholder="搜索..."
      />
      <div>当前第 {page} 页</div>
      <button onClick={() => updateParams({ page: String(page + 1) })}>
        下一页
      </button>
    </div>
  )
}
```

## 什么状态放 URL，什么不放

| 放 URL | 不放 URL |
|--------|----------|
| 搜索词、筛选条件 | 弹窗开关 |
| 当前页码、排序方式 | 表单填写中的值 |
| Tab 切换 | 动画状态 |

判断标准：**刷新后还需要保留的 → 放 URL**。

## Vue 对比

```js
// Vue 2 读参数
this.$route.query.category

// Vue 2 写参数
this.$router.push({ query: { category: 'phone', page: '1' } })
```

```tsx
// Next.js 读参数
const category = searchParams.get('category')

// Next.js 写参数
router.push(`/products?category=phone&page=1`)
```

**核心差异**：Vue 用对象 `{ query: {} }`，Next.js 用 `URLSearchParams` 拼字符串。逻辑一样。
