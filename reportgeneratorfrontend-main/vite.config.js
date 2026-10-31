import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
base: '/portal/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // proxy: {
  //   '/api': {
  //     target: 'https://api.sagarsinghawesome.com',
  //     changeOrigin: true,
  //     rewrite: (path) => path.replace(/^\/api/, '/api')
  //   },
  // }
})
