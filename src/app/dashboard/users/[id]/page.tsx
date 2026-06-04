// src/app/dashboard/users/[id]/page.tsx → URL: /dashboard/users/3
// [id] 是动态路由参数（类比 Vue Router 的 :id）
// Next.js App Router 通过 params 传入

import { fetchUser } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { notFound } from "next/navigation";

// 这是一个 Server Component（没有 'use client'）
// 好处：可以直接 async/await 获取数据，不需要 useEffect 或 TanStack Query
// 数据在服务端获取，页面到浏览器时已经渲染好了

interface PageProps {
  params: Promise<{ id: string }>; // Next.js 15 的 params 是 Promise
}

export default async function UserDetailPage({ params }: PageProps) {
  const { id } = await params;
  const user = await fetchUser(Number(id));

  // 用户不存在：显示 404 页面
  if (!user) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/dashboard/users"
        className="text-sm text-blue-600 hover:underline"
      >
        ← 返回用户列表
      </Link>

      <div className="mt-6 rounded-lg border bg-white p-8">
        <div className="flex items-center gap-6">
          {/* 头像 */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-600">
            {user.name[0]}
          </div>

          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="mt-1 text-gray-500">{user.email}</p>
            <div className="mt-2 flex gap-2">
              <Badge variant={user.role === "管理员" ? "default" : "secondary"}>
                {user.role}
              </Badge>
              <Badge variant={user.status === "active" ? "default" : "outline"}>
                {user.status === "active" ? "活跃" : "停用"}
              </Badge>
            </div>
          </div>
        </div>

        {/* 详细信息 */}
        <div className="mt-8 grid grid-cols-2 gap-6">
          <InfoItem label="用户 ID" value={String(user.id)} />
          <InfoItem label="邮箱" value={user.email} />
          <InfoItem label="角色" value={user.role} />
          <InfoItem label="状态" value={user.status === "active" ? "活跃" : "停用"} />
          <InfoItem label="注册时间" value={user.createdAt} />
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
