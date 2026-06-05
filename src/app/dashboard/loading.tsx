/**
 * loading.tsx — Next.js 约定文件（Convention File）
 *
 * 重要：Next.js App Router 有一套"约定文件"机制：
 * 在路由文件夹中放入特定名称的文件，Next.js 会自动识别并赋予特殊功能：
 *   - page.tsx    → 页面内容
 *   - layout.tsx  → 布局（包裹 page）
 *   - loading.tsx → 加载状态 UI（就是这个文件）
 *   - error.tsx   → 错误状态 UI
 *   - not-found.tsx → 404 页面
 *
 * loading.tsx 的工作原理：
 * Next.js 自动用 React 的 <Suspense> 包裹 page.tsx
 * 当 page 组件在加载（比如 fetch 数据、动态导入等异步操作时），
 * 自动显示 loading.tsx 的内容，加载完成后自动替换为 page 内容
 *
 * 重要：你不需要手动写 useState/loading 控制！Next.js 全自动处理
 *
 * 类比 Vue：
 *   Vue Router 没有这个约定文件机制。Vue 中需要：
 *   1. 手动维护 loading state
 *   2. 或者用 <Suspense> + defineAsyncComponent
 *   Next.js 的方式更简单 —— 放个文件就行
 *
 * 作用范围：这个 loading.tsx 放在 dashboard/ 文件夹下，
 * 所以只影响 /dashboard 及其子路由的加载状态。
 * 如果子路由（如 dashboard/users/）也有自己的 loading.tsx，会优先使用子路由的。
 */

export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        {/**
         * CSS 动画实现的 loading spinner（加载旋转圈）
         * - animate-spin：Tailwind 提供的无限旋转动画
         * - border-4 + border-gray-200：灰色圆环
         * - border-t-blue-600：只有顶边是蓝色 → 旋转时产生"转圈"效果
         */}
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
        <p className="mt-4 text-sm text-gray-400">加载中...</p>
      </div>
    </div>
  );
}
