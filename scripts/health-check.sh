#!/bin/sh

# 健康检查脚本
# 用于检查应用是否正常运行

set -e

# 配置
HEALTH_CHECK_URL="http://localhost:3000/health"
TIMEOUT=10
RETRIES=3

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查应用健康状态
check_health() {
    local retry_count=0
    
    while [ $retry_count -lt $RETRIES ]; do
        log_info "Health check attempt $((retry_count + 1))/$RETRIES"
        
        # 使用 curl 检查健康端点
        if curl -f -s --max-time $TIMEOUT "$HEALTH_CHECK_URL" > /dev/null 2>&1; then
            log_info "Application is healthy"
            return 0
        else
            retry_count=$((retry_count + 1))
            if [ $retry_count -lt $RETRIES ]; then
                log_warn "Health check failed, retrying in 2 seconds..."
                sleep 2
            fi
        fi
    done
    
    log_error "Health check failed after $RETRIES attempts"
    return 1
}

# 检查端口是否开放
check_port() {
    if netstat -tuln | grep -q ":3000 "; then
        log_info "Port 3000 is open"
        return 0
    else
        log_error "Port 3000 is not open"
        return 1
    fi
}

# 检查进程状态
check_process() {
    if pgrep -f "nginx" > /dev/null; then
        log_info "Nginx process is running"
        return 0
    else
        log_error "Nginx process is not running"
        return 1
    fi
}

# 检查磁盘空间
check_disk_space() {
    local disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ "$disk_usage" -lt 90 ]; then
        log_info "Disk space is sufficient: ${disk_usage}% used"
        return 0
    else
        log_warn "Disk space is low: ${disk_usage}% used"
        return 1
    fi
}

# 检查内存使用
check_memory() {
    local mem_usage=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
    if [ "$mem_usage" -lt 90 ]; then
        log_info "Memory usage is normal: ${mem_usage}% used"
        return 0
    else
        log_warn "Memory usage is high: ${mem_usage}% used"
        return 1
    fi
}

# 检查网络连接
check_network() {
    if ping -c 1 8.8.8.8 > /dev/null 2>&1; then
        log_info "Network connectivity is normal"
        return 0
    else
        log_error "Network connectivity issue detected"
        return 1
    fi
}

# 主健康检查函数
main() {
    log_info "Starting health check..."
    
    local exit_code=0
    
    # 执行各项检查
    check_port || exit_code=1
    check_process || exit_code=1
    check_disk_space || exit_code=1
    check_memory || exit_code=1
    check_network || exit_code=1
    check_health || exit_code=1
    
    if [ $exit_code -eq 0 ]; then
        log_info "All health checks passed"
    else
        log_error "Some health checks failed"
    fi
    
    exit $exit_code
}

# 如果脚本被直接执行，则运行主函数
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    main "$@"
fi
