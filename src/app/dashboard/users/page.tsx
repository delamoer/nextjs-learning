// 用户管理页面
// 改成 'use client' 因为要用 TanStack Query 的 Hook
"use client";

import { Badge } from "@/components/ui/badge";
import { useUsers, useDeleteUser } from "@/hooks/use-users";
import { UserFormDialog } from "@/components/user-form-dialog";
import { Button } from "@/components/ui/button";

export default function UsersPage() {
  // useQuery 返回的对象：自动管理 loading / error / data
  // 你之前用 useEffect + useState 手动管的那些，这一行全搞定
  const { data: users, isLoading, error } = useUsers();
  const deleteUser = useDeleteUser();

  // 加载中
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400">加载中...</p>
      </div>
    );
  }

  // 请求出错
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-600">加载失败：{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">用户管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            共 {users?.length ?? 0} 个用户
          </p>
        </div>
        <UserFormDialog />
      </div>

      <div className="mt-6 rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left">
              <th className="px-4 py-3 font-medium">姓名</th>
              <th className="px-4 py-3 font-medium">邮箱</th>
              <th className="px-4 py-3 font-medium">角色</th>
              <th className="px-4 py-3 font-medium">状态</th>
              <th className="px-4 py-3 font-medium">注册时间</th>
              <th className="px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3 text-gray-500">{user.email}</td>
                <td className="px-4 py-3">
                  <Badge
                    variant={user.role === "管理员" ? "default" : "secondary"}
                  >
                    {user.role}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 text-xs ${
                      user.status === "active"
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        user.status === "active"
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                    {user.status === "active" ? "活跃" : "停用"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{user.createdAt}</td>
                <td className="px-4 py-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteUser.mutate(user.id)}
                    disabled={deleteUser.isPending}
                  >
                    删除
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
