// 头像上传组件
// 核心知识：
// 1. input type="file" 选文件
// 2. FileReader 读取文件为 base64 预览
// 3. 实际项目中会上传到 OSS/S3，拿到 URL 存数据库
//    这里用 base64 模拟，重点学模式
"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface AvatarUploadProps {
  currentAvatar?: string;
  onUpload: (dataUrl: string) => void;
}

export function AvatarUpload({ currentAvatar, onUpload }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // FileReader 读取为 base64（浏览器 API）
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);

      // 模拟上传延迟
      setUploading(true);
      setTimeout(() => {
        onUpload(dataUrl);
        setUploading(false);
      }, 500);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-6">
      {/* 头像预览 */}
      <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        {preview ? (
          <img src={preview} alt="头像" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl text-gray-400">
            👤
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs text-white">
            上传中...
          </div>
        )}
      </div>

      <div>
        {/* 隐藏的 file input，通过按钮触发 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
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
