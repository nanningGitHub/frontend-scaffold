# 前端脚手架（供 coder，参考和学习前端架构）

一个现代化的 React + TypeScript + Vite 企业级项目模板，集成了最新的前端开发工具和最佳实践。

## 🚀 特性

- ⚡️ **Vite** - 极速的开发服务器和构建工具
- ⚛️ **React 18** - 最新的 React 特性
- 🔷 **TypeScript** - 类型安全的 JavaScript
- 🎨 **Tailwind CSS** - 实用优先的 CSS 框架
- 🛣️ **React Router** - 声明式路由
- 🧪 **Jest + Testing Library** - 完整的测试解决方案
- 📝 **ESLint + Prettier** - 代码质量和格式化
- 🐶 **Husky + lint-staged** - Git hooks 和代码质量检查
- 📝 **Commitlint** - 提交信息格式规范检查
- 📦 **Axios** - HTTP 客户端
- 🌐 **i18next** - 国际化支持
- 📚 **Storybook** - 组件文档和交互式示例
- 📱 **PWA** - 渐进式 Web 应用支持
- 📊 **可观测性** - Sentry 集成、Web Vitals 监控
- 🧪 **E2E** - Playwright 集成
- 🏗️ **微前端架构** - 支持模块联邦和微应用
- 🎯 **Zustand** - 轻量级状态管理
- 🐳 **Docker** - 容器化部署支持
- 🔒 **安全增强** - CSP、CSRF 保护、安全审计
- 📈 **性能监控** - Lighthouse、Bundle 分析
- 🚀 **CI/CD** - GitHub Actions 自动化部署

## 📦 安装

```bash
npm install
```

## 🌐 在线演示

- **本地开发**: `http://localhost:3000`
- **微前端模式**: `http://localhost:3000` (使用 `npm run dev:micro`)

## 🚀 开发

```bash
# 启动开发服务器
npm run dev

# 启动微前端开发模式
npm run dev:micro

# 构建生产版本
npm run build

# 构建微前端版本
npm run build:micro

# 预览生产构建
npm run preview
```

### 开启 Mock（MSW）

开发环境可开启 MSW 模拟后端接口：

```bash
echo "VITE_ENABLE_MSW=true" >> .env
npm run dev
```

MSW handlers 位置：`src/mocks/handlers.ts`

## 🧪 测试

```bash
# 运行测试
npm run test

# 监听模式测试
npm run test:watch

# 测试覆盖率
npm run test:coverage

# CI 测试
npm run test:ci
```

### 端到端测试（E2E）

```bash
npm run test:e2e
```

Playwright 将自动启动开发服务器。可在 `playwright.config.ts` 中配置。

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
```

### 关键文档

详细的文档请查看 [docs/README.md](./docs/README.md) 获取完整的文档索引。

#### 核心架构

- **架构总览**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **微前端指南**: [docs/MICRO_FRONTEND.md](docs/MICRO_FRONTEND.md)
- **状态管理**: [docs/ZUSTAND_GUIDE.md](docs/ZUSTAND_GUIDE.md)

#### 开发指南

- **测试策略**: [docs/TESTING.md](docs/TESTING.md)
- **安全指南**: [docs/SECURITY.md](docs/SECURITY.md)
- **故障排查**: [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- **提交信息规范**: [docs/COMMIT_CONVENTION.md](docs/COMMIT_CONVENTION.md)

#### 部署运维

- **部署指南**: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- **CI/CD 指南**: [docs/CI_CD.md](docs/CI_CD.md)
- **环境配置**: [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md)

#### 学习资源

- **前端架构学习指南**: [FRONTEND_ARCHITECTURE_LEARNING_GUIDE.md](./FRONTEND_ARCHITECTURE_LEARNING_GUIDE.md)
- **代码质量分析报告**: [CODE_QUALITY_ANALYSIS_REPORT.md](./CODE_QUALITY_ANALYSIS_REPORT.md)

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

## 🏗️ 微前端架构

项目支持微前端架构，使用 Module Federation 实现：

```bash
# 启动微前端开发模式
npm run dev:micro

# 构建微前端版本
npm run build:micro
```

详细配置请参考 [微前端指南](docs/MICRO_FRONTEND.md)。

## 📱 PWA

- 已启用 `vite-plugin-pwa`：生产环境将自动注册 Service Worker
- 需提供应用图标：`public/icon-192.png`、`public/icon-512.png`

## 🛡️ 安全与 CSP

- 在生产环境入口中添加严格 CSP/SRI；在 CI 中做响应头检查
- 启用 Dependabot/CodeQL 进行依赖与代码安全扫描
- 定期运行安全审计：`npm run security:audit`

### 安全相关脚本

```bash
# 安全审计
npm run security:audit

# 修复安全漏洞
npm run security:fix

# 生成安全报告
npm run security:check
```

## 📈 性能与构建分析

```bash
# Bundle 分析
npm run bundle:analyze

# 构建分析（带分析器）
npm run build:analyze

# Lighthouse 性能测试
npm run performance:lighthouse

# 性能测试
npm run performance:test

# 健康检查
npm run health:check

