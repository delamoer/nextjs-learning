/**
 * 系统设置页 — 多 Tab 表单（后台管理最常见的页面模式之一）
 *
 * 核心知识点：
 * 1. Tabs（标签页）：多个表单/面板切换展示
 * 2. react-hook-form：React 生态最主流的表单库（类比 Vue 的 VeeValidate）
 * 3. Zod：TypeScript 优先的数据校验库（定义 schema → 自动获得类型 + 校验规则）
 * 4. Zod .refine()：自定义校验（如"两次密码必须一致"这种跨字段校验）
 *
 * 页面结构：
 * - 个人信息 Tab：基础表单 + 头像上传
 * - 通知设置 Tab：开关列表
 * - 安全设置 Tab：密码修改表单 + 权限控制
 */
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
import { AvatarUpload } from "@/components/avatar-upload";

// ========================================
// ===== 个人信息表单 Tab =====
// ========================================

/**
 * Zod Schema 定义 — 表单校验规则
 *
 * Zod 的核心思想：用 JS/TS 代码描述数据的"形状和约束"
 * 一份 schema 同时搞定两件事：
 * 1. 运行时校验（提交表单时检查数据是否合法）
 * 2. TypeScript 类型推导（z.infer 自动生成 TS 类型，不用手写 interface）
 *
 * 类比 Vue：
 *   Vue + Element UI 的表单校验规则：rules: { name: [{ required: true, min: 2 }] }
 *   Zod 的写法更简洁，且自带 TS 类型推导（Element UI 的 rules 不能生成类型）
 */
const profileSchema = z.object({
  name: z.string().min(2, "姓名至少 2 个字"),    // 字符串，最少 2 个字符
  email: z.string().email("邮箱格式不正确"),       // 字符串，必须是合法邮箱格式
  bio: z.string().max(200, "最多 200 字").optional(), // 可选，最多 200 字符
});

/**
 * TypeScript 知识点：z.infer<typeof schema> — 从 Zod schema 自动推导出 TS 类型
 *
 * profileSchema 推导出的类型等价于：
 * type ProfileFormData = { name: string; email: string; bio?: string }
 *
 * 好处：schema 改了，类型自动更新。不用手动同步 interface 和 rules
 * 这叫 "Single Source of Truth"（单一数据源）
 */
type ProfileFormData = z.infer<typeof profileSchema>;

