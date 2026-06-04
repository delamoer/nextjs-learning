// loading.tsx：Next.js 约定文件
// 当页面正在加载时自动显示此组件（配合 Suspense 边界）
// 不需要手动控制 loading 状态，Next.js 自动处理
//
// 类比 Vue Router 的 beforeResolve 加载中间状态

export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
        <p className="mt-4 text-sm text-gray-400">加载中...</p>
      </div>
    </div>
  );
}
