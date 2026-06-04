# 项目架构总览

## 目录结构

```
src/
  app/                      ← 路由层（Next.js App Router）
    layout.tsx              ← 根布局（全局 Provider）
    page.tsx                ← 首页 /
    login/page.tsx          ← 登录页 /login
    about/page.tsx          ← 关于页 /about
    dashboard/
      layout.tsx            ← 仪表盘布局（侧边栏 + AuthGuard）
      page.tsx              ← /dashboard
      users/page.tsx        ← /dashboard/users
      settings/page.tsx     ← /dashboard/settings

  components/               ← 组件层
    ui/                     ← shadcn/ui 基础组件（不要手动改）
      button.tsx
      badge.tsx
      dialog.tsx
      ...
    sidebar.tsx             ← 业务组件：侧边栏
    auth-guard.tsx          ← 业务组件：路由守卫
    user-form-dialog.tsx    ← 业务组件：新增用户弹窗
    providers.tsx           ← Provider 包装

  hooks/                    ← 自定义 Hook 层
    use-auth.ts             ← 鉴权状态（Zustand）
    use-users.ts            ← 用户数据请求（TanStack Query）

  lib/                      ← 工具/API 层
    api.ts                  ← API 请求函数 + 数据类型定义
    auth.ts                 ← 鉴权工具函数
    utils.ts                ← 通用工具（cn 函数等）

  docs/                     ← 学习笔记
```

## 分层原则

```
页面（app/）     只做布局和渲染，不写业务逻辑
    ↓ 调用
Hook（hooks/）   封装数据请求和状态管理
    ↓ 调用
API（lib/）      定义请求函数和数据类型
```

好处：换后端只改 lib/api.ts，页面和 Hook 不用动。

## 数据流

```
用户操作
  ↓
组件调用 Hook（useUsers / useAuth）
  ↓
Hook 调用 API 函数（fetchUsers / loginAPI）
  ↓
API 返回数据
  ↓
Hook 更新状态（TanStack Query 缓存 / Zustand store）
  ↓
组件自动重渲染
```

## Server vs Client Component 分布

```
Server Component（默认）：
  - layout.tsx（布局）
  - about/page.tsx（纯展示）
  - dashboard/page.tsx（静态数据展示）

Client Component（'use client'）：
  - sidebar.tsx（用了 usePathname Hook）
  - auth-guard.tsx（用了 useEffect + useRouter）
  - users/page.tsx（用了 TanStack Query Hook）
  - user-form-dialog.tsx（用了 useForm Hook）
  - providers.tsx（用了 QueryClientProvider Context）
```

**规则**：需要 Hook 或事件处理 → Client。纯展示/纯布局 → Server。

## 技术选型理由

| 技术 | 选它的原因 | 替代方案 |
|------|-----------|---------|
| Next.js | React 官方推荐框架，SSR/SSG/路由/部署一条龙 | Vite + React Router |
| TypeScript | 类型安全，IDE 提示，团队协作必须 | JavaScript |
| Tailwind CSS | 不用起名，不用切文件，响应式方便 | CSS Modules / styled-components |
| shadcn/ui | 代码在项目里可定制，不像 antd 是黑盒 | Ant Design / MUI |
| TanStack Query | 请求缓存、loading 状态、自动刷新全管了 | useEffect + fetch |
| React Hook Form | 非受控模式性能好，配合 Zod 类型安全 | 手动 useState |
| Zustand | 不用 Provider，API 简洁，够用 | Redux / Context |

## 添加新页面的步骤

1. 在 `src/app/dashboard/` 下新建文件夹和 `page.tsx`
2. 如果需要数据请求：在 `lib/api.ts` 加请求函数 + 类型
3. 在 `hooks/` 下新建 `use-xxx.ts` 封装 useQuery/useMutation
4. 页面组件调用 Hook 渲染数据
5. 在 `components/sidebar.tsx` 的 navItems 里加导航项

## 添加新表单的步骤

1. 用 Zod 定义 schema（校验规则 + 类型一步到位）
2. 用 `useForm` + `zodResolver` 创建表单
3. 用 shadcn 的 Input/Select/Dialog 组件搭 UI
4. 提交时调 `useMutation`
