# 故障排查指南

## E2E 测试失败（MSW 相关）

- 错误：`Service Worker script does not exist at the given path`
  - 解决：执行 `npx msw init public`（已将 `public/mockServiceWorker.js` 纳入版本库）
- 首次请求命中真实后端
  - 解决：确保 `VITE_ENABLE_MSW=true`，并等待 `window.__mswReady`

## 端口占用或服务未启动

- 检查 3000 端口是否被占用
- `playwright.config.ts` 已禁用复用服务，可手动清理残留进程

## 登录态/重定向异常

- 清理 `localStorage`/`sessionStorage`
- 确认 `AUTH_SECURITY.USE_COOKIES` 与服务端配置一致

## 代理 502/ECONNREFUSED

- 开发代理 `/api -> :8080` 仅本地后端有效；使用 MSW 时请开启 `VITE_ENABLE_MSW=true`
