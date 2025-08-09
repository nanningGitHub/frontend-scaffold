# 安全指南

本文档汇总前端常用安全措施与本项目具体做法，便于与后端/运维对齐。

## 1. 认证与会话
- 建议使用 HttpOnly + Secure + SameSite 的 Cookie 承载会话（非本地存储）
- CSRF 方案：
  - 服务端下发 CSRF 种子 Cookie（如 XSRF-TOKEN）
  - 前端将其复制到自定义请求头（如 X-CSRF-Token）
  - 服务端对比请求头与 Cookie 值，或使用双重提交/同步令牌机制
- 刷新令牌：短生命周期访问令牌 + 长生命周期刷新令牌，刷新接口使用同源 Cookie 并受 CSRF 保护

本项目前端：
- 通过 withCredentials 携带 Cookie
- 从 CSRF Cookie 读值并注入到 X-CSRF-Token（配置于 AUTH_SECURITY）

## 2. 内容安全策略（CSP）
- 建议在生产环境开启严格 CSP 头：

Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-<RANDOM_NONCE>' 'strict-dynamic';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:; font-src 'self' data:;
  connect-src 'self' https://api.example.com; frame-ancestors 'none';

- 动态脚本注入 nonce（构建或网关注入）；避免 unsafe-inline/unsafe-eval

## 3. 子资源完整性（SRI）
- 外链资源添加 integrity 与 crossorigin；优先自托管

## 4. 安全响应头
- X-Frame-Options: DENY（或 CSP 的 frame-ancestors）
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: 最小授权

## 5. 依赖安全
- 开启 Dependabot 与 CodeQL；CI 增加 npm audit --production

## 6. 日志与隐私
- 避免在客户端日志中输出敏感信息（PII/令牌）
- 生产环境错误上报至 Sentry，附加脱敏上下文

## 7. 构建与部署
- 多环境配置隔离（dev/staging/prod）
- Secrets 仅存放于 CI/CD 平台，不纳入仓库

## 8. 前端加固建议
- 输入校验与转义（XSS/注入）
- 统一用户错误提示，避免泄漏内部细节
- 关键操作二次确认与速率限制（前端可做节流/防抖）

> 提醒：CSP 与 Cookie 安全属性需后端/网关配置生效；建议联合联调。
