# 提交信息规范 (Conventional Commits)

本项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范来规范 Git 提交信息。

## 提交信息格式

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### 类型 (Type)

| 类型       | 说明          | 示例                                        |
| ---------- | ------------- | ------------------------------------------- |
| `feat`     | 新功能        | `feat: add user authentication`             |
| `fix`      | 修复 bug      | `fix: resolve login validation issue`       |
| `docs`     | 文档更新      | `docs: update API documentation`            |
| `style`    | 代码格式调整  | `style: format code with prettier`          |
| `refactor` | 重构          | `refactor: optimize user store performance` |
| `perf`     | 性能优化      | `perf: improve bundle loading speed`        |
| `test`     | 增加测试      | `test: add unit tests for auth service`     |
| `chore`    | 构建/工具相关 | `chore: update dependencies`                |
| `ci`       | CI/CD 相关    | `ci: add GitHub Actions workflow`           |
| `build`    | 构建系统相关  | `build: configure webpack optimization`     |
| `revert`   | 回滚          | `revert: revert to previous version`        |

### 范围 (Scope)

可选的范围标识，用于指定影响的功能模块：

```
feat(auth): add OAuth2 support
fix(ui): resolve button alignment issue
docs(api): update endpoint documentation
```

### 描述 (Description)

- 使用祈使句，现在时态
- 首字母小写
- 不以句号结尾
- 简洁明了，不超过 72 个字符

### 正文 (Body)

可选的详细描述，用于解释提交的原因和影响：

```
feat: add user authentication

- Implement JWT token-based authentication
- Add login/logout functionality
- Include password reset feature
- Support social login (Google, GitHub)
```

### 页脚 (Footer)

可选的页脚信息，用于引用相关问题或破坏性变更：

```
feat: add user authentication

Closes #123
BREAKING CHANGE: API endpoints now require authentication
```

## 提交示例

### ✅ 正确的提交信息

```bash
feat: add user authentication system
feat(auth): implement JWT token validation
fix: resolve login form validation issue
docs: update README with setup instructions
style: format code according to prettier rules
refactor: optimize user data fetching
perf: improve bundle loading performance
test: add unit tests for user service
chore: update dependencies to latest versions
ci: add automated testing workflow
```

### ❌ 错误的提交信息

```bash
added new feature
fixed bug
updated docs
formatted code
refactored something
improved performance
added tests
updated deps
```

## 使用指南

### 1. 提交代码

```bash
# 添加文件到暂存区
git add .

# 提交代码（使用规范的提交信息）
git commit -m "feat: add user authentication system"
```

### 2. 检查提交信息

```bash
# 检查最近的提交
npm run commitlint:check

# 检查特定范围的提交
npx commitlint --from HEAD~5 --to HEAD
```

### 3. 修改最近的提交信息

```bash
# 修改最近一次提交的信息
git commit --amend -m "feat: add user authentication system"
```

## 自动化检查

项目配置了 Git Hooks 来自动检查提交信息：

- **pre-commit**: 检查代码质量和格式
- **commit-msg**: 检查提交信息格式

如果提交信息不符合规范，提交将被阻止。

## 常见问题

### Q: 如何跳过提交信息检查？

A: 使用 `--no-verify` 标志（不推荐）：

```bash
git commit -m "temp: temporary commit" --no-verify
```

### Q: 如何修改已提交的信息？

A: 使用 `git rebase` 或 `git commit --amend`

### Q: 提交信息太长怎么办？

A: 使用正文部分详细描述，保持描述简洁

## 工具支持

- **VS Code**: 安装 Conventional Commits 插件
- **WebStorm**: 内置支持
- **命令行**: 使用 `npm run commitlint:check` 检查

## 参考资源

- [Conventional Commits 官网](https://www.conventionalcommits.org/)
- [Angular 提交规范](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-commit-message-format)
- [Commitizen](https://github.com/commitizen/cz-cli) - 交互式提交工具
