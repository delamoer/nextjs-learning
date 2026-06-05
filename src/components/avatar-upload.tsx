/**
 * 头像上传组件
 *
 * 核心知识点：
 * 1. useRef 操作 DOM 元素（隐藏的 file input）
 * 2. FileReader API 读取文件为 base64 预览
 * 3. 文件上传的常见 UI 模式：隐藏原生 input，用自定义按钮触发
 *
 * 实际项目中的上传流程：选文件 → 上传到 OSS/S3 → 拿到 URL → 存数据库
 * 这里用 base64 模拟，重点学交互模式
 */
"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * 组件 Props 的类型定义
 *
 * TypeScript 知识点：
 * - currentAvatar?: string — 问号表示可选属性（可以不传），类比 Vue props 的 required: false
 * - onUpload: (dataUrl: string) => void — 回调函数 prop，上传完成后通知父组件
 *   类比 Vue 的 this.$emit('upload', dataUrl)
 *   React 没有 emit 机制，用"传回调函数"代替
 */
interface AvatarUploadProps {
  currentAvatar?: string;
  onUpload: (dataUrl: string) => void;
}

export function AvatarUpload({ currentAvatar, onUpload }: AvatarUploadProps) {
  // 预览图片的 URL（base64 格式），有值就显示图片，null 显示占位符
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  // 上传状态：控制 loading UI 和禁用按钮
  const [uploading, setUploading] = useState(false);

  /**
   * 重要：useRef 的经典用法 — 获取 DOM 元素的引用
   *
   * 类比 Vue：
   *   Vue 2: this.$refs.fileInput
   *   Vue 3: const fileInput = ref<HTMLInputElement | null>(null)，模板里 ref="fileInput"
   *   React: const fileInputRef = useRef<HTMLInputElement>(null)，JSX 里 ref={fileInputRef}
   *
   * 为什么需要 ref？因为 <input type="file"> 很丑且无法用 CSS 自定义
   * 所以把它隐藏（className="hidden"），用自定义按钮触发它的 click 事件
   */
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * 文件选择后的处理函数
   *
   * TypeScript 知识点：
   * React.ChangeEvent<HTMLInputElement> 是 React 对原生 change 事件的类型包装
   * 通过泛型 <HTMLInputElement> 告诉 TS 事件来自 input 元素
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    /**
     * e.target.files 是 FileList（类数组），?.[0] 取第一个文件
     * ?. 是可选链：如果 files 是 null/undefined，不会报错，返回 undefined
     */
    const file = e.target.files?.[0];
    if (!file) return;

    // 校验：只接受图片，最大 2MB
    if (!file.type.startsWith("image/")) {
      alert("请选择图片文件");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("图片大小不能超过 2MB");
      return;
    }

    /**
     * FileReader：浏览器原生 API，用于读取本地文件内容
     *
     * readAsDataURL(file) 把文件读成 base64 字符串（如 "data:image/png;base64,iVBOR..."）
     * 读取完成后触发 onload 回调，通过 reader.result 拿到结果
     *
     * 重要：FileReader 是异步的（不能同步读文件），所以用回调模式
     * 类比 Vue 中也是一样的写法，这不是 React 特有的
     */
    const reader = new FileReader();
    reader.onload = () => {
      // `as string` 是类型断言：告诉 TS "我确定这是 string"
      // 因为 reader.result 的类型是 string | ArrayBuffer | null
      const dataUrl = reader.result as string;
      setPreview(dataUrl); // 立即预览

      // 模拟上传延迟（实际项目中这里是 fetch/axios 调接口）
      setUploading(true);
      setTimeout(() => {
        onUpload(dataUrl); // 通知父组件上传完成（类比 Vue 的 $emit）
        setUploading(false);
      }, 500);
    };
    reader.readAsDataURL(file); // 开始读取文件
  };

  return (
    <div className="flex items-center gap-6">
      {/* 头像预览区域 */}
      <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        {/* 三元表达式条件渲染：有图片显示图片，没有显示默认头像 */}
        {preview ? (
          <img src={preview} alt="头像" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl text-gray-400">
            👤
          </div>
        )}
        {/* 上传中的遮罩层：absolute + inset-0 全覆盖父容器 */}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs text-white">
            上传中...
          </div>
        )}
      </div>

      <div>
        {/**
         * 隐藏的原生 file input
         * - ref={fileInputRef}：绑定 ref，之后可以通过 fileInputRef.current 操作它
         * - accept="image/*"：文件选择器只显示图片
         * - className="hidden"：隐藏它，用下面的 Button 代替
         */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {/**
         * 自定义上传按钮
         * onClick 时调用 fileInputRef.current?.click() 触发隐藏 input 的点击
         * 这是 Web 开发中"美化文件上传按钮"的标准模式
         */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "上传中..." : "更换头像"}
        </Button>
        <p className="mt-1 text-xs text-gray-400">支持 JPG/PNG，最大 2MB</p>
      </div>
    </div>
  );
}
