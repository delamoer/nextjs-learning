// 鉴权逻辑层
// 实际项目用 JWT token 存 cookie，调后端验证
// 这里用 localStorage 模拟，重点学模式不学细节

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}

// 模拟用户数据库
const mockAccounts = [
  { email: "admin@example.com", password: "123456", user: { id: 1, name: "管理员", email: "admin@example.com", role: "admin" as const } },
  { email: "user@example.com", password: "123456", user: { id: 2, name: "普通用户", email: "user@example.com", role: "user" as const } },
];

// 模拟登录 API
export async function loginAPI(email: string, password: string): Promise<AuthUser> {
  await new Promise((r) => setTimeout(r, 500));

  const account = mockAccounts.find(
    (a) => a.email === email && a.password === password
  );

  if (!account) {
    throw new Error("邮箱或密码错误");
  }

  return account.user;
}

// localStorage 存取（浏览器端）
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
