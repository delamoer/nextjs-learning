# TypeScript + React 实战速查

## 为什么要用 TypeScript

写代码时 IDE 告诉你哪里错了，不用等运行时才报错。团队协作时，类型就是最好的文档。

## 项目中用到的 TS 模式

### 1. 组件 Props

```tsx
// 用 interface 定义 props 类型
interface StatCardProps {
  title: string;
  value: string;
  trend?: number;  // ? 表示可选
}

function StatCard({ title, value, trend }: StatCardProps) {
  return <div>{title}: {value}</div>
}

// 使用时 IDE 会提示哪些 props 必填、哪些可选
<StatCard title="用户数" value="128" />       // ✓
<StatCard title="用户数" />                   // ✗ 缺 value
<StatCard title="用户数" value={123} />       // ✗ value 要 string 不是 number
```

### 2. children 类型

```tsx
interface LayoutProps {
  children: React.ReactNode;  // 能接受任何 JSX 内容
}

function Layout({ children }: LayoutProps) {
  return <div>{children}</div>
}
```

### 3. 事件类型

```tsx
// 输入框
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value)
}

// 表单提交
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
}

// 按钮点击
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log('clicked')
}
```

### 4. useState 泛型

```tsx
// 简单类型自动推导
const [count, setCount] = useState(0)           // 推导为 number
const [name, setName] = useState("")             // 推导为 string

// 复杂类型需要手动指定
const [user, setUser] = useState<User | null>(null)
const [list, setList] = useState<string[]>([])
```

### 5. 联合类型（Union Types）

```tsx
// 值只能是指定的几个之一
interface User {
  role: "管理员" | "编辑" | "用户";  // 只能是这三个
  status: "active" | "inactive";
}

// 赋值时 IDE 自动提示可选值
const user: User = {
  role: "管理员",     // ✓
  status: "active",   // ✓
}
user.role = "超级管理员"  // ✗ 类型错误
```

### 6. 工具类型

```tsx
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

// Omit：排除某些字段（新增时不需要传 id 和 createdAt）
type CreateUserData = Omit<User, "id" | "createdAt">
// 等于 { name: string; email: string }

// Partial：所有字段变可选（编辑时只传修改的字段）
type UpdateUserData = Partial<User>
// 等于 { id?: number; name?: string; email?: string; createdAt?: string }

// Pick：只保留某些字段
type UserPreview = Pick<User, "id" | "name">
// 等于 { id: number; name: string }
```

### 7. Zod 自动推导类型

```tsx
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

// 从 schema 推导出类型，不用手写 interface
type UserFormData = z.infer<typeof userSchema>
// 等于 { name: string; email: string }
```

### 8. 泛型函数

```tsx
// API 返回值通用包装
interface ApiResponse<T> {
  data: T;
  total: number;
}

// T 可以是任何类型
const response: ApiResponse<User[]> = {
  data: [{ id: 1, name: "张三", ... }],
  total: 1
}
```

## Vue 对比

| Vue 2 | TypeScript React |
|-------|-----------------|
| props: { name: String } | interface Props { name: string } |
| 没有类型检查 | 编译时检查 + IDE 提示 |
| 运行时才知道类型错 | 写代码时就报错 |

## 最常犯的错误

```tsx
// 1. 忘记处理 null
const [user, setUser] = useState<User | null>(null)
user.name  // ✗ user 可能是 null
user?.name // ✓ 可选链

// 2. 事件对象类型
onChange={(e) => ...}  // e 会自动推导，通常不需要手动标注
// 只有抽出函数时才需要标注类型

// 3. as 类型断言（少用）
const value = someValue as string  // 告诉 TS "我确定它是 string"
// 能用类型守卫（if 判断）就不要用 as
```
