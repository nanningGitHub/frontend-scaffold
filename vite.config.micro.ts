import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import { resolve } from 'path';

/**
 * 微前端 Vite 配置文件
 *
 * 功能：
 * 1. 配置模块联邦
 * 2. 支持微前端架构
 * 3. 配置共享依赖
 *
 * 特性：
 * - 模块联邦支持
 * - 共享依赖管理
 * - 微前端通信
 * - 独立部署支持
 */
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host-app',
      remotes: {
        // 远程微应用配置
        'remote-app': 'http://localhost:3001/assets/remoteEntry.js',
        'user-module': 'http://localhost:3002/assets/remoteEntry.js',
        'admin-module': 'http://localhost:3003/assets/remoteEntry.js',
        'vue-micro-app': 'http://localhost:3004/assets/remoteEntry.js',
      },
      shared: {
        // 共享依赖配置
        react: { singleton: true, requiredVersion: '^18.2.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
        'react-router-dom': { singleton: true, requiredVersion: '^6.8.1' },
        zustand: { singleton: true, requiredVersion: '^5.0.7' },
        axios: { singleton: true, requiredVersion: '^1.3.4' },
        i18next: { singleton: true, requiredVersion: '^25.3.2' },
        'react-i18next': { singleton: true, requiredVersion: '^15.6.1' },
      },
      exposes: {
        // 暴露给其他微应用的模块
        './Layout': './src/components/Layout.tsx',
        './Navigation': './src/components/Navigation.tsx',
        './ProtectedRoute': './src/components/ProtectedRoute.tsx',
        './useAuth': './src/stores/authStore.ts',
        './useI18n': './src/hooks/useI18n.ts',
      },
    }),
  ],

  resolve: {
    alias: {
      '@': resolve(process.cwd(), 'src'),
    },
  },

  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        minifyInternalExports: false,
      },
    },
  },

  preview: {
    port: 4173,
    open: true,
  },
});
