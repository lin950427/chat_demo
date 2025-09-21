import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";
import { fileURLToPath } from "url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 为老旧浏览器生成 legacy 包（通过 SystemJS 与必要 polyfills）
    legacy({
      targets: ["Android >= 5", "iOS >= 9"],
      // 生成器函数、for-of 等需要 regenerator 支持
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // base: "/hongAi/",
  build: {
    // 现代构建的最低语法目标；legacy 插件会额外产出 ES5 兼容包
    target: "es2015",
    // CSS 处理的目标浏览器，确保旧版移动端前缀与语法降级
    cssTarget: ["chrome49", "ios9"],
  },
  server: {
    proxy: {
      // 将所有 /api 开头的请求代理到目标服务器
      "/api": {
        target: "https://honkouai.impdigital.cn/", // 这里替换为实际的后端服务地址
        changeOrigin: true, // 改变请求头中的 Origin
        secure: false, // 如果是 https 接口，需要配置这个参数
      },
    },
  },
});
