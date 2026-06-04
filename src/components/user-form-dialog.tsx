// 新增用户弹窗：React Hook Form + Zod 校验
// React Hook Form：管表单状态（类比 Vue 的 v-model，但更强大）
// Zod：定义校验规则（类比 Vue 里用的 vee-validate 或自己写的 rules）
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateUser } from "@/hooks/use-users";
import { useState } from "react";

// 第一步：用 Zod 定义校验规则
// 类比 Vue：你之前可能用对象 { required: true, message: '请输入' } 定义规则
// Zod 更强大：定义完规则就自动得到 TypeScript 类型
const userSchema = z.object({
  name: z.string().min(2, "姓名至少 2 个字"),
  email: z.string().email("邮箱格式不正确"),
  role: z.enum(["管理员", "编辑", "用户"], {
    message: "请选择角色",
  }),
  status: z.enum(["active", "inactive"]),
});

// 从 Zod schema 自动推导出 TypeScript 类型！
// 等于你手动写 interface { name: string; email: string; ... }
// 但不用写两遍（校验规则和类型定义保持同步）
type UserFormData = z.infer<typeof userSchema>;

export function UserFormDialog() {
  const [open, setOpen] = useState(false);
  const createUser = useCreateUser();

  // 第二步：用 useForm 创建表单实例
  // register：注册字段（替代 v-model）
  // handleSubmit：包装提交函数（自动校验）
  // formState.errors：校验错误信息
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema), // 接入 Zod 校验
    defaultValues: {
      name: "",
      email: "",
      role: "用户",
      status: "active",
    },
  });

  // 第三步：提交处理
  const onSubmit = (data: UserFormData) => {
    createUser.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        + 新增用户
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>新增用户</DialogTitle>
        </DialogHeader>

        {/* handleSubmit 会先校验，通过了才调 onSubmit */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* 姓名 */}
          <div className="space-y-2">
            <Label htmlFor="name">姓名</Label>
            <Input
              id="name"
              placeholder="请输入姓名"
              {...register("name")} // register 替代 v-model
            />
            {/* 校验错误提示 */}
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* 邮箱 */}
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              placeholder="请输入邮箱"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* 角色（Select 组件不能直接 register，需要用 setValue） */}
          <div className="space-y-2">
            <Label>角色</Label>
            <Select
              defaultValue="用户"
              onValueChange={(val) =>
                setValue("role", val as UserFormData["role"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="管理员">管理员</SelectItem>
                <SelectItem value="编辑">编辑</SelectItem>
                <SelectItem value="用户">用户</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          {/* 提交按钮 */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              取消
            </Button>
            <Button type="submit" disabled={createUser.isPending}>
              {createUser.isPending ? "提交中..." : "确认添加"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
