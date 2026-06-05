# Tailwind 响应式设计

## 断点

Tailwind 用 Mobile-first（移动优先），无前缀 = 手机，加前缀 = 更大屏幕：

| 前缀 | 最小宽度 | 典型设备 |
|------|----------|----------|
| (无) | 0px | 手机 |
| `sm` | 640px | 大手机/小平板 |
| `md` | 768px | 平板 |
| `lg` | 1024px | 笔记本 |
| `xl` | 1280px | 桌面显示器 |
| `2xl` | 1536px | 大屏 |

## Mobile-first 思路

先写手机样式，再用断点前缀往上加：

```tsx
// 手机单列，md 以上两列，lg 以上三列
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card />
  <Card />
  <Card />
</div>
```

**理解方式**：`md:grid-cols-2` 意思是"屏幕 >= 768px 时用两列"。

## 常用模式：显示/隐藏

```tsx
{/* 手机上隐藏，lg 以上显示 */}
<div className="hidden lg:block">
  <Sidebar />
</div>

{/* lg 以上隐藏，手机上显示 */}
<button className="lg:hidden">
  打开菜单
</button>
```

记忆口诀：
- `hidden lg:block` = 大屏才显示（侧边栏）
- `lg:hidden` = 大屏隐藏（汉堡按钮）

## Sheet 组件做移动端侧边栏

shadcn/ui 的 Sheet 组件适合做手机端抽屉菜单：

```tsx
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left">
        <nav>
          <a href="/dashboard">仪表盘</a>
          <a href="/settings">设置</a>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
```

典型布局结构：

```tsx
<header>
  {/* 手机：汉堡菜单 */}
  <MobileNav />        {/* lg:hidden */}
  {/* 桌面：直接显示导航 */}
  <DesktopNav />       {/* hidden lg:flex */}
</header>
```

## 调试技巧

1. Chrome DevTools → 切换设备模式（Ctrl+Shift+M）
2. 选择不同设备或手动拖拽宽度
3. 观察断点切换效果

## 文字和间距的响应式

```tsx
{/* 手机小字，桌面大字 */}
<h1 className="text-xl md:text-3xl lg:text-5xl">标题</h1>

{/* 手机小间距，桌面大间距 */}
<div className="p-4 md:p-8 lg:p-12">内容</div>
```

**总结**：记住 `hidden lg:block` 和 `lg:hidden` 这一对，覆盖 80% 的响应式需求。
