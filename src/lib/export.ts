/**
 * 数据导出工具 — 纯前端实现 CSV 文件导出下载
 *
 * 核心知识点：
 * 1. CSV 格式：纯文本，逗号分隔字段，换行分隔行。Excel/Numbers 都能打开
 * 2. Blob：浏览器中表示二进制数据的对象
 * 3. URL.createObjectURL：为 Blob 生成临时 URL
 * 4. 动态创建 <a> 标签触发下载
 *
 * 适用场景：数据量不大（几千条以内）的前端导出
 * 实际大项目中（几万条+）：后端生成文件 → 返回下载 URL → 前端跳转下载
 */

/**
 * import type：只导入类型，不导入运行时代码
 * 编译后会被完全删除，不会增加打包体积
 * 好习惯：只用到类型时，用 import type
 */
import type { User } from "./api";

/**
 * 将用户数组转成 CSV 格式字符串
 *
 * CSV 格式示例：
 * ID,姓名,邮箱,角色,状态,注册时间
 * 1,张三,zhangsan@test.com,admin,活跃,2024-01-01
 * 2,李四,lisi@test.com,editor,停用,2024-02-01
 */
export function usersToCSV(users: User[]): string {
  // 第一行：表头
  const headers = ["ID", "姓名", "邮箱", "角色", "状态", "注册时间"];

  // 后续行：每个用户一行，字段顺序和表头对应
  const rows = users.map((u) => [
    u.id,
    u.name,
    u.email,
    u.role,
    u.status === "active" ? "活跃" : "停用", // 把英文状态转成中文
    u.createdAt,
  ]);

  // 用逗号拼接每行的字段，用换行符拼接各行
  const csvContent = [
    headers.join(","),              // "ID,姓名,邮箱,角色,状态,注册时间"
    ...rows.map((row) => row.join(",")), // 每行的数据
  ].join("\n");                     // 行与行之间换行

  /**
   * 重要：加 BOM 头（﻿，即 "﻿"）
   * BOM = Byte Order Mark，是一个不可见的 Unicode 字符
   * 加了它之后，Excel 打开 CSV 文件时能正确识别 UTF-8 编码
   * 不加的话，Excel 打开中文会显示乱码（默认用 GBK/ANSI 解码）
   */
  return "﻿" + csvContent;
}

/**
 * 触发浏览器下载文件
 *
 * 纯前端下载的经典模式（不需要后端接口），流程：
 * 1. 把字符串包装成 Blob（二进制大对象）
 * 2. 为 Blob 生成一个临时 URL（blob:http://...）
 * 3. 创建一个隐藏的 <a> 标签，设置 href 和 download 属性
 * 4. 程序化触发 click → 浏览器弹出"另存为"对话框
 * 5. 释放临时 URL（避免内存泄漏）
 *
 * 类比 Vue：Vue 中也是完全一样的写法，这是浏览器 API，和框架无关
 */
export function downloadFile(content: string, filename: string) {
  // Blob 构造函数：第一个参数是内容数组，第二个是 MIME 类型
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });

  // 生成临时 URL（形如 blob:http://localhost:3000/uuid-xxx）
  const url = URL.createObjectURL(blob);

  // 动态创建 <a> 标签（不需要添加到 DOM 中）
  const link = document.createElement("a");
  link.href = url;
  link.download = filename; // download 属性指定下载文件名

  // 触发点击 → 开始下载
  link.click();

  // 重要：释放 Blob URL，否则它会一直占用内存直到页面关闭
  URL.revokeObjectURL(url);
}
