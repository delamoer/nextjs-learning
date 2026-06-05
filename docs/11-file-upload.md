# 文件上传

## input type="file" 基础

文件上传是纯浏览器 API，和框架无关，Vue / React / Next.js 写法几乎一样。

```tsx
function UploadDemo() {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    console.log(file.name, file.size, file.type)
  }

  return <input type="file" onChange={handleChange} />
}
```

## Base64 预览

用 `FileReader` 把文件转成 Base64，赋给 `<img>` 即可预览：

```tsx
const [preview, setPreview] = useState<string>('')

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => setPreview(reader.result as string)
  reader.readAsDataURL(file) // 转 base64
}

return (
  <div>
    <input type="file" accept="image/*" onChange={handleChange} />
    {preview && <img src={preview} alt="预览" className="w-32 h-32 object-cover" />}
  </div>
)
```

## 文件校验

上传前校验类型和大小，避免无效请求：

```tsx
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 2 * 1024 * 1024 // 2MB

function validate(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) return '只支持 JPG/PNG/WebP'
  if (file.size > MAX_SIZE) return '文件不能超过 2MB'
  return null // 校验通过
}

// 使用
const error = validate(file)
if (error) { alert(error); return }
```

## 真实项目：OSS 上传 vs Base64

| 方案 | 适用场景 | 优缺点 |
|------|----------|--------|
| Base64 存数据库 | 小图标、头像（< 100KB） | 简单，但体积膨胀 33%，数据库压力大 |
| 上传到 OSS/S3 | 正式项目所有文件 | 主流方案，返回 URL 存数据库 |

OSS 上传简化流程：

```
1. 前端选文件 → 2. 调后端接口拿上传凭证 → 3. 前端直传 OSS → 4. 拿到 URL 存数据库
```

## Vue 对比

文件上传是纯浏览器 API，和框架无关：

```vue
<!-- Vue 写法，逻辑完全一样 -->
<input type="file" @change="handleChange" />

<script>
methods: {
  handleChange(e) {
    const file = e.target.files[0]
    // 后续逻辑一模一样
  }
}
</script>
```

**结论**：文件上传不需要学新东西，掌握 `FileReader` 和 `File` API 即可。
