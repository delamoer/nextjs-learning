// src/app/about/page.tsx → URL: /about
// 这是一个 Server Component（默认，没加 'use client'）
// 它在服务器端渲染，浏览器收到的是纯 HTML
// 优点：加载快、SEO 友好、可以直接访问数据库

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold">关于本项目</h1>
      <p className="mt-4 text-gray-600">
        这是一个 Next.js 学习项目，目标是构建一个后台管理系统。
      </p>

      <h2 className="mt-8 text-xl font-semibold">技术栈</h2>
      <ul className="mt-4 list-disc pl-6 text-gray-600 space-y-2">
        <li>Next.js 15（App Router）</li>
        <li>TypeScript</li>
        <li>Tailwind CSS</li>
        <li>shadcn/ui（后续添加）</li>
        <li>TanStack Query（后续添加）</li>
      </ul>

      <Link
        href="/"
        className="mt-8 inline-block text-blue-600 hover:underline"
      >
        ← 返回首页
      </Link>
    </div>
  );
}
