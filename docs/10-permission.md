# 前端权限控制

## 三个层级

| 层级 | 控制什么 | 实现方式 |
|------|---------|---------|
| 菜单级 | 侧边栏显示哪些菜单 | 根据角色过滤 navItems |
| 页面级 | 能否访问某个页面 | AuthGuard 或页面内判断 |
| 按钮级 | 能否看到增/删/改按钮 | `<Can>` 组件包裹 |

## 权限定义

```tsx
// src/lib/auth.ts
const permissions = {
  admin:  ["user:read", "user:create", "user:edit", "user:delete", "settings:read", "settings:edit"],
  editor: ["user:read", "user:create", "user:edit", "settings:read"],
  user:   ["user:read"],
};

// 检查权限
function hasPermission(role, permission) {
  return permissions[role].includes(permission);
}
```

格式：`资源:操作`（如 `user:delete`）。清晰且容易扩展。

## 按钮级权限：`<Can>` 组件

```tsx
// 有权限才渲染
<Can permission="user:delete">
  <button>删除</button>
</Can>

// 无权限显示替代内容
<Can permission="user:edit" fallback={<span>无权限</span>}>
  <button>编辑</button>
</Can>
```

也可以用 Hook 方式：

```tsx
const canDelete = usePermission("user:delete");

if (canDelete) {
  // ...
}
```

## 菜单级权限：侧边栏过滤

```tsx
const navItems = [
  { href: "/dashboard", label: "仪表盘", icon: "📊" },
  { href: "/dashboard/users", label: "用户管理", icon: "👥", permission: "user:read" },
  { href: "/dashboard/settings", label: "系统设置", icon: "⚙️", permission: "settings:read" },
];

// 根据权限过滤
const visibleItems = navItems.filter((item) => {
  if (!item.permission) return true;
  return hasPermission(user.role, item.permission);
});
```

## 测试账号

| 角色 | 邮箱 | 能做什么 |
|------|------|---------|
| 管理员 | admin@example.com | 全部功能 |
| 编辑员 | editor@example.com | 看+增+改，不能删 |
| 普通用户 | user@example.com | 只能看 |

密码都是 123456。

## Vue 对比

| Vue 方案 | React 方案 |
|---------|-----------|
| v-if="hasPermission('delete')" | `<Can permission="user:delete">` |
| 自定义指令 v-permission | Can 组件或 usePermission Hook |
| router.beforeEach 里判断 | AuthGuard 组件 + 菜单过滤 |

## 前端 vs 后端权限

```
前端权限 = 控制"看不看得到"（UI 展示）
后端权限 = 控制"做不做得到"（API 验证）

两者缺一不可：
- 只有前端：懂技术的人直接调 API 绕过
- 只有后端：用户看到按钮点了没反应，体验差
```
