// not-found.tsx：Next.js 约定文件
// 访问不存在的路由时显示（全局 404）
// 也可以在 Server Component 里调 notFound() 手动触发

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-6xl font-bold text-gray-200">404</p>
        <h1 className="mt-4 text-xl font-bold text-gray-900">页面未找到</h1>
        <p className="mt-2 text-gray-500">你访问的页面不存在</p>
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
