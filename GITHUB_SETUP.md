# GitHub 发布指南

## 🚀 发布到 GitHub 的步骤

### 方法一：使用 GitHub CLI（推荐）

1. **安装 GitHub CLI**
   ```bash
   brew install gh
   ```

2. **登录 GitHub**
   ```bash
   gh auth login
   ```

3. **创建仓库并推送**
   ```bash
   gh repo create frontend-scaffold --public --source=. --remote=origin --push
   ```

### 方法二：手动创建（如果 CLI 不可用）

1. **在 GitHub 上创建新仓库**
   - 访问 https://github.com/new
   - 仓库名称：`frontend-scaffold`
   - 描述：`Modern React + TypeScript + Vite project template with comprehensive tooling`
   - 选择 Public
   - 不要初始化 README（我们已经有了）
   - 点击 "Create repository"

2. **添加远程仓库**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/frontend-scaffold.git
   ```

3. **推送代码**
   ```bash
   git branch -M main
   git push -u origin main
   ```

### 方法三：使用 GitHub Desktop

1. 下载并安装 GitHub Desktop
2. 添加现有仓库
3. 发布到 GitHub

## 📋 仓库信息

### 仓库名称建议
- `frontend-scaffold`
- `react-ts-vite-template`
- `modern-react-scaffold`

### 描述
```
Modern React + TypeScript + Vite project template with comprehensive tooling

Features:
- ⚡️ Vite - Lightning fast build tool
- ⚛️ React 18 - Latest React features
- 🔷 TypeScript - Type-safe JavaScript
- 🎨 Tailwind CSS - Utility-first CSS framework
- 🛣️ React Router - Declarative routing
- 🧪 Jest + Testing Library - Complete testing solution
- 📝 ESLint + Prettier - Code quality and formatting
- 🐶 Husky + lint-staged - Git hooks
- 📦 Axios - HTTP client
- 🌐 i18next - Internationalization support
- 📚 Storybook - Component documentation
- 📱 PWA - Progressive Web App support
- 📊 Monitoring - Error tracking and performance monitoring
```

### 标签
```
react, typescript, vite, template, scaffold, frontend, modern, tailwind, testing, storybook, pwa, i18n
```

## 🔧 发布后配置

### 1. 启用 GitHub Pages
- 进入仓库设置
- 找到 Pages 选项
- 选择 GitHub Actions 作为源
- 我们的 CI/CD 已经配置了自动部署

### 2. 配置仓库主题
- 在仓库根目录添加 `.github/ISSUE_TEMPLATE.md`
- 添加 `.github/PULL_REQUEST_TEMPLATE.md`

### 3. 设置分支保护
- 进入 Settings > Branches
- 添加规则保护 main 分支
- 要求 PR 审查和状态检查

### 4. 配置 Actions 权限
- 进入 Settings > Actions > General
- 允许 Actions 读写权限

## 📊 发布后检查清单

- [ ] 代码已推送到 GitHub
- [ ] README.md 显示正确
- [ ] 许可证文件存在
- [ ] CI/CD 工作流正常运行
- [ ] GitHub Pages 部署成功
- [ ] 仓库描述和标签设置正确
- [ ] 分支保护规则已配置

## 🎯 下一步

1. **创建 Release**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   gh release create v1.0.0 --title "v1.0.0" --notes "Initial release"
   ```

2. **添加徽章到 README**
   ```markdown
   ![CI](https://github.com/YOUR_USERNAME/frontend-scaffold/workflows/CI/badge.svg)
   ![License](https://img.shields.io/github/license/YOUR_USERNAME/frontend-scaffold)
   ![Version](https://img.shields.io/github/package-json/v/YOUR_USERNAME/frontend-scaffold)
   ```

3. **创建模板仓库**
   - 在仓库设置中启用 "Template repository"
   - 这样其他人可以直接使用模板创建新项目

## 🔗 有用的链接

- [GitHub CLI 文档](https://cli.github.com/)
- [GitHub Pages 文档](https://pages.github.com/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [创建模板仓库](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository)
