import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
// import legacy from "@vitejs/plugin-legacy";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // legacy({
    //   targets: ["defaults", "not IE 11"], // 或者明确写 ['ie >= 11']
    //   additionalLegacyPolyfills: ["regenerator-runtime/runtime"], // async/await 需要
    // }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  base: "/hongAi/",
  // build: {
  //   target: "es2015",
  //   rollupOptions: {
  //     output: {
  //       manualChunks: undefined,
  //     },
  //   },
  //   minify: "terser",
  //   terserOptions: {
  //     compress: {
  //       drop_console: true,
  //       drop_debugger: true,
  //     },
  //   },
  // },
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
