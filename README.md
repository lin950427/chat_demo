# chat_demo

轻量的 React + TypeScript + Vite 聊天演示项目（AI 小虹前端）。

本仓库包含一个使用 Vite 构建的静态前端应用，包含国际化、聊天组件、以及与后端 API 的轻量封装。

## 目录结构（主要文件）

- `src/` - 源代码
  - `components/` - 可复用组件（聊天、UI、布局等）
  - `pages/` - 页面级组件（home、chat、disclaimer 等）
  - `lib/` - 请求封装、工具函数、hooks 等
  - `i18n/` - 国际化配置
  - `main.tsx` - 应用入口
- `public/` - 静态资源
- `dist_test/` `dist_prod/` - 构建产物（测试/生产）
- `vite.config.ts`, `tsconfig.json`, `package.json` - 构建与依赖配置

## 快速开始

确保已安装 Node.js（推荐 v16+）与 pnpm 或 npm。

1. 安装依赖

```bash
pnpm install
# 或者
npm install
```

2. 开发模式（带热重载）

```bash
pnpm dev
# 或者
npm run dev
```

3. 生产构建

```bash
pnpm build
# 或者
npm run build
```

4. 本地预览构建产物

```bash
pnpm preview
# 或者
npm run preview
```

## 项目要点

- 使用 Tailwind CSS（见 `tailwind.config.js`）进行样式化。
- 使用 `react-router-dom` 做路由。部分页面和路由在 `src/pages` 中。
- 国际化通过 `react-i18next` 实现，语言文件在 `src/i18n`。
- Axios 封装在 `src/lib/api` 下（`axios.ts`、`chat.ts` 等）。

## 贡献

如需修改或添加功能，请创建分支并提交 PR。提交说明请包含变更目的与影响范围。

## 许可

默认未指定许可证。如需开源发布，请添加适当的 LICENSE 文件。

---

如果你想我把 README 调整为中文/英文双语格式、添加使用截图、或补充 API 文档，我可以继续完善。
