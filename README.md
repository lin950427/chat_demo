# chat_demo

轻量的 React + TypeScript + Vite 聊天演示项目（AI 小虹前端）。

本仓库包含一个使用 Vite 构建的静态前端应用，包含国际化、聊天组件、以及与后端 API 的轻量封装。

## 目录结构（主要文件）

- `src/` - 源代码
  - `components/` - 可复用组件（聊天、UI、布局等）
  - `pages/` - 页面级组件（home、chat 等）
  - `lib/` - 请求封装、工具函数、hooks 等
  - `i18n/` - 国际化配置
  - `main.tsx` - 应用入口
- `public/` - 静态资源
- `dist_test/` `dist_prod/` - 构建产物（测试/生产）
- `vite.config.ts`, `tsconfig.json`, `package.json` - 构建与依赖配置

## 快速开始

确保已安装 Node.js（推荐 v16+）与 pnpm。当前master分支对应测试环境，prod分支对应生产环境

1. 安装依赖

```bash
pnpm install
```

2. 开发模式（带热重载）

```bash
pnpm dev
```

3. 构建

```bash
# 生产构建
pnpm build:prod
# 测试环境构建
pnpm build:test

```

4. 本地预览构建产物

```bash
pnpm preview:test
# 或者
npm preview:prod
```

## 项目要点

- 使用 Tailwind CSS（见 `tailwind.config.js`）进行样式化。
- 使用 `react-router-dom` 做路由。部分页面和路由在 `src/pages` 中。
- 国际化通过 `react-i18next` 实现，语言文件在 `src/i18n`。
- Axios 封装在 `src/lib/api` 下（`axios.ts`、`chat.ts` 等）。
