// 数据导出工具
// 纯前端实现 CSV 导出（不需要后端）
// 实际大项目中大数据量导出会由后端生成文件 URL，前端下载

import type { User } from "./api";

// 将用户数据转成 CSV 格式字符串
export function usersToCSV(users: User[]): string {
  // CSV 头
  const headers = ["ID", "姓名", "邮箱", "角色", "状态", "注册时间"];

  // 数据行
  const rows = users.map((u) => [
    u.id,
    u.name,
    u.email,
    u.role,
    u.status === "active" ? "活跃" : "停用",
    u.createdAt,
  ]);

  // 合并：用逗号分隔，换行连接
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  // 加 BOM 头，Excel 打开中文不乱码
  return "﻿" + csvContent;
}

// 触发浏览器下载
export function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
