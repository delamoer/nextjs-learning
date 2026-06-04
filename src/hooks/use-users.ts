// 自定义 Hook：封装用户相关的数据请求
// TanStack Query 的核心：useQuery（查）和 useMutation（增删改）
//
// 类比你之前学的：
// - useQuery ≈ useEffect + useState（但自动处理 loading/error/缓存/重新请求）
// - useMutation ≈ 手动调 API + 手动更新状态（但自动处理失败重试和缓存刷新）

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, deleteUser, createUser, type User } from "@/lib/api";

// 查询用户列表
export function useUsers() {
  return useQuery({
    // queryKey：缓存的唯一标识，相同 key 的数据会被缓存和共享
    queryKey: ["users"],
    // queryFn：实际请求函数
    queryFn: fetchUsers,
  });
  // 返回值：{ data, isLoading, error, refetch, ... }
  // 不需要你手动管 loading/error 状态了！
}

// 删除用户
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    // 删除成功后，自动刷新用户列表
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

// 新增用户
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<User, "id" | "createdAt">) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
