// error.tsx：Next.js 约定文件
// 页面组件抛出错误时自动显示此组件（错误边界）
// 不会让整个应用崩溃，只影响当前路由段
// 必须是 Client Component（需要用 useEffect 记录错误）
"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void; // 重试函数：重新渲染出错的组件
}) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="text-4xl">💥</div>
        <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">
          页面出错了
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          {error.message || "发生了未知错误"}
        </p>
        <Button onClick={reset} className="mt-6">
          重试
        </Button>
      </div>
    </div>
  );
}
