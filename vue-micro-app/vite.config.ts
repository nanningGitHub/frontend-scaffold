import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import federation from '@originjs/vite-plugin-federation';
import { resolve } from 'path';

/**
 * Vue微前端应用 Vite 配置文件
 *
 * 功能：
 * 1. 配置Vue插件
 * 2. 配置模块联邦
 * 3. 支持微前端架构
 * 4. 配置共享依赖
 *
 * 特性：
 * - Vue 3 支持
 * - 模块联邦支持
 * - 共享依赖管理
 * - 微前端通信
 * - 独立部署支持
 */
export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'vue-micro-app',
      filename: 'remoteEntry.js',
      exposes: {
        // 暴露给主应用的Vue组件
        './VueApp': './src/App.vue',
        './VueHome': './src/views/Home.vue',
        './VueAbout': './src/views/About.vue',
        './VueCounter': './src/components/Counter.vue',
        './VueUserList': './src/components/UserList.vue',
        './VueStore': './src/stores/userStore.ts',
      },
      shared: {
        // 共享依赖配置
        vue: { singleton: true, requiredVersion: '^3.4.0' },
        'vue-router': { singleton: true, requiredVersion: '^4.2.0' },
        pinia: { singleton: true, requiredVersion: '^2.1.0' },
        axios: { singleton: true, requiredVersion: '^1.3.4' },
        'element-plus': { singleton: true, requiredVersion: '^2.4.0' },
      },
    }),
  ],

  resolve: {
    alias: {
      '@': resolve(process.cwd(), 'src'),
    },
  },

  server: {
    port: 3004,
    open: true,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
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
    port: 3004,
    open: true,
  },
});
