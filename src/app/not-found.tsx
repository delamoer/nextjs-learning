/**
 * not-found.tsx — Next.js 约定文件（全局 404 页面）
 *
 * 触发条件（两种方式）：
 * 1. 自动触发：用户访问了不存在的路由（如 /abc123），Next.js 自动显示此页面
 * 2. 手动触发：在 Server Component 中调用 notFound() 函数
 *    例如：从数据库查用户，查不到就 notFound()，显示这个页面
 *
 * 文件位置说明：
 * - 放在 src/app/not-found.tsx → 全局 404（任何未匹配的路由）
 * - 也可以放在子目录下（如 app/dashboard/not-found.tsx）→ 只处理该路由段的 404
 *
 * 类比 Vue Router：
 *   Vue Router 用通配符路由处理 404：
 *   { path: '/:pathMatch(.*)*', component: NotFound }
 *   Next.js 的方式更简单 —— 直接放文件即可，不需要配置路由规则
 *
 * 注意：这个文件是 Server Component（没有 "use client"），
 * 因为 404 页面通常不需要交互逻辑，纯展示即可
 */

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-6xl font-bold text-gray-200">404</p>
        <h1 className="mt-4 text-xl font-bold text-gray-900">页面未找到</h1>
        <p className="mt-2 text-gray-500">你访问的页面不存在</p>
        {/**
         * Next.js 的 <Link> 组件：客户端导航（不刷新页面）
         * 类比 Vue Router 的 <router-link to="/dashboard">
         * 底层是 <a> 标签，但 Next.js 做了优化：
         *   - 自动预加载目标页面的代码（hover 时就开始加载）
         *   - 客户端路由切换（不会整页刷新）
         */}
        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          返回仪表盘
        </Link>
      </div>
    </div>
  );
}
