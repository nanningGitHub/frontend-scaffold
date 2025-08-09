# 测试策略

## 单元与组件测试（Jest + Testing Library）

- 运行：`npm run test` / `npm run test:watch` / `npm run test:coverage`
- 约定：测试文件放在 `__tests__` 或与组件同级 `*.test.tsx`。
- 建议：避免依赖实现细节，关注行为与可访问性（role/label）。

## 端到端测试（Playwright）

- 运行：`npm run test:e2e`
- 配置：`playwright.config.ts`
  - 自动启动 Vite 开发服（禁用复用，超时 120s）
  - 注入 `VITE_ENABLE_MSW=true` 以启用 MSW
  - 浏览器矩阵：Chromium/Firefox/WebKit
- MSW 集成：
  - 必须存在 `public/mockServiceWorker.js`（已纳入版本库）
  - `src/main.tsx` 将 `__mswReady` 暴露在 window，`Layout` 会等待其就绪再初始化认证
  - E2E 的 `beforeEach` 清理存储并 `await __mswReady`
- 调试与诊断：
  - 仅跑某浏览器：`npm run test:e2e -- --project=chromium`
  - 头显模式：`--headed`，调试：`--debug`
  - 跟踪：`trace: on-first-retry`，失败后在 `playwright-report` 查看

## 覆盖度与门禁（建议）

- 单元测试覆盖率阈值：`statements/branches/functions/lines >= 80%`
- 在 CI PR 上强制运行 Lint/Unit/E2E，失败拒绝合并
