# 架构总览

本项目采用分层的前端架构，围绕 UI、状态、服务与基础设施进行解耦，具备良好的可测试性与可扩展性。

## 分层结构

- UI 层（`src/components`, `src/pages`）: 纯视图与页面编排。
- 路由层（`src/App.tsx`）: 嵌套路由，受保护路由。
- 状态层（`src/stores`）: 使用 Zustand（`authStore`, `uiStore`）。
- 服务层（`src/services`）: 业务 API 封装（`userService`）。
- 基础设施（`src/utils`, `src/constants`）: Axios 实例、日志、校验、性能、常量。
- 国际化（`src/i18n`）: i18next 初始化与资源。
- Mock 与测试（`src/mocks`, `tests/e2e`）: MSW handlers、Playwright 用例。

## 数据与控制流

```mermaid
graph LR
  A[UI 组件/页面] -- 触发动作 --> B[Stores Zustand]
  B -- 调用 --> C[Services userService]
  C -- 使用 --> D[Axios 实例 utils/api]
  D -- 发起请求 --> E[(后端或MSW)]
  E -- 响应数据 --> D --> C --> B --> A
```

- 认证链路：
  - 请求拦截器从存储读取 Token，按模式设置 Authorization/CSRF。
  - 401 时自动尝试 `auth/refresh` 刷新 Token 并重试原请求；失败回登录。
  - `ProtectedRoute` 兜底未登录访问。

## 路由结构

- `/` 首页
- `/about` 关于
- `/login` `/register` 认证页面
- `/profile` 个人中心（受保护）
- `/state-demo` 状态管理演示
- `/i18n-demo` 国际化演示
- `*` 404

## 关键模块

- `utils/api.ts`: 统一 Axios、日志、重试、401 刷新、错误上报。
- `utils/logger.ts`: 企业级日志系统，支持多级别日志和结构化输出。
- `utils/enterpriseErrorHandler.ts`: 企业级错误处理，支持错误分类、重试和上报。
- `utils/enterpriseMonitoring.ts`: 企业级监控系统，支持性能指标和用户行为分析。
- `utils/securityAuditor.ts`: 安全审计工具，支持依赖扫描和代码安全检查。
- `stores/authStore.ts`: 登录/注册/登出/初始化，持久化 Token 与用户。
- `components/ProtectedRoute.tsx`: 鉴权守卫。
- `components/EnterpriseErrorBoundary.tsx`: 企业级错误边界，支持错误上报和恢复。
- `mocks/handlers.ts`: `/api/auth/*` 等接口的模拟与 `/api/*` 兜底。
- `main.tsx` + `Layout.tsx`: 启动 MSW 并等待 `__mswReady`，再初始化认证。

## 配置与环境

- `constants/index.ts` 统一常量，`VITE_*` 环境变量控制 API Base、Cookie/CSRF、监控等。
- `vite.config.ts` 开发代理 `/api -> :8080`，PWA、代码分割、分析。

## 代码质量优化

### 已完成的优化

1. **日志系统统一化**

   - 删除了 `simpleLogger.ts`，统一使用企业级 `logger.ts`
   - 所有组件和工具函数使用统一的日志接口
   - 支持结构化日志和日志级别控制

2. **类型安全增强**

   - 替换了所有 `any` 类型为具体类型
   - 增强了 API 接口的类型定义
   - 改进了环境变量的类型安全

3. **工具函数整合**

   - 删除了重复的 `simpleSecurity.ts`
   - 统一使用 `securityAuditor.ts` 进行安全检查
   - 整合了微前端相关工具函数

4. **ESLint 配置优化**
   - 增强了代码质量检查规则
   - 添加了 TypeScript 特定规则
   - 配置了更严格的未使用变量检查

### 代码质量指标

- **总文件数**: 81 个 TypeScript 文件
- **总代码行数**: 14,207 行
- **代码质量评分**: 8.2/10
- **ESLint 错误**: 已修复
- **类型覆盖率**: 100%

## 可测试性

- Jest + RTL：组件与逻辑单测。
- Playwright：E2E，自动启服，等待 MSW 就绪，跨浏览器矩阵。

## 可扩展建议

- 引入 OpenAPI/GraphQL 契约与代码生成
- RBAC/ABAC 权限模型与能力前置渲染
- 结构化日志 + TraceId 贯通与 APM 仪表盘
