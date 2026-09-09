# Tiptap Rich Text Editor

[English](README.md) | [中文](README.zh-CN.md)

[![Demo](https://img.shields.io/badge/demo-live-green)](https://kokiy.github.io/koki-rich-text-editor/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TipTap](https://img.shields.io/badge/TipTap-3-ff6b6b?logo=tiptap)](https://tiptap.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-black?logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)

A modern rich text editor built with TipTap 3, React 19, and shadcn/ui.

![Demo](public/demo.png)

## Features

### Text Formatting
- **Bold** / *Italic* / Underline / ~~Strikethrough~~
- Text color, background color, font size
- Subscript / superscript

### Block Elements
- Headings (H1-H3)
- Ordered / unordered lists
- Block quotes
- Code blocks
- Dividers
- Tables

### Interactions
- **Slash command menu** — type `/` for quick insert
- **Find & replace** — case-sensitive, prev/next, replace all
- **Image upload** — local file + base64, with upload hook
- **Links** — insert / edit hyperlinks
- **Alignment** — left / center / right / justify
- **Undo / Redo**
- **Light / dark theme toggle**

## Tech Stack

| Category | Technology |
| --- | --- |
| Build tool | Vite 8 |
| Framework | React 19 + TypeScript 7 |
| Editor core | TipTap 3 (ProseMirror) |
| UI components | shadcn/ui + Tailwind CSS v4 |
| Icons | lucide-react |
| Package manager | pnpm |
| Lint / Format | oxlint / oxfmt |
| Testing | Vitest + Testing Library + jsdom |

## Getting Started

```bash
# Install dependencies
pnpm install

# Development
pnpm dev

# Build
pnpm build

# Preview
pnpm preview

# Unit tests
pnpm test

# Lint & format check
pnpm lint
pnpm fmt:check
```

## Project Structure

```
src/
├── components/
│   ├── editor/
│   │   ├── editor.tsx          # Main editor component
│   │   ├── editor-toolbar.tsx  # Toolbar container
│   │   ├── toolbar/            # Individual toolbar buttons
│   │   ├── menus/              # slash-menu
│   │   └── find-replace.test.ts
│   └── ui/                     # shadcn/ui components
├── extensions/
│   └── image/                  # Custom image extension
├── lib/
│   └── html-highlight.ts       # HTML formatting & syntax highlighting
├── App.tsx
├── main.tsx
└── index.css
```

## Extending

Features are organized as TipTap extensions. To add a new feature:

1. Install the official extension (prefer `@tiptap/extension-*`)
2. Register it in the `extensions` array in `src/components/editor/editor.tsx`
3. If a toolbar button is needed, add a new component under `src/components/editor/toolbar/` and include it in `editor-toolbar.tsx`

## Deploy to GitHub Pages

```bash
# Default: deploy to /koki-rich-text-editor/ (repo name)
pnpm run deploy

# Custom base path
BASE=/my-repo/ pnpm run deploy
```

The script builds `dist/` and pushes it to the `gh-pages` branch via `gh-pages`. After the first deploy, go to the repo's **Settings → Pages** and set the source to the `gh-pages` branch.

## License

MIT
