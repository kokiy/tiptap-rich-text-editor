# koki Rich Text Editor

[English](README.md) | [中文](README.zh-CN.md)

[![Demo](https://img.shields.io/badge/demo-live-green)](https://kokiy.github.io/koki-rich-text-editor/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TipTap](https://img.shields.io/badge/TipTap-3-ff6b6b?logo=tiptap)](https://tiptap.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-black?logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)

基于 TipTap 3 + React 19 + shadcn/ui 的现代富文本编辑器。

![Demo](public/demo.png)

## 功能

### 文本格式
- **粗体** / *斜体* / <u>下划线</u> / ~~删除线~~
- 文字颜色、背景色、字号
- 下标 / 上标

### 块级元素
- 标题（H1-H3）
- 有序 / 无序列表
- 引用块
- 代码块
- 分割线
- 表格

### 交互
- **Slash 命令菜单** — 输入 `/` 快速插入
- **查找替换** — 大小写敏感、上/下一个、全部替换
- **图片上传** — 本地文件 + base64 内嵌，预留上传接口
- **链接** — 插入 / 编辑超链接
- **对齐** — 左对齐 / 居中 / 右对齐 / 两端对齐
- **撤销 / 重做**
- **明暗主题切换**

## 技术栈

| 类别 | 技术 |
| --- | --- |
| 构建工具 | Vite 8 |
| 框架 | React 19 + TypeScript 7 |
| 编辑器内核 | TipTap 3 (ProseMirror) |
| UI 组件 | shadcn/ui + Tailwind CSS v4 |
| 图标 | lucide-react |
| 包管理 | pnpm |
| Lint / Format | oxlint / oxfmt |
| 测试 | Vitest + Testing Library + jsdom |

## 快速开始

```bash
# 安装依赖
pnpm install

# 开发
pnpm dev

# 构建
pnpm build

# 预览
pnpm preview

# 单元测试
pnpm test

# 代码检查
pnpm lint
pnpm fmt:check
```

## 项目结构

```
src/
├── components/
│   ├── editor/
│   │   ├── editor.tsx          # 编辑器主组件
│   │   ├── editor-toolbar.tsx  # 工具栏容器
│   │   ├── toolbar/            # 各工具栏按钮
│   │   ├── menus/              # slash-menu
│   │   └── find-replace.test.ts
│   └── ui/                     # shadcn/ui 组件
├── extensions/
│   └── image/                  # 自定义图片扩展
├── lib/
│   └── html-highlight.ts       # HTML 格式化与高亮
├── App.tsx
├── main.tsx
└── index.css
```

## 扩展方式

编辑器以 TipTap extension 为单位组织功能。添加新功能时：

1. 安装官方扩展（优先使用 `@tiptap/extension-*`）
2. 在 `src/components/editor/editor.tsx` 的 `extensions` 数组中注册
3. 如需工具栏按钮，在 `src/components/editor/toolbar/` 下新增组件并在 `editor-toolbar.tsx` 中引入

## 部署到 GitHub Pages

```bash
# 默认部署到 /koki-rich-text-editor/ 路径（仓库名）
pnpm run deploy

# 自定义 base path
BASE=/my-repo/ pnpm run deploy
```

脚本会先构建 `dist/`，再用 `gh-pages` 推送到 `gh-pages` 分支。首次部署后，在 GitHub 仓库的 **Settings → Pages** 中将 source 设为 `gh-pages` 分支即可。

## License

MIT
