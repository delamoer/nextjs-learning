// 仪表盘首页：数据统计卡片 + 图表
"use client";

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

// 模拟数据
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

      {/* 统计卡片 */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="总用户" value="128" change="+12%" positive />
        <StatCard title="今日访问" value="1,024" change="+8%" positive />
        <StatCard title="活跃用户" value="89" change="-3%" positive={false} />
        <StatCard title="待处理事项" value="5" change="0" />
      </div>

      {/* 图表区 */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 折线图：本周访问趋势 */}
        <div className="rounded-lg border bg-white p-6">
          <h3 className="text-sm font-medium text-gray-500">本周访问趋势</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyVisits}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
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

        {/* 柱状图：用户增长 */}
        <div className="rounded-lg border bg-white p-6">
          <h3 className="text-sm font-medium text-gray-500">月度用户增长</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyUsers}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// 统计卡片组件
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  positive?: boolean;
}

function StatCard({ title, value, change, positive }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-white p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
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
