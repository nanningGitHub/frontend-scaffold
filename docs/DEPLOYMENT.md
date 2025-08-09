# 部署指南

## 环境区分

- 开发：`npm run dev`（Vite，启用代理与可选 MSW）
- 预发/生产：`npm run build && npm run preview` 或部署到静态托管平台

## GitHub Pages

- 已提供 `scripts/deploy.sh`，可将 `dist/` 发布到 Pages

## 其他平台（示例）

- Vercel/Netlify：直接导入仓库，构建命令 `npm run build`，输出目录 `dist`
- Nginx：将 `dist/` 放置到根目录，配置 SPA 回退到 `index.html`

## 环境变量注入

- 运行时注入（推荐）或构建时注入（Vite `VITE_*`）
- 重要变量：
  - `VITE_API_BASE_URL`：后端 API 基址（生产环境建议设为真实网关）
  - `VITE_AUTH_USE_COOKIES`、`VITE_CSRF_*`：Cookie/CSRF 策略
  - `VITE_SENTRY_DSN`、`VITE_REPORT_WEB_VITALS`：观测与上报
