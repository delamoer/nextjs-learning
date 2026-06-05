/**
 * 仪表盘首页 — 数据统计卡片 + 可视化图表
 *
 * 核心知识点：Recharts 图表库
 * Recharts 是 React 生态中最流行的图表库之一，基于 D3.js
 * 特点：声明式 API（用组件写图表配置），和 React 风格一致
 *
 * 类比 Vue 生态：
 *   Vue 常用 ECharts（通过 vue-echarts 封装）
 *   ECharts 是配置式（传一个大 option 对象）
 *   Recharts 是组件式（每个配置项都是一个子组件）
 *
 * 文件约定：
 * 这是 app/dashboard/page.tsx，对应路由 /dashboard
 * export default 导出的组件就是这个路由的页面内容
 */
"use client";

/**
 * Recharts 组件说明：
 * - LineChart / BarChart：折线图 / 柱状图的容器
 * - Line / Bar：数据系列（一条线 / 一组柱子）
 * - XAxis / YAxis：X 轴 / Y 轴
 * - CartesianGrid：网格线（背景参考线）
 * - Tooltip：鼠标悬浮时显示的数据提示框
 * - ResponsiveContainer：响应式容器，图表自动适应父元素宽高
 */
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/**
 * 模拟数据（实际项目中从 API 获取）
 * Recharts 要求的数据格式：对象数组，每个对象是一个数据点
 * dataKey 指定用哪个字段作为图表数据
 */
const weeklyVisits = [
  { day: "周一", visits: 120 },
  { day: "周二", visits: 180 },
  { day: "周三", visits: 150 },
  { day: "周四", visits: 210 },
  { day: "周五", visits: 280 },
  { day: "周六", visits: 190 },
  { day: "周日", visits: 140 },
];

const monthlyUsers = [
  { month: "1月", count: 45 },
  { month: "2月", count: 52 },
  { month: "3月", count: 61 },
  { month: "4月", count: 78 },
  { month: "5月", count: 92 },
  { month: "6月", count: 108 },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">仪表盘</h1>
      <p className="mt-1 text-sm text-gray-500">数据概览</p>

      {/**
       * 统计卡片区域
       *
       * grid 布局 + 响应式列数：
       * - grid-cols-1：默认（手机）一列
       * - sm:grid-cols-2：sm(640px+) 时两列
       * - lg:grid-cols-4：lg(1024px+) 时四列
       *
       * 类比 Vue + Element UI：<el-row :gutter="16"><el-col :xs="24" :sm="12" :lg="6">
       * Tailwind 的方式更直接，不需要额外组件
       */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/**
         * positive 不传值等于 positive={true}（Boolean prop 简写）
         * 类比 Vue：<stat-card positive /> 等价于 <stat-card :positive="true" />
         */}
        <StatCard title="总用户" value="128" change="+12%" positive />
        <StatCard title="今日访问" value="1,024" change="+8%" positive />
        <StatCard title="活跃用户" value="89" change="-3%" positive={false} />
        <StatCard title="待处理事项" value="5" change="0" />
      </div>

      {/* 图表区：大屏两列并排，小屏一列 */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* ===== 折线图：本周访问趋势 ===== */}
        <div className="rounded-lg border bg-white p-6">
          <h3 className="text-sm font-medium text-gray-500">本周访问趋势</h3>
          <div className="mt-4 h-64">
            {/**
             * ResponsiveContainer：响应式容器
             * width="100%" height="100%" 让图表自动充满父元素
             * 重要：Recharts 图表必须有明确的宽高，否则不显示
             * 所以父 div 设了 h-64（256px 高度）
             */}
            <ResponsiveContainer width="100%" height="100%">
              {/**
               * LineChart 折线图：
               * - data={weeklyVisits}：数据源
               * - 子组件都是图表的"配置项"：
               */}
              <LineChart data={weeklyVisits}>
                {/* 网格线：strokeDasharray="3 3" 表示虚线（3px 实线 + 3px 空白） */}
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                {/* X 轴：dataKey="day" 指定用数据中的 day 字段作为 X 轴标签 */}
                <XAxis dataKey="day" fontSize={12} />
                {/* Y 轴：自动根据数据范围计算刻度 */}
                <YAxis fontSize={12} />
                {/* Tooltip：鼠标悬浮时显示当天的具体数值 */}
                <Tooltip />
                {/**
                 * Line：一条数据折线
                 * - type="monotone"：平滑曲线（还有 "linear" 直线等选项）
                 * - dataKey="visits"：用数据中的 visits 字段作为 Y 值
                 * - stroke：线条颜色
                 * - dot={{ r: 4 }}：数据点的半径
                 */}
                <Line
                  type="monotone"
                  dataKey="visits"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ===== 柱状图：用户增长 ===== */}
        <div className="rounded-lg border bg-white p-6">
          <h3 className="text-sm font-medium text-gray-500">月度用户增长</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyUsers}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                {/**
                 * Bar：柱状图数据
                 * - dataKey="count"：用 count 字段决定柱子高度
                 * - fill：柱子填充颜色
                 * - radius={[4, 4, 0, 0]}：四个圆角值 [左上, 右上, 右下, 左下]
                 *   只有顶部有圆角，底部是直角 → 柱子顶部圆润，底部平齐
                 */}
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 统计卡片 — 局部组件（没有 export，只在本文件内使用）
 *
 * 设计模式：当一个组件只在当前文件使用、且比较简单时，
 * 直接在同一个文件里定义即可，不需要单独建文件
 * 这是 React 的灵活之处 —— 一个文件可以有多个组件
 *
 * 类比 Vue：Vue 的 SFC（.vue 文件）一个文件只能一个组件
 * 如果要复用需要单独建文件。React 更灵活但也容易写得过长
 */
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  positive?: boolean; // 可选：正增长（绿色）还是负增长（红色）
}

function StatCard({ title, value, change, positive }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-white p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      {/* change 为 "0" 时不显示增减百分比 */}
      {change !== "0" && (
        <p
          className={`mt-1 text-sm ${
            positive ? "text-green-600" : "text-red-500"
          }`}
        >
          {change} 较上周
        </p>
      )}
    </div>
  );
}
