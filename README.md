# koki Rich Text Editor

[![Demo](https://img.shields.io/badge/demo-live-green)](https://kokiy.github.io/koki-rich-text-editor/)

基于 TipTap 3 + React 19 + shadcn/ui 的富文本编辑器。

## 特性

- **TipTap 3.x** — 官方扩展驱动，ProseMirror 内核
- **shadcn/ui + Tailwind v4** — 组件库与样式系统
- **Lucide Icons** — 工具栏图标
- **明暗主题切换** — CSS Variables 驱动
- **Slash 命令菜单** — 输入 `/` 快速插入块级元素
- **Bubble 浮动菜单** — 选中文本后出现格式化工具栏
- **查找替换** — 支持大小写敏感、上一个/下一个、全部替换
- **图片上传** — 本地文件选择 + base64 内嵌，预留上传接口
- **表格 / 列表 / 引用 / 代码块** — 常用块级格式
- **文字样式** — 粗体 / 斜体 / 下划线 / 删除线 / 颜色 / 字号
- **对齐方式** — 左对齐 / 居中 / 右对齐 / 两端对齐
- **撤销重做** — 完整历史记录
- **Vitest + Testing Library** — 单元测试
- **oxlint + oxfmt** — 代码检查与格式化

## 技术栈

| 类别 | 技术 |
| --- | --- |
| 构建工具 | Vite 8 |
| 框架 | React 19 + TypeScript 7 |
| 编辑器 | TipTap 3 (ProseMirror) |
| UI | shadcn/ui + Tailwind CSS v4 |
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
│   │   ├── menus/              # slash-menu / bubble-menu
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

## 扩展

编辑器以 TipTap extension 为单位组织功能。添加新功能时：

1. 安装官方扩展（优先使用 `@tiptap/extension-*`）
2. 在 `src/components/editor/editor.tsx` 的 `extensions` 数组中注册
3. 如需工具栏按钮，在 `src/components/editor/toolbar/` 下新增组件并在 `editor-toolbar.tsx` 中引入

## License

MIT

## 部署到 GitHub Pages

```bash
# 默认部署到 /koki-rich-text-editor/ 路径（仓库名）
pnpm run deploy

# 自定义 base path
BASE=/my-repo/ pnpm run deploy
```

脚本会先构建 `dist/`，再用 `gh-pages` 推送到 `gh-pages` 分支。首次部署后，在 GitHub 仓库的 **Settings → Pages** 中将 source 设为 `gh-pages` 分支即可。
