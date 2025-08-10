#!/bin/bash

# 微前端环境启动脚本
# 启动主应用和所有微应用

echo "🚀 启动微前端环境..."

# 检查端口是否被占用
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ 端口 $1 已被占用"
        return 1
    else
        echo "✅ 端口 $1 可用"
        return 0
    fi
}

# 启动主应用
start_host_app() {
    echo "📱 启动主应用 (端口 3000)..."
    if check_port 3000; then
        cd /Users/nanning/cli
        npm run dev &
        echo "✅ 主应用已启动: http://localhost:3000"
    else
        echo "❌ 主应用启动失败"
        return 1
    fi
}

# 启动微应用示例
start_micro_apps() {
    echo "🔧 启动微应用..."
    
    # 这里可以添加启动微应用的命令
    # 例如：
    # echo "启动用户管理模块 (端口 3001)..."
    # cd ../user-module && npm run dev &
    
    echo "ℹ️  微应用需要单独启动，请参考各微应用的启动说明"
}

# 显示状态
show_status() {
    echo ""
    echo "📊 微前端环境状态:"
    echo "主应用: http://localhost:3000"
    echo "微应用配置:"
    echo "  - Remote App: http://localhost:3001"
    echo "  - User Module: http://localhost:3002"
    echo "  - Admin Module: http://localhost:3003"
    echo ""
    echo "💡 提示: 访问 http://localhost:3000/micro-frontend 查看微前端演示"
}

# 主函数
main() {
    start_host_app
    start_micro_apps
    show_status
    
    echo "🎉 微前端环境启动完成！"
    echo "按 Ctrl+C 停止所有服务"
    
    # 等待用户中断
    wait
}

# 错误处理
trap 'echo ""; echo "🛑 正在停止服务..."; kill $(jobs -p) 2>/dev/null; exit' INT

# 运行主函数
main
