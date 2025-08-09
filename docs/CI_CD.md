# CI/CD 指南（建议方案）

## 目标

- PR 质量门禁：Lint + Unit + E2E + 构建体积分析
- 主干持续部署：Preview/测试环境自动发布
- 版本与发布：语义化版本，自动生成变更日志

## 典型流水线（GitHub Actions）

1. `lint-and-unit`：安装缓存依赖、`npm run lint && npm run test`
2. `e2e`：使用 `npx playwright install --with-deps`，`npm run test:e2e`
3. `build`：`npm run build`，生成产物与可视化报告（`npm run analyze`）
4. `deploy`：推送主干后自动部署到 Pages/预发环境

## 质量门禁

- Lint 0 error、Unit 与 E2E 全绿
- 资源体积预算（bundle 大小阈值）

## 版本与发布（建议）

- 采用 Conventional Commits
- 语义化版本（semver）
- Release 工具：`changesets` 或 `semantic-release`
