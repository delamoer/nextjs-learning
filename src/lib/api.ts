// 模拟 API 层
// 实际项目中这里会用 fetch/axios 调真实后端
// 现在用 setTimeout 模拟网络延迟

export interface User {
  id: number;
  name: string;
  email: string;
  role: "管理员" | "编辑" | "用户";
  status: "active" | "inactive";
  createdAt: string;
}

// 分页请求参数
export interface FetchUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

// 分页响应（后端通常返回这种格式）
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 模拟数据库（多加一些数据方便测分页）
const mockUsers: User[] = [
  { id: 1, name: "张三", email: "zhangsan@example.com", role: "管理员", status: "active", createdAt: "2024-01-15" },
  { id: 2, name: "李四", email: "lisi@example.com", role: "用户", status: "active", createdAt: "2024-02-20" },
  { id: 3, name: "王五", email: "wangwu@example.com", role: "用户", status: "inactive", createdAt: "2024-03-10" },
  { id: 4, name: "赵六", email: "zhaoliu@example.com", role: "编辑", status: "active", createdAt: "2024-04-05" },
  { id: 5, name: "孙七", email: "sunqi@example.com", role: "用户", status: "active", createdAt: "2024-05-18" },
  { id: 6, name: "周八", email: "zhouba@example.com", role: "用户", status: "inactive", createdAt: "2024-06-22" },
  { id: 7, name: "吴九", email: "wujiu@example.com", role: "用户", status: "active", createdAt: "2024-07-11" },
  { id: 8, name: "郑十", email: "zhengshi@example.com", role: "编辑", status: "active", createdAt: "2024-08-03" },
  { id: 9, name: "钱多多", email: "qianduoduo@example.com", role: "用户", status: "active", createdAt: "2024-09-14" },
  { id: 10, name: "陈小明", email: "chenxm@example.com", role: "用户", status: "inactive", createdAt: "2024-10-28" },
  { id: 11, name: "林晓华", email: "linxh@example.com", role: "用户", status: "active", createdAt: "2024-11-05" },
  { id: 12, name: "黄大仙", email: "huangdx@example.com", role: "编辑", status: "active", createdAt: "2024-12-01" },
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 获取用户列表（支持分页 + 搜索）
export async function fetchUsers(
  params: FetchUsersParams = {}
): Promise<PaginatedResponse<User>> {
  await delay(500);

  const { page = 1, pageSize = 5, search = "" } = params;

  // 先搜索过滤
  let filtered = [...mockUsers];
  if (search.trim()) {
    const keyword = search.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(keyword) ||
        u.email.toLowerCase().includes(keyword)
    );
  }

  // 再分页
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return { data, total, page, pageSize, totalPages };
}

// 获取单个用户
export async function fetchUser(id: number): Promise<User | undefined> {
  await delay(300);
  return mockUsers.find((u) => u.id === id);
}

// 删除用户
export async function deleteUser(id: number): Promise<void> {
  await delay(300);
  const index = mockUsers.findIndex((u) => u.id === id);
  if (index !== -1) {
    mockUsers.splice(index, 1);
  }
}

// 新增用户
export async function createUser(
  data: Omit<User, "id" | "createdAt">
): Promise<User> {
  await delay(300);
  const newUser: User = {
    ...data,
    id: Math.max(...mockUsers.map((u) => u.id)) + 1,
    createdAt: new Date().toISOString().split("T")[0],
  };
  mockUsers.push(newUser);
  return newUser;
}

// 更新用户
export async function updateUser(
  id: number,
  data: Partial<Omit<User, "id" | "createdAt">>
): Promise<User> {
  await delay(300);
  const index = mockUsers.findIndex((u) => u.id === id);
  if (index === -1) throw new Error("用户不存在");
  mockUsers[index] = { ...mockUsers[index], ...data };
  return mockUsers[index];
}
