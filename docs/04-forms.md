# 表单处理：React Hook Form + Zod

## 为什么不直接用 useState 管表单？

| 手动方式（useState） | React Hook Form |
|---------------------|-----------------|
| 每个字段一个 useState + onChange | register 一行搞定 |
| 自己写校验逻辑（if/else 一堆） | Zod schema 声明式校验 |
| 提交时手动收集所有字段值 | handleSubmit 自动收集 |
| 性能差（每次输入整个表单重渲染） | 默认非受控模式，不重渲染 |

## 核心流程（三步走）

### 第一步：Zod 定义校验规则

```tsx
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(2, "姓名至少2个字"),
  email: z.string().email("邮箱格式不正确"),
  role: z.enum(["管理员", "编辑", "用户"]),
});

// 自动推导出 TypeScript 类型（不用手写 interface）
type UserFormData = z.infer<typeof userSchema>;
```

### 第二步：useForm 创建表单

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
  resolver: zodResolver(userSchema),
  defaultValues: { name: "", email: "", role: "用户" },
});
```

### 第三步：绑定到 JSX

```tsx
<form onSubmit={handleSubmit(onSubmit)}>
  {/* register 替代 v-model */}
  <input {...register("name")} />
  {errors.name && <p>{errors.name.message}</p>}

  <button type="submit">提交</button>
</form>
```

## Vue 对比

| Vue 2 | React Hook Form + Zod |
|-------|----------------------|
| v-model="form.name" | {...register("name")} |
| rules: [{ required: true }] | z.string().min(1) |
| this.$refs.form.validate() | handleSubmit 自动校验 |
| el-form / a-form 组件 | 无 UI 绑定，配合任意 UI 库 |

## 常用 Zod 校验规则

```tsx
z.string()                    // 字符串
z.string().min(2, "太短")     // 最短 2 字符
z.string().max(50)            // 最长 50
z.string().email("邮箱无效")   // 邮箱格式
z.number().min(0).max(100)    // 数字范围
z.enum(["a", "b", "c"])      // 枚举值
z.string().optional()         // 可选字段
z.string().regex(/^\d{11}$/, "手机号格式错误")  // 正则
```

## Select 等非原生组件的处理

`register` 只能用在原生 input 上。shadcn 的 Select 等自定义组件需要用 `setValue`：

```tsx
const { setValue } = useForm(...);

<Select onValueChange={(val) => setValue("role", val)}>
  ...
</Select>
```

## Zod + TypeScript 的好处

定义一次 schema，同时得到：
1. 运行时校验（用户输入的值合法吗？）
2. 编译时类型（IDE 提示 + 类型检查）

不需要写两遍！schema 就是类型的唯一来源。