function ProfileTab() {
  // 保存成功的提示状态
  const [saved, setSaved] = useState(false);

  /**
   * react-hook-form 的 useForm hook
   *
   * 类比 Vue：
   *   Vue 的表单处理：v-model 绑定 + 手动 validate
   *   react-hook-form 的方式：register 注册字段 → handleSubmit 处理提交 → errors 获取错误
   *
   * 关键概念：
   * - register("name")：返回 { onChange, onBlur, ref, name }，展开到 <Input> 上
   *   相当于给 input 自动绑定了 v-model + 校验
   * - handleSubmit(onSubmit)：包装提交函数，先校验再执行
   * - formState.errors：当前所有字段的错误信息
   *
   * resolver: zodResolver(profileSchema)
   *   把 Zod schema 接入 react-hook-form 作为校验规则
   *   这叫"解析器（resolver）模式"：表单库 + 校验库解耦，可以换成 Yup 等其他库
   */
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
    setTimeout(() => setSaved(false), 2000); // 2 秒后恢复按钮文字
  };

  return (
    /**
     * handleSubmit(onSubmit)：
     * 1. 阻止默认的表单提交行为（和 Vue 的 @submit.prevent 一样）
     * 2. 执行 Zod 校验
     * 3. 校验通过才调用 onSubmit，否则把错误填入 errors
     */
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-6">
      {/* 头像上传 */}
      <div className="space-y-2">
        <Label>头像</Label>
        <AvatarUpload onUpload={(url) => console.log("头像已上传:", url)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">姓名</Label>
        {/**
         * {...register("name")} 展开注册返回的属性
         * 相当于：onChange={...} onBlur={...} ref={...} name="name"
         * 类比 Vue 的 v-model="form.name" + 校验规则绑定
         */}
        <Input id="name" {...register("name")} />
        {/* 有错误时显示红色提示文字 */}
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

// ========================================
// ===== 通知设置 Tab =====
// ========================================

function NotificationTab() {
  // 多个开关的状态放在一个对象中（比多个 useState 更整洁）
  const [settings, setSettings] = useState({
    emailNotify: true,
    pushNotify: false,
    weeklyReport: true,
  });

  /**
   * TypeScript 知识点：keyof typeof
   *
   * typeof settings → { emailNotify: boolean; pushNotify: boolean; weeklyReport: boolean }
   * keyof typeof settings → "emailNotify" | "pushNotify" | "weeklyReport"
   *
   * 这样 toggle 函数只接受这三个合法的 key，传错字符串会报错
   * 比 toggle(key: string) 更安全
   */
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

/** 开关项：独立的小组件，使用内联类型定义（不需要单独 interface） */
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
      {/* Switch 组件：受控模式，checked + onCheckedChange */}
      <Switch checked={checked} onCheckedChange={onToggle} />
    </div>
  );
}

// ========================================
// ===== 安全设置 Tab（密码修改）=====
// ========================================

/**
 * 重要：Zod 的 .refine() 方法 — 自定义跨字段校验
 *
 * 普通校验（min/max/email）只能校验单个字段
 * 但"两次密码一致"需要同时比较两个字段，这时用 .refine()
 *
 * .refine(校验函数, { message, path })：
 * - 校验函数：接收整个表单数据对象，返回 true/false
 * - message：校验失败时的错误信息
 * - path：错误应该显示在哪个字段下面（这里是 confirmPassword）
 *
 * 类比 Vue + Element UI：
 *   Element UI 的自定义 validator：
 *   { validator: (rule, value, callback) => { ... callback(new Error('xxx')) } }
 *   但 Element UI 不方便做跨字段校验，需要手动读取其他字段值
 *   Zod 的 refine 天然支持跨字段，因为接收的是整个对象
 */
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "请输入当前密码"),
    newPassword: z.string().min(6, "新密码至少 6 位"),
    confirmPassword: z.string().min(1, "请确认密码"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "两次密码不一致",
    path: ["confirmPassword"], // 错误挂在 confirmPassword 字段上
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

function SecurityTab() {
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    reset, // reset()：清空表单（密码修改成功后清空输入框）
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = (data: PasswordFormData) => {
    console.log("修改密码:", data);
    setSaved(true);
    reset();  // 清空表单：密码修改成功后不应该还显示密码
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
        {/* 这里会显示 refine 的错误信息："两次密码不一致" */}
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

// ========================================
// ===== 主页面：Tabs 布局 =====
// ========================================

/**
 * Tabs 组件结构说明（shadcn/ui）：
 * - <Tabs defaultValue="profile">：容器，defaultValue 设置默认选中的 Tab
 * - <TabsList>：Tab 按钮的容器（那一行标签）
 * - <TabsTrigger value="xxx">：单个 Tab 按钮，value 必须和 TabsContent 的 value 对应
 * - <TabsContent value="xxx">：Tab 对应的内容面板，切换时自动显示/隐藏
 *
 * 类比 Vue + Element UI：
 *   <el-tabs v-model="activeTab">
 *     <el-tab-pane label="个人信息" name="profile">内容</el-tab-pane>
 *   </el-tabs>
 */
export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">系统设置</h1>
      <p className="mt-1 text-sm text-gray-500">管理你的账户和偏好</p>

      <div className="mt-6">
        <Tabs defaultValue="profile">
          {/* Tab 标签栏 */}
          <TabsList>
            <TabsTrigger value="profile">个人信息</TabsTrigger>
            <TabsTrigger value="notification">通知设置</TabsTrigger>
            <TabsTrigger value="security">安全设置</TabsTrigger>
          </TabsList>

          {/* Tab 内容区 */}
          <div className="mt-6 rounded-lg border bg-white p-6">
            <TabsContent value="profile">
              <ProfileTab />
            </TabsContent>
            <TabsContent value="notification">
              <NotificationTab />
            </TabsContent>
            <TabsContent value="security">
              {/**
               * <Can> 权限组件：只有拥有 "settings:edit" 权限的用户才能看到内容
               * fallback 是没权限时显示的替代内容
               *
               * 类比 Vue：
               *   v-if="hasPermission('settings:edit')" 或
               *   Vue 的自定义指令 v-permission="'settings:edit'"
               *
               * React 的做法更显式：用组件包裹，权限逻辑封装在 <Can> 内部
               */}
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
