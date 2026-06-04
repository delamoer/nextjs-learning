// Provider 包装组件
// 为什么单独建这个文件？
// - QueryClientProvider 需要 'use client'（因为它用了 Context）
// - 但 layout.tsx 最好保持 Server Component
// - 解决方案：把 Provider 抽成 Client Component，在 layout 里导入
//
// 这是 Next.js 项目的标准做法
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // 用 useState 确保每个请求有独立的 QueryClient（SSR 安全）
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
