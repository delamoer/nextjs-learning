// src/app/dashboard/page.tsx → URL: /dashboard
// 后续这里会变成仪表盘，现在先放个占位

import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">仪表盘</h1>
      <p className="mt-2 text-gray-500">这里后续会展示数据概览</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="用户数" value="128" />
        <StatCard title="今日访问" value="1,024" />
        <StatCard title="待处理" value="5" />
      </div>

      <Link
        href="/"
        className="mt-8 inline-block text-blue-600 hover:underline"
      >
        ← 返回首页
      </Link>
    </div>
  );
}

// 这是一个局部组件，不需要单独文件
// TypeScript：用 interface 定义 props 类型
interface StatCardProps {
  title: string;
  value: string;
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
