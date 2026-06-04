// layout.tsx 是整个应用的"壳"
// 类比 Vue 的 App.vue —— 所有页面都渲染在这个布局里
// children 就是当前路由对应的页面内容

import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


// 这个 metadata 对象会自动变成 <head> 里的 <title> 和 <meta>
// 不用手动写 HTML head —— Next.js 帮你管
export const metadata: Metadata = {
  title: "后台管理系统",
  description: "Next.js 学习项目",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode; // TypeScript：children 的类型是 React 节点
}) {
  return (
    <html lang="zh-CN" className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen bg-gray-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
