# 前端脚手架

一个现代化的 React + TypeScript + Vite 项目模板，集成了最新的前端开发工具和最佳实践。

## 🚀 特性

- ⚡️ **Vite** - 极速的开发服务器和构建工具
- ⚛️ **React 18** - 最新的 React 特性
- 🔷 **TypeScript** - 类型安全的 JavaScript
- 🎨 **Tailwind CSS** - 实用优先的 CSS 框架
- 🛣️ **React Router** - 声明式路由
- 🧪 **Jest + Testing Library** - 完整的测试解决方案
- 📝 **ESLint + Prettier** - 代码质量和格式化
- 🐶 **Husky + lint-staged** - Git hooks
- 📦 **Axios** - HTTP 客户端
- 🌐 **i18next** - 国际化支持
- 📚 **Storybook** - 组件文档和交互式示例
- 📱 **PWA** - 渐进式 Web 应用支持（vite-plugin-pwa 自动注册）
- 📊 **可观测性** - Sentry 初始化、Web Vitals 上报（可选）
- 🧪 **E2E** - Playwright 集成（可选启用 MSW 模拟后端）

## 📦 安装

```bash
npm install
```

## 🌐 在线演示

- **本地开发**: `http://localhost:3000`

## 🚀 部署

### GitHub Pages 自动部署

本项目配置了 GitHub Actions 工作流，会自动部署到 GitHub Pages：

1. 推送代码到 `main` 分支
2. GitHub Actions 自动构建项目
3. 部署到 GitHub Pages

### 手动部署

```bash
# 构建项目
npm run build

# 部署到 GitHub Pages
npm run deploy
```

## 🚀 开发

````bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
### 开启 Mock（MSW）

开发环境可开启 MSW 模拟后端接口：

```bash
echo "VITE_ENABLE_MSW=true" >> .env
npm run dev
````

MSW handlers 位置：`src/mocks/handlers.ts`

````

## 🧪 测试

```bash
# 运行测试
npm run test

# 监听模式测试
npm run test:watch

# 测试覆盖率
npm run test:coverage
### 端到端测试（E2E）

```bash
npm run test:e2e
````

Playwright 将自动启动开发服务器。可在 `playwright.config.ts` 中配置。

````
E2E 注意：已将 `public/mockServiceWorker.js` 入库；测试会等待 `window.__mswReady`，并在开发服注入 `VITE_ENABLE_MSW=true`。

## 📚 文档

```bash
# 生成文档
npm run docs:generate

# 更新文档并提交
npm run docs:update

# 启动 Storybook
npm run storybook

# 构建 Storybook
npm run build-storybook
````

### 关键文档

- 架构总览: docs/ARCHITECTURE.md
- 测试策略: docs/TESTING.md
- 环境与配置: docs/ENVIRONMENT.md
- 部署指南: docs/DEPLOYMENT.md
- CI/CD 指南: docs/CI_CD.md
- 故障排查: docs/TROUBLESHOOTING.md

## 🔐 认证与安全

- 认证支持 Cookie 会话 + CSRF：
  - 前端将自动携带凭证（`withCredentials`）并从 Cookie 读取 CSRF Token 注入到自定义头
  - 需要后端提供 HttpOnly Cookie、SameSite 与 CSRF 校验
- Token 模式兼容：如未启用 Cookie，会从本地存储读取 Token 并注入 Authorization 头

环境变量（`.env`）：

```bash
VITE_AUTH_USE_COOKIES=false
VITE_CSRF_HEADER_NAME=X-CSRF-Token
VITE_CSRF_COOKIE_NAME=XHRF-TOKEN
```

## 📱 PWA

- 已启用 `vite-plugin-pwa`：生产环境将自动注册 Service Worker
- 需提供应用图标：`public/icon-192.png`、`public/icon-512.png`

## 🛡️ 安全与 CSP（建议）

- 在生产环境入口中添加严格 CSP/SRI；在 CI 中做响应头检查
- 启用 Dependabot/CodeQL 进行依赖与代码安全扫描

## 📈 性能与构建分析

- 运行 `npm run analyze` 生成 bundle 可视化（rollup-plugin-visualizer）

## 📝 代码质量

```bash
# 代码检查
npm run lint

# 自动修复
npm run lint:fix

# 代码格式化
npm run format
```

## 📁 项目结构

```
src/
├── components/          # 可复用组件
│   ├── Layout.tsx      # 布局组件
│   └── Navigation.tsx  # 导航组件
├── pages/              # 页面组件
│   ├── Home.tsx        # 首页
│   ├── About.tsx       # 关于页面
│   └── NotFound.tsx    # 404页面
├── hooks/              # 自定义 Hooks
│   └── useLocalStorage.ts
├── utils/              # 工具函数
│   └── api.ts          # API 工具
├── App.tsx             # 主应用组件
├── main.tsx            # 应用入口
└── index.css           # 全局样式
```

## 🛠️ 技术栈

### 核心框架

- **React 18** - 用户界面库
- **TypeScript** - 类型安全
- **Vite** - 构建工具

### 样式和 UI

- **Tailwind CSS** - CSS 框架
- **PostCSS** - CSS 处理
- **Autoprefixer** - CSS 前缀

### 路由和状态管理

- **React Router** - 客户端路由

### 网络请求

- **Axios** - HTTP 客户端

### 测试

- **Jest** - 测试框架
- **Testing Library** - React 测试工具
- **jsdom** - DOM 环境

### 文档

- **Storybook** - 组件文档和交互式示例
- **自动文档生成** - 基于代码注释生成文档

### 代码质量

- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **Husky** - Git hooks
- **lint-staged** - 暂存文件检查

## 🎨 自定义

### 主题配置

在 `tailwind.config.js` 中自定义主题：

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // 自定义主色调
      }
    }
  }
}
```

### 环境变量

创建 `.env` 文件：

```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

## 📚 学习资源

- [React 官方文档](https://react.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [Tailwind CSS 官方文档](https://tailwindcss.com/)
- [React Router 官方文档](https://reactrouter.com/)

## 🤝 贡献

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