# 监控服务启动
npm run monitoring:start
```

## 📝 代码质量

```bash
# 代码检查
npm run lint

# 自动修复
npm run lint:fix

# CI 代码检查（JSON 格式）
npm run lint:ci

# 代码格式化
npm run format

# 检查格式
npm run format:check

# 提交信息检查
npm run commitlint:check
```

## 🐳 Docker 支持

```bash
# 构建 Docker 镜像
npm run docker:build

# 运行 Docker 容器
npm run docker:run

# 使用 Docker Compose
npm run docker:compose

# 停止 Docker Compose
npm run docker:compose:down
```

## 📁 项目结构

```
src/
├── components/          # 可复用组件
│   ├── Layout.tsx      # 布局组件
│   ├── Navigation.tsx  # 导航组件
│   ├── ErrorBoundary.tsx # 错误边界
│   ├── LoadingSpinner.tsx # 加载状态
│   ├── LoginForm.tsx   # 登录表单
│   ├── RegisterForm.tsx # 注册表单
│   ├── UserProfile.tsx # 用户资料
│   ├── NotificationSystem.tsx # 通知系统
│   ├── ProtectedRoute.tsx # 受保护路由
│   ├── ApiExample.tsx  # API 示例
│   ├── LanguageSwitcher.tsx # 语言切换器
│   ├── MicroAppContainer.tsx # 微应用容器
│   └── EnterpriseErrorBoundary.tsx # 企业级错误边界
├── pages/              # 页面组件
│   ├── Home.tsx        # 首页
│   ├── About.tsx       # 关于页面
│   ├── Auth.tsx        # 认证页面
│   ├── I18nDemo.tsx    # 国际化演示
│   ├── MicroFrontendDemo.tsx # 微前端演示
│   ├── StateManagementDemo.tsx # 状态管理演示
│   └── NotFound.tsx    # 404页面
├── hooks/              # 自定义 Hooks
│   ├── useApi.ts       # API 相关 Hook
│   ├── useDebounce.ts  # 防抖 Hook
│   ├── useForm.ts      # 表单 Hook
│   ├── useI18n.ts      # 国际化 Hook
│   └── useLocalStorage.ts # 本地存储 Hook
├── stores/             # 状态管理
│   ├── authStore.ts    # 认证状态
│   ├── i18nStore.ts    # 国际化状态
│   ├── themeStore.ts   # 主题状态
│   ├── uiStore.ts      # UI 状态
│   └── index.ts        # 状态导出
├── utils/              # 工具函数
│   ├── api.ts          # API 工具
│   ├── enterpriseErrorHandler.ts # 企业级错误处理
│   ├── enterpriseMonitoring.ts # 企业级监控
│   ├── helpers.ts      # 辅助函数
│   ├── logger.ts       # 日志工具
│   ├── microAppCommunication.ts # 微应用通信
│   ├── microFrontendManager.ts # 微前端管理
│   ├── performance.ts  # 性能工具
│   ├── securityAuditor.ts # 安全审计
│   ├── simpleMicroFrontend.ts # 简单微前端工具
│   └── validation.ts  # 验证工具
├── i18n/               # 国际化
│   ├── index.ts        # 国际化配置
│   └── locales/        # 语言包
│       ├── en.json     # 英文
│       └── zh.json     # 中文
├── config/             # 配置文件
│   ├── microFrontend.ts # 微前端配置
│   └── performance.ts  # 性能配置
├── types/              # 类型定义
│   ├── common.ts       # 通用类型
│   └── microfrontend.ts # 微前端类型
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
- **Zustand** - 轻量级状态管理

### 网络请求

- **Axios** - HTTP 客户端

### 测试

- **Jest** - 测试框架
- **Testing Library** - React 测试工具
- **Playwright** - 端到端测试
- **jsdom** - DOM 环境

### 文档

- **Storybook** - 组件文档和交互式示例
- **自动文档生成** - 基于代码注释生成文档

### 代码质量

- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **Husky** - Git hooks
- **lint-staged** - 暂存文件检查

### 微前端

- **Module Federation** - 模块联邦
- **微应用通信** - 跨应用状态共享

### 监控和性能

- **Sentry** - 错误监控
- **Web Vitals** - 性能指标
- **Lighthouse** - 性能审计

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
VITE_ENABLE_MSW=true
VITE_AUTH_USE_COOKIES=false
```

## 🚀 部署与发布

```bash
# 部署到开发环境
npm run deploy

# 部署到生产环境
npm run deploy:prod

# 创建 GitHub 发布
npm run release

# 检查 GitHub 状态
npm run github:status
```

## 💾 备份与恢复

```bash
# 创建备份
npm run backup:create

# 恢复备份
npm run backup:restore
```

## 📚 学习资源

- [React 官方文档](https://react.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [Tailwind CSS 官方文档](https://tailwindcss.com/)
- [React Router 官方文档](https://reactrouter.com/)
- [Zustand 官方文档](https://zustand-demo.pmnd.rs/)
- [微前端架构指南](docs/MICRO_FRONTEND.md)

## 🤝 贡献

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

_最后更新: 2024 年 12 月_
_项目版本: v1.1.0_
_代码质量评分: 8.2/10_
