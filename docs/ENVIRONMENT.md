# 环境变量与配置

## 文件与优先级

- `.env`、`.env.development`、`.env.production`、`.env.local`（不入库）
- 仅以 `VITE_` 前缀暴露给前端（Vite 规则）

## 变量列表（示例）

```bash
# API 与认证
VITE_API_BASE_URL=/api
VITE_AUTH_USE_COOKIES=false
VITE_CSRF_HEADER_NAME=X-CSRF-Token
VITE_CSRF_COOKIE_NAME=XSRF-TOKEN

# 功能开关
VITE_ENABLE_MSW=true
VITE_REPORT_WEB_VITALS=false

# 可观测性
VITE_SENTRY_DSN=
```

## 本地开发建议

- 如需使用 MSW：在 `.env` 设置 `VITE_ENABLE_MSW=true`
- 生产构建会忽略 MSW（动态导入，仅开发启动）
