// 系统设置页：多 Tab 表单（常见后台布局模式）
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Can } from "@/components/permission";

// ===== 个人信息表单 =====
const profileSchema = z.object({
  name: z.string().min(2, "姓名至少 2 个字"),
  email: z.string().email("邮箱格式不正确"),
  bio: z.string().max(200, "最多 200 字").optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

function ProfileTab() {
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "管理员", email: "admin@example.com", bio: "" },
  });

  const onSubmit = (data: ProfileFormData) => {
    console.log("保存个人信息:", data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">姓名</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">邮箱</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">个人简介</Label>
        <textarea
          id="bio"
          {...register("bio")}
          className="w-full rounded-md border px-3 py-2 text-sm min-h-[80px] resize-none"
          placeholder="介绍一下自己..."
        />
        {errors.bio && <p className="text-sm text-red-500">{errors.bio.message}</p>}
      </div>
      <Button type="submit">
        {saved ? "✓ 已保存" : "保存修改"}
      </Button>
    </form>
  );
}

// ===== 通知设置 =====
function NotificationTab() {
  const [settings, setSettings] = useState({
    emailNotify: true,
    pushNotify: false,
    weeklyReport: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-md space-y-6">
      <SwitchItem
        label="邮件通知"
        description="接收系统邮件通知"
        checked={settings.emailNotify}
        onToggle={() => toggle("emailNotify")}
      />
      <SwitchItem
        label="推送通知"
        description="接收浏览器推送通知"
        checked={settings.pushNotify}
        onToggle={() => toggle("pushNotify")}
      />
      <SwitchItem
        label="周报邮件"
        description="每周一收到数据周报"
        checked={settings.weeklyReport}
        onToggle={() => toggle("weeklyReport")}
      />
    </div>
  );
}

function SwitchItem({
  label,
  description,
  checked,
  onToggle,
}: {
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div>
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onToggle} />
    </div>
  );
}

// ===== 安全设置 =====
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "请输入当前密码"),
    newPassword: z.string().min(6, "新密码至少 6 位"),
    confirmPassword: z.string().min(1, "请确认密码"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "两次密码不一致",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

function SecurityTab() {
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = (data: PasswordFormData) => {
    console.log("修改密码:", data);
    setSaved(true);
    reset();
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">当前密码</Label>
        <Input id="currentPassword" type="password" {...register("currentPassword")} />
        {errors.currentPassword && (
          <p className="text-sm text-red-500">{errors.currentPassword.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">新密码</Label>
        <Input id="newPassword" type="password" {...register("newPassword")} />
        {errors.newPassword && (
          <p className="text-sm text-red-500">{errors.newPassword.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">确认新密码</Label>
        <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>
      <Button type="submit">
        {saved ? "✓ 密码已修改" : "修改密码"}
      </Button>
    </form>
  );
}

// ===== 主页面 =====
export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">系统设置</h1>
      <p className="mt-1 text-sm text-gray-500">管理你的账户和偏好</p>

      <div className="mt-6">
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">个人信息</TabsTrigger>
            <TabsTrigger value="notification">通知设置</TabsTrigger>
            <TabsTrigger value="security">安全设置</TabsTrigger>
          </TabsList>

          <div className="mt-6 rounded-lg border bg-white p-6">
            <TabsContent value="profile">
              <ProfileTab />
            </TabsContent>
            <TabsContent value="notification">
              <NotificationTab />
            </TabsContent>
            <TabsContent value="security">
              <Can
                permission="settings:edit"
                fallback={
                  <p className="text-gray-400">你没有权限修改安全设置</p>
                }
              >
                <SecurityTab />
              </Can>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
