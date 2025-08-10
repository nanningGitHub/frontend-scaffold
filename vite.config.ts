import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import { resolve } from 'path';
/* eslint-env node */

/**
 * Vite 配置文件
 * 
 * 功能：
 * 1. 配置开发服务器
 * 2. 配置构建选项
 * 3. 配置插件
 * 
 * 特性：
 * - React 插件支持
 * - 开发服务器配置
 * - 生产构建优化
 * - 路径别名配置
 * - 代码分割优化
 */
export default defineConfig({
  // 插件配置
  plugins: [
    // React 插件，支持 JSX 和热重载
    react(),
    (process.env.ANALYZE ? (visualizer({ open: false }) as any) : undefined),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['vite.svg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: '前端脚手架',
        short_name: '脚手架',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#3b82f6',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable any' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable any' },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'script' || request.destination === 'style',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'assets-cache' },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api'),
            handler: 'NetworkFirst',
            options: { cacheName: 'api-cache', networkTimeoutSeconds: 5 },
          },
        ],
      },
    }),
  ],
  
  // 路径解析配置
  resolve: {
    alias: {
      '@': resolve(process.cwd(), 'src'),
    },
  },
  
  // 开发服务器配置
  server: {
    // 开发服务器端口
    port: 3000,
    // 自动打开浏览器
    open: true,
    // 代理配置
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  
  // 构建配置
  build: {
    // 输出目录
    outDir: 'dist',
    // 生成 source map
    sourcemap: true,
    // 代码分割配置
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          utils: ['axios', 'zustand'],
          i18n: ['i18next', 'react-i18next'],
        },
      },
    },
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  
  // 预览配置
  preview: {
    port: 4173,
    open: true,
  },
});
