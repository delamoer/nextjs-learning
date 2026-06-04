// page.tsx = 这个路由的页面内容
// 这个文件在 src/app/ 下，所以对应的 URL 是 /（首页）
//
// Next.js 文件路由规则：
// src/app/page.tsx         → /
// src/app/about/page.tsx   → /about
// src/app/users/page.tsx   → /users
// src/app/users/[id]/page.tsx → /users/123（动态路由）
//
// 类比 Vue Router：不用写 routes 配置，文件夹结构 = 路由结构

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">后台管理系统</h1>
        <p className="mt-4 text-gray-500">Next.js + TypeScript + Tailwind</p>
        <div className="mt-8 flex gap-4 justify-center">
          {/* Link 组件 = Vue 的 <router-link>，不会刷新页面 */}
          <Link
            href="/dashboard"
            className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            进入仪表盘
          </Link>
          <Link
            href="/about"
            className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            关于项目
          </Link>
        </div>
      </div>
    </div>
  );
}
