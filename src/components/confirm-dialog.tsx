/**
 * 通用确认弹窗组件 — 删除等危险操作前二次确认
 *
 * UI 模式：AlertDialog（警告对话框）
 * 和普通 Dialog（对话框）的区别：
 * - AlertDialog 会阻断操作，用户必须做出选择（确认/取消）才能继续
 * - AlertDialog 不能通过点击遮罩层关闭（防止误操作）
 * - 普通 Dialog 点击遮罩层可以关闭
 *
 * 类比 Vue：
 *   Element UI 的 this.$confirm('确定删除？', '提示', { type: 'warning' })
 *   或 <el-dialog> 配合自定义按钮
 *
 * 设计模式：这是一个"可复用组件"
 * 把触发按钮（trigger）作为 prop 传入，内部组合了弹窗的所有逻辑
 * 任何地方需要确认弹窗，都可以用 <ConfirmDialog trigger={<Button>删除</Button>} onConfirm={...} />
 */
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

/**
 * Props 类型定义
 *
 * TypeScript 知识点：
 * - React.ReactNode：React 中最宽泛的"可渲染内容"类型
 *   可以是 JSX 元素、字符串、数字、null 等任何能渲染的东西
 *   用于 trigger prop，因为触发按钮可以是任何 UI 元素
 *
 * - title?: string 和 description?: string 带问号（可选），有默认值
 *   调用时可以不传：<ConfirmDialog trigger={...} onConfirm={...} />
 *   也可以自定义：<ConfirmDialog title="确定移除？" ... />
 */
interface ConfirmDialogProps {
  trigger: React.ReactNode;    // 触发弹窗的元素（通常是一个按钮）
  title?: string;              // 弹窗标题
  description?: string;        // 弹窗描述文字
  onConfirm: () => void;       // 确认后的回调（类比 Vue 的 @confirm）
  loading?: boolean;           // 确认操作进行中（禁用按钮防止重复点击）
}

/**
 * 函数参数的解构 + 默认值
 * { trigger, title = "确认操作", ... } 是解构赋值
 * = "确认操作" 是默认值，如果父组件没传 title，就用这个
 *
 * 类比 Vue 的 props 默认值：
 *   props: { title: { type: String, default: '确认操作' } }
 */
export function ConfirmDialog({
  trigger,
  title = "确认操作",
  description = "此操作不可撤销，确定继续吗？",
  onConfirm,
  loading,
}: ConfirmDialogProps) {
  return (
    /**
     * AlertDialog 组件结构（shadcn/ui 基于 Radix UI）：
     * - AlertDialog：根容器，管理开关状态
     * - AlertDialogTrigger：包裹触发元素
     * - AlertDialogContent：弹窗内容（会自动添加遮罩层和居中定位）
     *   - AlertDialogHeader：标题区域
     *   - AlertDialogFooter：按钮区域
     * - AlertDialogCancel：取消按钮（自动关闭弹窗）
     * - AlertDialogAction：确认按钮
     *
     * 这种"Compound Component"（复合组件）模式在 React UI 库中很常见：
     * 用多个子组件组合出完整功能，结构清晰可定制
     */
    <AlertDialog>
      <AlertDialogTrigger>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* 取消按钮：点击后自动关闭弹窗，不需要手动处理 */}
          <AlertDialogCancel>取消</AlertDialogCancel>
          {/* 确认按钮：红色背景强调危险操作 */}
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}  // loading 时禁用，防止重复点击
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? "处理中..." : "确认删除"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
