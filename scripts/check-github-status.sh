#!/bin/bash

# GitHub 状态检查脚本

set -e

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_message() {
    echo -e "${GREEN}$1${NC}"
}

print_info() {
    echo -e "${BLUE}$1${NC}"
}

print_warning() {
    echo -e "${YELLOW}$1${NC}"
}

echo "🔍 检查 GitHub 项目状态..."
echo

# 获取仓库信息
REPO_URL="https://github.com/nanningGitHub/frontend-scaffold"

print_info "📋 项目信息："
echo "- 仓库地址: $REPO_URL"
echo "- 分支: main"
echo "- 远程: origin"
echo

# 检查 Git 状态
print_info "🔍 Git 状态："
git status --short || echo "无法获取 Git 状态"
echo

# 检查远程分支
print_info "🌐 远程分支："
git branch -r || echo "无法获取远程分支"
echo

# 检查最近的提交
print_info "📝 最近提交："
git log --oneline -5 || echo "无法获取提交历史"
echo

# 检查 GitHub Actions 状态
print_info "🚀 GitHub Actions 状态："
echo "请访问: $REPO_URL/actions"
echo

# 检查 GitHub Pages 状态
print_info "🌐 GitHub Pages 状态："
echo "请访问: $REPO_URL/settings/pages"
echo

# 检查 Releases
print_info "🏷️  Releases："
echo "请访问: $REPO_URL/releases"
echo

print_message "✅ 状态检查完成！"
echo
print_info "📋 下一步建议："
echo "1. 访问 GitHub 仓库页面查看详细状态"
echo "2. 检查 Actions 标签页的构建状态"
echo "3. 在 Settings → Pages 中启用 GitHub Pages"
echo "4. 创建新的 Release 标签"
echo
print_info "🔗 快速链接："
echo "- 仓库主页: $REPO_URL"
echo "- Actions: $REPO_URL/actions"
echo "- Pages 设置: $REPO_URL/settings/pages"
echo "- Releases: $REPO_URL/releases"
echo "- Issues: $REPO_URL/issues"
echo "- Pull Requests: $REPO_URL/pulls"
