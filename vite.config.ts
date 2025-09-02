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
    process.env.ANALYZE ? (visualizer({ open: false }) as unknown) : undefined,
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
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable any',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable any',
          },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === 'script' ||
              request.destination === 'style',
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
    // 启用 HMR
    hmr: {
      overlay: true,
    },
    // 代理配置
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    // 启用 gzip 压缩
    middlewareMode: false,
    // 预构建优化
    force: false,
  },

  // 优化配置
  optimizeDeps: {
    // 预构建依赖
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      'axios',
      'i18next',
      'react-i18next',
    ],
    // 排除的依赖
    exclude: ['@vite/client', '@vite/env'],
    // 强制预构建
    force: false,
  },

  // 构建配置
  build: {
    // 输出目录
    outDir: 'dist',
    // 生成 source map（生产环境关闭以提升性能）
    sourcemap: process.env.NODE_ENV !== 'production',
    // 代码分割配置
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React 相关
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react';
          }
          // 路由相关
          if (id.includes('react-router')) {
            return 'router';
          }
          // 状态管理
          if (id.includes('zustand')) {
            return 'state';
          }
          // 网络请求
          if (id.includes('axios')) {
            return 'network';
          }
          // 国际化
          if (id.includes('i18next') || id.includes('react-i18next')) {
            return 'i18n';
          }
          // UI 库
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          // 工具函数
          if (id.includes('src/utils')) {
            return 'utils';
          }
          // 组件
          if (id.includes('src/components')) {
            return 'components';
          }
        },
        // 资源文件命名
        assetFileNames: (assetInfo) => {
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        // JS 文件命名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: process.env.NODE_ENV === 'production',
        pure_funcs:
          process.env.NODE_ENV === 'production'
            ? ['console.log', 'console.info']
            : [],
      },
      mangle: {
        safari10: true,
      },
    },
    // 构建目标
    target: 'es2015',
    // 资源内联阈值
    assetsInlineLimit: 4096,
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 报告压缩后的文件大小
    reportCompressedSize: true,
    // 设置 chunk 大小警告限制
    chunkSizeWarningLimit: 1000,
  },

  // 预览配置
  preview: {
    port: 4173,
    open: true,
  },
});
