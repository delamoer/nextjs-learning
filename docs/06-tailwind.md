# Tailwind CSS 速查

## 核心思想

不写 CSS 文件，直接在 HTML/JSX 里用"工具类"拼样式。

```tsx
// 传统写法：写 CSS class
<div className="card">...</div>
// .card { padding: 16px; border: 1px solid #e8e8e8; border-radius: 8px; }

// Tailwind：直接在 className 里写
<div className="p-4 border border-gray-200 rounded-lg">...</div>
```

## Vue 对比

| Vue / 传统 CSS | Tailwind |
|---------------|----------|
| 写 .vue 的 `<style>` 部分 | 不写 CSS 文件，在 className 里写 |
| 需要想 class 名字 | 不需要命名 |
| 样式和组件分离 | 样式和 JSX 在一起 |

## 布局

```tsx
// Flex 布局
<div className="flex items-center justify-between gap-4">

// Grid 布局
<div className="grid grid-cols-3 gap-4">

// 居中
<div className="flex items-center justify-center min-h-screen">
```

## 间距（Spacing）

| 类名 | 对应 CSS | 记忆方式 |
|------|---------|---------|
| `p-4` | padding: 16px | p = padding，4 = 4×4=16px |
| `px-4` | padding-left/right: 16px | x = 水平方向 |
| `py-2` | padding-top/bottom: 8px | y = 垂直方向 |
| `m-4` | margin: 16px | m = margin |
| `mt-8` | margin-top: 32px | t = top |
| `mb-4` | margin-bottom: 16px | b = bottom |
| `gap-4` | gap: 16px | flex/grid 子元素间距 |

**换算**：数字 × 4 = px 值。`p-4` = 16px，`p-8` = 32px，`p-1` = 4px。

## 文字

```tsx
<p className="text-sm text-gray-500">         // 小字 + 灰色
<h1 className="text-2xl font-bold">           // 大标题 + 加粗
<span className="text-red-500 font-medium">   // 红色 + 中等粗
```

| 类名 | 效果 |
|------|------|
| `text-xs / sm / base / lg / xl / 2xl / 3xl` | 字号从小到大 |
| `font-normal / medium / semibold / bold` | 字重 |
| `text-gray-500` | 灰色文字（数字越大越深） |
| `text-center` | 居中 |

## 颜色系统

格式：`{属性}-{颜色}-{深度}`

```tsx
text-blue-600     // 文字蓝色
bg-gray-50        // 背景浅灰
border-red-200    // 边框浅红
```

常用颜色：`gray` `red` `blue` `green` `yellow` `purple`
深度：50（最浅）→ 100 → 200 → ... → 900（最深）

## 边框和圆角

```tsx
<div className="border border-gray-200 rounded-lg shadow-sm">

// border         → 1px 边框
// border-gray-200 → 浅灰色
// rounded-lg     → 圆角 8px
// rounded-full   → 圆形
// shadow-sm      → 小阴影
```

## 宽高

```tsx
<div className="w-60">        // width: 240px（60×4）
<div className="w-full">      // width: 100%
<div className="h-screen">    // height: 100vh
<div className="min-h-screen"> // min-height: 100vh
<div className="max-w-2xl">   // max-width: 672px
```

## 响应式

在类名前加断点前缀：

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
// 手机：1列
// sm(640px+)：2列
// lg(1024px+)：3列
```

| 前缀 | 最小宽度 |
|------|---------|
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |

## 交互状态

```tsx
<button className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
// hover:  → 鼠标悬停
// disabled: → 禁用状态
// focus:  → 聚焦状态
// active: → 点击中
```

## 项目中用到的常见组合

```tsx
// 卡片
<div className="rounded-lg border bg-white p-6 shadow-sm">

// 表格行
<tr className="border-b last:border-0">

// 标签
<span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-600">

// 输入框
<input className="w-full rounded-md border px-3 py-2 text-sm">

// 主按钮
<button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
```

## 怎么查类名？

1. 官方文档搜索：https://tailwindcss.com/docs
2. VS Code 装 Tailwind CSS IntelliSense 插件，输入时自动提示
