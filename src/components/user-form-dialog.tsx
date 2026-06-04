// 用户表单弹窗：新增 + 编辑共用一个组件
// 通过 editUser prop 区分模式
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
import { useCreateUser, useUpdateUser } from "@/hooks/use-users";
import { useEffect, useState } from "react";
import type { User } from "@/lib/api";

const userSchema = z.object({
  name: z.string().min(2, "姓名至少 2 个字"),
  email: z.string().email("邮箱格式不正确"),
  role: z.enum(["管理员", "编辑", "用户"], { message: "请选择角色" }),
  status: z.enum(["active", "inactive"]),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormDialogProps {
  editUser?: User;       // 传了 = 编辑模式，不传 = 新增模式
  trigger?: React.ReactNode;
}

export function UserFormDialog({ editUser, trigger }: UserFormDialogProps) {
  const [open, setOpen] = useState(false);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const isEdit = !!editUser;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "用户",
      status: "active",
    },
  });

  // 编辑模式：弹窗打开时填充数据
  useEffect(() => {
    if (open && editUser) {
      reset({
        name: editUser.name,
        email: editUser.email,
        role: editUser.role,
        status: editUser.status,
      });
    } else if (open && !editUser) {
      reset({ name: "", email: "", role: "用户", status: "active" });
    }
  }, [open, editUser, reset]);

  const onSubmit = (data: UserFormData) => {
    if (isEdit) {
      updateUser.mutate(
        { id: editUser.id, data },
        { onSuccess: () => { setOpen(false); } }
      );
    } else {
      createUser.mutate(data, {
        onSuccess: () => { setOpen(false); reset(); },
      });
    }
  };

  const isPending = createUser.isPending || updateUser.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {trigger ?? "+ 新增用户"}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "编辑用户" : "新增用户"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">姓名</Label>
            <Input id="name" placeholder="请输入姓名" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input id="email" type="email" placeholder="请输入邮箱" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>角色</Label>
            <Select
              defaultValue={editUser?.role ?? "用户"}
              onValueChange={(val) => setValue("role", val as UserFormData["role"])}
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

          <div className="space-y-2">
            <Label>状态</Label>
            <Select
              defaultValue={editUser?.status ?? "active"}
              onValueChange={(val) => setValue("status", val as UserFormData["status"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">活跃</SelectItem>
                <SelectItem value="inactive">停用</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "提交中..." : isEdit ? "保存修改" : "确认添加"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
