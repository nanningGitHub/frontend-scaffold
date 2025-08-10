#!/bin/bash

# GitHub 发布脚本
# 用于自动化发布到 GitHub 并创建 Release

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    echo -e "${GREEN}$1${NC}"
}

print_warning() {
    echo -e "${YELLOW}$1${NC}"
}

print_error() {
    echo -e "${RED}$1${NC}"
}

print_info() {
    echo -e "${BLUE}$1${NC}"
}

# 检查必要的工具
check_requirements() {
    print_info "🔍 检查必要工具..."
    
    if ! command -v git &> /dev/null; then
        print_error "❌ Git 未安装"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "❌ npm 未安装"
        exit 1
    fi
    
    if ! command -v gh &> /dev/null; then
        print_warning "⚠️  GitHub CLI 未安装，将使用手动发布方式"
        USE_GH_CLI=false
    else
        USE_GH_CLI=true
        print_message "✅ GitHub CLI 已安装"
    fi
    
    print_message "✅ 工具检查完成"
}

# 获取当前版本
get_current_version() {
    CURRENT_VERSION=$(node -p "require('./package.json').version")
    print_info "📦 当前版本: $CURRENT_VERSION"
}

# 检查是否有未提交的更改
check_git_status() {
    print_info "🔍 检查 Git 状态..."
    
    if [[ -n $(git status --porcelain) ]]; then
        print_warning "⚠️  发现未提交的更改"
        git status --short
        
        read -p "是否要提交这些更改？(y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            read -p "请输入提交信息: " COMMIT_MESSAGE
            git add .
            git commit -m "$COMMIT_MESSAGE"
            print_message "✅ 更改已提交"
        else
            print_error "❌ 请先提交或暂存更改"
            exit 1
        fi
    else
        print_message "✅ 工作目录干净"
    fi
}

# 运行测试
run_tests() {
    print_info "🧪 运行测试..."
    
    if npm run test:ci; then
        print_message "✅ 测试通过"
    else
        print_error "❌ 测试失败"
        exit 1
    fi
}

# 构建项目
build_project() {
    print_info "🔨 构建项目..."
    
    if npm run build; then
        print_message "✅ 构建成功"
    else
        print_error "❌ 构建失败"
        exit 1
    fi
}

# 推送代码到 GitHub
push_to_github() {
    print_info "🚀 推送到 GitHub..."
    
    git push origin main
    print_message "✅ 代码已推送到 GitHub"
}

# 创建 GitHub Release
create_release() {
    print_info "🏷️  创建 GitHub Release..."
    
    if [ "$USE_GH_CLI" = true ]; then
        # 使用 GitHub CLI
        gh release create "v$CURRENT_VERSION" \
            --title "Release v$CURRENT_VERSION" \
            --notes "## 新功能
- 更新微前端组件
- 优化日志工具
- 改进用户体验

## 技术改进
- 代码质量提升
- 性能优化
- 安全性增强" \
            --target main
        print_message "✅ Release 已创建"
    else
        print_warning "⚠️  请手动在 GitHub 上创建 Release"
        print_info "📝 建议的 Release 标题: v$CURRENT_VERSION"
        print_info "🌐 访问: https://github.com/nanningGitHub/frontend-scaffold/releases/new"
    fi
}

# 显示部署状态
show_deployment_status() {
    print_message "🎉 发布流程完成！"
    echo
    print_info "📋 下一步操作："
    echo "1. 检查 GitHub Actions 部署状态"
    echo "2. 验证 GitHub Pages 是否正常"
    echo "3. 测试新版本功能"
    echo
    print_info "🔗 相关链接："
    echo "- 仓库地址: https://github.com/nanningGitHub/frontend-scaffold"
    echo "- Actions: https://github.com/nanningGitHub/frontend-scaffold/actions"
    echo "- Pages: https://nanningGitHub.github.io/frontend-scaffold/"
    echo "- Releases: https://github.com/nanningGitHub/frontend-scaffold/releases"
}

# 主函数
main() {
    print_message "🚀 开始 GitHub 发布流程..."
    echo
    
    check_requirements
    get_current_version
    check_git_status
    run_tests
    build_project
    push_to_github
    create_release
    show_deployment_status
}

# 运行主函数
main "$@"
