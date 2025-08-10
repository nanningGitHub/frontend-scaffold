# 故障排查指南

## 常见编译错误

### 导入路径错误
- **错误**: `Failed to resolve import "./stores/themeStore" from "src/App.tsx"`
- **原因**: 直接导入单个 store 文件而不是通过 barrel 文件
- **解决**: 使用 `import { useThemeStore } from './stores'` 而不是 `import { useThemeStore } from './stores/themeStore'`

### 微前端通信方法不匹配
- **错误**: `No matching export in "src/utils/microAppCommunication.ts" for import "globalCommunication"`
- **原因**: 使用了错误的方法名
- **解决**: 
  - `subscribe` → `onMessage`
  - `sendToApp` → `sendMessage`
  - `broadcast` → `broadcastMessage`

### 类型导出缺失
- **错误**: TypeScript 类型导入失败
- **原因**: Store 类型定义未导出
- **解决**: 在 store 文件中添加 `export type StoreName = ...`

## Jest 测试环境问题

### import.meta 语法错误
- **错误**: `SyntaxError: Cannot use 'import.meta' outside a module`
- **原因**: Jest 环境不支持 Vite 的 `import.meta` 语法
- **解决**: 
  1. 使用 `(globalThis as any).import?.meta?.env` 替代 `import.meta.env`
  2. 在测试环境中提供默认值
  3. 在 `setupTests.ts` 中添加 mock

### 测试配置优化
- **问题**: Jest 配置需要支持 TypeScript 和 ESM
- **解决**: 使用 `ts-jest` 转换器，添加适当的 mock 和类型支持

## E2E 测试失败（MSW 相关）

- 错误：`Service Worker script does not exist at the given path`
  - 解决：执行 `npx msw init public`（已将 `public/mockServiceWorker.js` 纳入版本库）
- 首次请求命中真实后端
  - 解决：确保 `VITE_ENABLE_MSW=true`，并等待 `window.__mswReady`

## 端口占用或服务未启动

- 检查 3000 端口是否被占用
- `playwright.config.ts` 已禁用复用服务，可手动清理残留进程
- **解决**: 使用 `pkill -f "npm run dev"` 清理所有开发服务器进程

## 登录态/重定向异常

- 清理 `localStorage`/`sessionStorage`
- 确认 `AUTH_SECURITY.USE_COOKIES` 与服务端配置一致

## 代理 502/ECONNREFUSED

- 开发代理 `/api -> :8080` 仅本地后端有效；使用 MSW 时请开启 `VITE_ENABLE_MSW=true`

## 开发服务器状态检查

### 检查服务状态
```bash
# 检查端口占用
lsof -i :3000

# 清理开发进程
pkill -f "npm run dev"

# 重新启动
npm run dev
```

### 验证修复
```bash
# 运行测试
npm test -- --passWithNoTests

# 检查开发服务器
curl -s http://localhost:3000/ | grep -o '<title>.*</title>'
```
