# Bug 修复记录 - 2024

## 概述

本文档记录了项目在2024年遇到的主要问题和解决方案，为后续开发提供参考。

## 2024年12月 - 主要问题修复

### 问题1: 导入路径错误

**错误描述**: 
```
Failed to resolve import "./stores/themeStore" from "src/App.tsx". Does the file exist?
```

**问题原因**: 
- 直接导入单个 store 文件而不是通过 barrel 文件
- 违反了项目的导入规范

**解决方案**: 
```typescript
// ❌ 错误方式
import { useThemeStore } from './stores/themeStore';
import { useAuthStore } from './stores/authStore';
import { useI18nStore } from './stores/i18nStore';

// ✅ 正确方式
import { useAuthStore, useThemeStore, useI18nStore } from './stores';
```

**修复文件**: 
- `src/App.tsx`

### 问题2: 微前端通信方法不匹配

**错误描述**: 
```
No matching export in "src/utils/microAppCommunication.ts" for import "globalCommunication"
```

**问题原因**: 
- 使用了错误的方法名
- API 调用方式与实际的 `MicroAppCommunication` 类不匹配

**解决方案**: 
```typescript
// ❌ 错误方法名
globalCommunication.subscribe('*', (payload, source) => { ... });
globalCommunication.sendToApp(appId, eventType, payload);
globalCommunication.broadcast(eventType, payload);

// ✅ 正确方法名
globalCommunication.onMessage('*', (message) => { ... });
globalCommunication.sendMessage(appId, { type: eventType, payload, source: 'host' });
globalCommunication.broadcastMessage({ type: eventType, payload, source: 'host' });
```

**修复文件**: 
- `src/pages/MicroFrontendDemo.tsx`

### 问题3: TypeScript 类型导出缺失

**错误描述**: 
- 通过 `src/stores/index.ts` 导入类型时失败
- 类型定义无法被外部访问

**问题原因**: 
- Store 类型定义没有使用 `export` 关键字
- 类型只在文件内部可见

**解决方案**: 
```typescript
// ❌ 错误：类型未导出
type AuthStore = AuthState & AuthActions;
type ThemeStore = ThemeState & ThemeActions;
type I18nStore = I18nState & I18nActions;
type UIStore = UIState & UIActions;

// ✅ 正确：类型已导出
export type AuthStore = AuthState & AuthActions;
export type ThemeStore = ThemeState & ThemeActions;
export type I18nStore = I18nState & I18nActions;
export type UIStore = UIState & UIActions;
```

**修复文件**: 
- `src/stores/authStore.ts`
- `src/stores/themeStore.ts`
- `src/stores/i18nStore.ts`
- `src/stores/uiStore.ts`

### 问题4: Jest 测试环境兼容性

**错误描述**: 
```
SyntaxError: Cannot use 'import.meta' outside a module
```

**问题原因**: 
- Jest 环境不支持 Vite 的 `import.meta` 语法
- 测试环境与生产环境的差异

**解决方案**: 
```typescript
// ❌ 错误：直接使用 import.meta
if (typeof import.meta !== 'undefined' && import.meta.env) {
  return import.meta.env;
}

// ✅ 正确：兼容性检查 + 测试环境支持
if (typeof (globalThis as any).import !== 'undefined' && (globalThis as any).import?.meta?.env) {
  return (globalThis as any).import.meta.env;
}
// 在测试环境中提供默认值
if (process.env.NODE_ENV === 'test') {
  return {
    VITE_API_BASE_URL: '/api',
    VITE_AUTH_USE_COOKIES: 'false',
    VITE_CSRF_HEADER_NAME: 'X-CSRF-Token',
    VITE_CSRF_COOKIE_NAME: 'XSRF-TOKEN',
  };
}
```

**修复文件**: 
- `src/constants/index.ts`
- `src/utils/logger.ts`
- `src/i18n/index.ts`
- `src/setupTests.ts`

## 修复后的验证

### 1. 开发服务器状态
```bash
# 检查服务状态
curl -s http://localhost:3000/ | grep -o '<title>.*</title>'
# 输出: <title>前端脚手架</title>
```

### 2. 测试状态
```bash
# 运行测试
npm test -- --passWithNoTests
# 结果: 3/3 测试通过
```

### 3. 编译状态
```bash
# 启动开发服务器
npm run dev
# 状态: 无编译错误，正常启动
```

## 经验总结

### 1. 导入规范
- 始终通过 barrel 文件 (`index.ts`) 导入 store
- 避免直接导入单个 store 文件
- 保持导入路径的一致性

### 2. API 使用
- 仔细阅读 API 文档和类型定义
- 使用正确的方法名和参数格式
- 在修改代码前验证 API 的正确用法

### 3. 类型安全
- 确保所有类型定义都被正确导出
- 使用 `export type` 而不是 `type`
- 定期检查类型导入是否正常

### 4. 测试兼容性
- 考虑不同环境的差异（开发、测试、生产）
- 为测试环境提供适当的 mock 和默认值
- 使用兼容性检查避免运行时错误

## 预防措施

### 1. 代码审查
- 检查导入路径是否符合规范
- 验证 API 调用是否正确
- 确认类型导出是否完整

### 2. 自动化测试
- 保持测试覆盖率
- 在不同环境中运行测试
- 使用 TypeScript 严格模式

### 3. 文档维护
- 及时更新 API 文档
- 记录已知问题和解决方案
- 维护最佳实践指南

## 相关文档

- [故障排查指南](./TROUBLESHOOTING.md)
- [Zustand 状态管理指南](./ZUSTAND_GUIDE.md)
- [微前端架构指南](./MICRO_FRONTEND.md)
- [测试指南](./TESTING.md)

---

*最后更新: 2024年12月*
