# GitHub 发布指南

本指南将帮助你将项目发布到 GitHub 并配置自动部署。

## 📋 前置要求

1. 拥有 GitHub 账户
2. 已安装 Git
3. 项目已初始化为 Git 仓库

## 🚀 发布步骤

### 1. 在 GitHub 上创建仓库

1. 访问 [GitHub.com](https://github.com)
2. 点击右上角的 "+" 号，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `cli` 或 `react-cli-app`
   - **Description**: `现代化的 React + TypeScript + Vite 项目模板`
   - **Visibility**: 选择 Public 或 Private
   - **不要**勾选 "Initialize this repository with a README"
4. 点击 "Create repository"

### 2. 添加远程仓库

创建仓库后，GitHub 会显示仓库 URL。执行以下命令：

```bash
# 替换 YOUR_USERNAME 和 YOUR_REPO_NAME
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### 3. 推送代码到 GitHub

```bash
# 确保在 main 分支
git branch -M main

# 推送代码
git push -u origin main
```

### 4. 配置 GitHub Pages

#### 方法一：使用 GitHub Actions（推荐）

1. 项目已配置 GitHub Actions 工作流
2. 推送代码到 `main` 分支会自动触发部署
3. 在仓库设置中启用 GitHub Pages：
   - 进入仓库 Settings → Pages
   - Source 选择 "GitHub Actions"

#### 方法二：使用 gh-pages 分支

```bash
# 手动部署
npm run deploy
```

### 5. 更新文档中的链接

将 README.md 中的链接更新为你的实际仓库：

```markdown
- **GitHub Pages**: [在线演示链接](https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/)
```

## 🔧 配置说明

### GitHub Actions 工作流

项目包含 `.github/workflows/deploy.yml` 文件，配置了自动部署：

- 触发条件：推送到 `main` 分支或创建 Pull Request
- 构建环境：Ubuntu 最新版 + Node.js 18
- 部署目标：GitHub Pages

### 部署脚本

项目包含 `scripts/deploy.sh` 脚本，用于手动部署：

```bash
npm run deploy
```

## 📝 后续步骤

### 1. 添加项目描述

在 GitHub 仓库页面添加项目描述和标签。

### 2. 配置仓库设置

- **Settings → Pages**: 启用 GitHub Pages
- **Settings → Actions → General**: 确保 Actions 权限已启用
- **Settings → Branches**: 保护 `main` 分支

### 3. 添加徽章

在 README.md 中添加状态徽章：

```markdown
[![Deploy to GitHub Pages](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/actions)
```

## 🐛 常见问题

### Q: 部署失败怎么办？

A: 检查以下几点：
1. GitHub Actions 权限是否启用
2. 构建日志中是否有错误
3. 确保 `main` 分支名称正确

### Q: 如何更新部署？

A: 推送代码到 `main` 分支即可自动触发重新部署。

### Q: 如何查看部署状态？

A: 在 GitHub 仓库页面点击 "Actions" 标签查看部署状态。

## 📚 相关链接

- [GitHub Pages 文档](https://pages.github.com/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
