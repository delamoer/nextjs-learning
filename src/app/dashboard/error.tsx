/**
 * error.tsx — Next.js 约定文件（错误边界）
 *
 * 重要概念：错误边界（Error Boundary）
 * 当页面组件在渲染过程中抛出未捕获的错误时，
 * 不会让整个应用白屏/崩溃，而是只在出错的"路由段"显示这个错误 UI。
 * 其他部分（如侧边栏、导航栏）不受影响，仍然可以正常操作。
 *
 * 类比 Vue：
 *   Vue 有 errorCaptured 生命周期钩子和 errorHandler 全局配置
 *   但没有像 Next.js 这样"放个文件就自动生效"的约定机制
 *   Vue 中需要手动写 <ErrorBoundary> 组件或用 try/catch
 *
 * 重要：error.tsx 必须是 Client Component（"use client"）
 * 因为 reset 函数需要在客户端重新触发渲染
 *
 * Next.js 提供的 props：
 * - error：Error 对象，包含错误信息
 * - reset：重试函数，调用后会重新渲染出错的组件（用户点"重试"时调用）
 */
"use client";

import { Button } from "@/components/ui/button";

/**
 * TypeScript 知识点：内联类型定义
 * { error: Error & { digest?: string }; reset: () => void }
 *
 * - Error：JavaScript 原生的错误类型
 * - & { digest?: string }：交叉类型（Intersection Type），表示在 Error 基础上
 *   额外添加一个可选的 digest 属性（Next.js 在生产环境添加的错误摘要 hash）
 * - reset: () => void：Next.js 自动传入的重试函数
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="text-4xl">💥</div>
        <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">
          页面出错了
        </h2>
        {/* 显示错误信息，方便用户/开发者了解出了什么问题 */}
        <p className="mt-2 text-sm text-gray-500">
          {error.message || "发生了未知错误"}
        </p>
        {/**
         * 重试按钮：调用 reset() 重新渲染出错的组件
         * Next.js 会重新执行 page 组件的渲染逻辑
         * 如果错误是临时性的（如网络抖动），重试可能成功
         */}
        <Button onClick={reset} className="mt-6">
          重试
        </Button>
      </div>
    </div>
  );
}
