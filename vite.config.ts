import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      // 将所有 /api 开头的请求代理到目标服务器
      '/api': {
        target: 'https://honkouai.impdigital.cn/', // 这里替换为实际的后端服务地址
        changeOrigin: true, // 改变请求头中的 Origin
        secure: false, // 如果是 https 接口，需要配置这个参数
      }
    }
  }
})
