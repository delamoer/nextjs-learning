// 用户管理页面：分页 + 搜索 + CRUD 完整功能
"use client";

import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUsers, useDeleteUser } from "@/hooks/use-users";
import { UserFormDialog } from "@/components/user-form-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Can } from "@/components/permission";
import { usersToCSV, downloadFile } from "@/lib/export";
import { fetchUsers } from "@/lib/api";
import type { User } from "@/lib/api";

export default function UsersPage() {
  // URL 状态同步：搜索和分页参数存在 URL 里
  // 好处：用户刷新不丢失、可以分享链接、浏览器前进后退有效
  // 类比 Vue Router：this.$route.query.page
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // 从 URL 读取参数（默认值处理）
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const pageSize = 5;

  // 更新 URL 参数的工具函数
  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const { data, isLoading, error } = useUsers({ page, pageSize, search });
  const deleteUser = useDeleteUser();

  // 搜索时重置到第一页
  const handleSearch = (value: string) => {
    updateParams({ search: value || null, page: null });
  };

  // 导出全部用户（不分页）
  const handleExport = async () => {
    const result = await fetchUsers({ page: 1, pageSize: 9999 });
    const csv = usersToCSV(result.data);
    downloadFile(csv, `用户数据_${new Date().toLocaleDateString()}.csv`);
  };

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-600">加载失败：{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      {/* 顶部：标题 + 搜索 + 新增 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">用户管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            共 {data?.total ?? 0} 个用户
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            导出 CSV
          </Button>
          <Can permission="user:create">
            <UserFormDialog />
          </Can>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="mt-4">
        <Input
          placeholder="搜索姓名或邮箱..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* 表格 */}
      <div className="mt-4 rounded-lg border bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-gray-400">加载中...</p>
          </div>
        ) : (
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
              {data?.data.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onDelete={() => deleteUser.mutate(user.id)}
                  deleteLoading={deleteUser.isPending}
                />
              ))}
              {data?.data.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    {search ? "没有找到匹配的用户" : "暂无用户"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* 分页 */}
      {data && data.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            第 {data.page} / {data.totalPages} 页
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateParams({ page: String(page - 1) })}
              disabled={page <= 1}
            >
              上一页
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateParams({ page: String(page + 1) })}
              disabled={page >= data.totalPages}
            >
              下一页
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// 表格行组件（抽出来让代码更清晰）
function UserRow({
  user,
  onDelete,
  deleteLoading,
}: {
  user: User;
  onDelete: () => void;
  deleteLoading: boolean;
}) {
  return (
    <tr className="border-b last:border-0">
      <td className="px-4 py-3 font-medium">
        <Link
          href={`/dashboard/users/${user.id}`}
          className="text-blue-600 hover:underline"
        >
          {user.name}
        </Link>
      </td>
      <td className="px-4 py-3 text-gray-500">{user.email}</td>
      <td className="px-4 py-3">
        <Badge variant={user.role === "管理员" ? "default" : "secondary"}>
          {user.role}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1 text-xs ${
            user.status === "active" ? "text-green-600" : "text-gray-400"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              user.status === "active" ? "bg-green-500" : "bg-gray-300"
            }`}
          />
          {user.status === "active" ? "活跃" : "停用"}
        </span>
      </td>
      <td className="px-4 py-3 text-gray-500">{user.createdAt}</td>
      <td className="px-4 py-3">
        <div className="flex gap-1">
          <Can permission="user:edit">
            <UserFormDialog
              editUser={user}
              trigger={
                <span className="cursor-pointer text-blue-500 hover:text-blue-700 text-xs">
                  编辑
                </span>
              }
            />
          </Can>
          <Can permission="user:delete">
            <ConfirmDialog
              trigger={
                <span className="cursor-pointer text-red-500 hover:text-red-700 text-xs ml-2">
                  删除
                </span>
              }
              title="删除用户"
              description={`确定要删除用户「${user.name}」吗？此操作不可撤销。`}
              onConfirm={onDelete}
              loading={deleteLoading}
            />
          </Can>
        </div>
      </td>
    </tr>
  );
}
