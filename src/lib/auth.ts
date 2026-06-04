// 鉴权 + 权限逻辑层

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "editor" | "user";
}

// 权限定义：每个角色能做什么
// 实际项目中这通常由后端返回，前端只做展示控制
const permissions = {
  admin: ["user:read", "user:create", "user:edit", "user:delete", "settings:read", "settings:edit"],
  editor: ["user:read", "user:create", "user:edit", "settings:read"],
  user: ["user:read"],
} as const;

// 所有可能的权限值（TypeScript 从 permissions 对象推导）
export type Permission = (typeof permissions)[keyof typeof permissions][number];

// 检查角色是否有某个权限
export function hasPermission(role: AuthUser["role"], permission: Permission): boolean {
  return (permissions[role] as readonly string[]).includes(permission);
}

// 获取角色的所有权限
export function getPermissions(role: AuthUser["role"]): readonly string[] {
  return permissions[role];
}

// 角色中文名
export function getRoleName(role: AuthUser["role"]): string {
  const names = { admin: "管理员", editor: "编辑", user: "普通用户" };
  return names[role];
}

// 模拟用户数据库（加了 editor 角色）
const mockAccounts = [
  { email: "admin@example.com", password: "123456", user: { id: 1, name: "管理员", email: "admin@example.com", role: "admin" as const } },
  { email: "editor@example.com", password: "123456", user: { id: 2, name: "编辑员", email: "editor@example.com", role: "editor" as const } },
  { email: "user@example.com", password: "123456", user: { id: 3, name: "普通用户", email: "user@example.com", role: "user" as const } },
];

export async function loginAPI(email: string, password: string): Promise<AuthUser> {
  await new Promise((r) => setTimeout(r, 500));
  const account = mockAccounts.find(
    (a) => a.email === email && a.password === password
  );
  if (!account) throw new Error("邮箱或密码错误");
  return account.user;
}

const AUTH_KEY = "auth_user";

export function saveAuth(user: AuthUser) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function getAuth(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(AUTH_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}
