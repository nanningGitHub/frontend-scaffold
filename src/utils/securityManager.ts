import { logger } from './enterpriseLogger';
import { monitoring } from './monitoring';

/**
 * 企业级安全管理器
 * 提供多层次的安全防护措施
 */
export class SecurityManager {
  private static instance: SecurityManager;
  private securityConfig: SecurityConfig;
  private blockedIPs: Set<string> = new Set();
  private rateLimitMap: Map<string, RateLimitInfo> = new Map();
  private securityEvents: SecurityEvent[] = [];

  private constructor(config: Partial<SecurityConfig> = {}) {
    this.securityConfig = {
      enableCSP: true,
      enableHSTS: true,
      enableXSSProtection: true,
      enableContentTypeSniffing: true,
      enableFrameOptions: true,
      enableReferrerPolicy: true,
      maxRequestRate: 100,
      rateLimitWindow: 900000, // 15 minutes
      maxLoginAttempts: 5,
      lockoutDuration: 900000, // 15 minutes
      enableIPBlocking: true,
      enableRequestValidation: true,
      enableInputSanitization: true,
      enableOutputEncoding: true,
      ...config,
    };

    this.initSecurityMeasures();
  }

  static getInstance(config?: Partial<SecurityConfig>): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager(config);
    }
    return SecurityManager.instance;
  }

  /**
   * 初始化安全措施
   */
  private initSecurityMeasures(): void {
    if (typeof window !== 'undefined') {
      this.setupCSP();
      this.setupSecurityHeaders();
      this.setupInputValidation();
      this.setupOutputEncoding();
      this.setupEventListeners();
    }
  }

  /**
   * 设置内容安全策略
   */
  private setupCSP(): void {
    if (!this.securityConfig.enableCSP) return;

    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'nonce-${nonce}' 'strict-dynamic'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      'upgrade-insecure-requests',
    ].join('; ');

    // 创建 meta 标签设置 CSP
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = cspDirectives;
    document.head.appendChild(meta);

    logger.info('Content Security Policy configured', { csp: cspDirectives });
  }

  /**
   * 设置安全响应头
   */
  private setupSecurityHeaders(): void {
    // 这些头通常由服务器设置，这里提供客户端检查
    const requiredHeaders = [
      'X-Frame-Options',
      'X-Content-Type-Options',
      'X-XSS-Protection',
      'Referrer-Policy',
      'Strict-Transport-Security',
    ];

    logger.info('Security headers check configured', {
      headers: requiredHeaders,
    });
  }

  /**
   * 设置输入验证
   */
  private setupInputValidation(): void {
    if (!this.securityConfig.enableInputValidation) return;

    // 监听所有输入事件
    document.addEventListener('input', this.validateInput.bind(this), true);
    document.addEventListener('change', this.validateInput.bind(this), true);
    document.addEventListener('submit', this.validateForm.bind(this), true);

    logger.info('Input validation enabled');
  }

  /**
   * 设置输出编码
   */
  private setupOutputEncoding(): void {
    if (!this.securityConfig.enableOutputEncoding) return;

    // 重写 innerHTML 和 textContent 方法以进行安全编码
    this.secureDOMMethods();

    logger.info('Output encoding enabled');
  }

  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    // 监听可疑的 DOM 操作
    this.observeDOMChanges();

    // 监听网络请求
    this.interceptNetworkRequests();

    // 监听存储访问
    this.monitorStorageAccess();
  }

  /**
   * 验证输入
   */
  private validateInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (!target || !target.value) return;

    const value = target.value;
    const inputType = target.type || 'text';

    // 检查 XSS 攻击
    if (this.detectXSS(value)) {
      this.blockInput(target, 'XSS attack detected');
      this.recordSecurityEvent('xss_attempt', {
        input: target.name || target.id,
        value: this.sanitizeValue(value),
        type: inputType,
      });
    }

    // 检查 SQL 注入
    if (this.detectSQLInjection(value)) {
      this.blockInput(target, 'SQL injection detected');
      this.recordSecurityEvent('sql_injection_attempt', {
        input: target.name || target.id,
        value: this.sanitizeValue(value),
        type: inputType,
      });
    }

    // 检查命令注入
    if (this.detectCommandInjection(value)) {
      this.blockInput(target, 'Command injection detected');
      this.recordSecurityEvent('command_injection_attempt', {
        input: target.name || target.id,
        value: this.sanitizeValue(value),
        type: inputType,
      });
    }
  }

  /**
   * 验证表单
   */
  private validateForm(event: Event): void {
    const form = event.target as HTMLFormElement;
    if (!form) return;

    const formData = new FormData(form);
    let hasSecurityIssue = false;

    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        if (
          this.detectXSS(value) ||
          this.detectSQLInjection(value) ||
          this.detectCommandInjection(value)
        ) {
          hasSecurityIssue = true;
          break;
        }
      }
    }

    if (hasSecurityIssue) {
      event.preventDefault();
      event.stopPropagation();
      this.recordSecurityEvent('form_security_violation', {
        form: form.id || form.action,
        action: 'blocked',
      });
    }
  }

  /**
   * 检测 XSS 攻击
   */
  private detectXSS(value: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
      /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
    ];

    return xssPatterns.some((pattern) => pattern.test(value));
  }

  /**
   * 检测 SQL 注入
   */
  private detectSQLInjection(value: string): boolean {
    const sqlPatterns = [
      /(\b(select|insert|update|delete|drop|create|alter|exec|execute|union|declare|cast|convert|script|iframe|object|embed)\b)/gi,
      /(\b(and|or)\b\s+\d+\s*[=<>])/gi,
      /(\b(union|select)\b\s+.*\bfrom\b)/gi,
      /(\b(exec|execute)\b\s*\()/gi,
      /(\b(declare|cast|convert)\b\s+)/gi,
    ];

    return sqlPatterns.some((pattern) => pattern.test(value));
  }

  /**
   * 检测命令注入
   */
  private detectCommandInjection(value: string): boolean {
    const commandPatterns = [
      /[;&|`$(){}[\]]/g,
      /\b(cat|ls|pwd|whoami|id|uname|ps|top|kill|rm|cp|mv|chmod|chown)\b/gi,
      /\b(bash|sh|zsh|ksh|tcsh|csh)\b/gi,
      /\b(echo|printf|sprintf|eval|exec|system|popen|shell_exec)\b/gi,
    ];

    return commandPatterns.some((pattern) => pattern.test(value));
  }

  /**
   * 阻止输入
   */
  private blockInput(target: HTMLInputElement, reason: string): void {
    target.value = '';
    target.style.border = '2px solid red';
    target.setAttribute('data-security-blocked', 'true');

    // 显示安全警告
    this.showSecurityWarning(reason);

    // 记录安全事件
    this.recordSecurityEvent('input_blocked', {
      reason,
      input: target.name || target.id,
      timestamp: Date.now(),
    });
  }

  /**
   * 显示安全警告
   */
  private showSecurityWarning(message: string): void {
    const warning = document.createElement('div');
    warning.className = 'security-warning';
    warning.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff4444;
      color: white;
      padding: 15px;
      border-radius: 5px;
      z-index: 10000;
      max-width: 300px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    warning.textContent = `Security Warning: ${message}`;

    document.body.appendChild(warning);

    // 3秒后自动移除
    setTimeout(() => {
      if (warning.parentNode) {
        warning.parentNode.removeChild(warning);
      }
    }, 3000);
  }

  /**
   * 安全化值
   */
  private sanitizeValue(value: string): string {
    return value.replace(/[<>"'&]/g, (char) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '&': '&amp;',
      };
      return entities[char] || char;
    });
  }

  /**
   * 安全化 DOM 方法
   */
  private secureDOMMethods(): void {
    // 重写 innerHTML 方法
    const originalInnerHTML = Object.getOwnPropertyDescriptor(
      Element.prototype,
      'innerHTML'
    );
    if (originalInnerHTML) {
      Object.defineProperty(Element.prototype, 'innerHTML', {
        set: function (value: string) {
          const sanitizedValue =
            SecurityManager.getInstance().sanitizeValue(value);
          originalInnerHTML.set?.call(this, sanitizedValue);
        },
        get: originalInnerHTML.get,
        configurable: true,
      });
    }
  }

  /**
   * 观察 DOM 变化
   */
  private observeDOMChanges(): void {
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                this.checkNodeSecurity(node as Element);
              }
            });
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }

  /**
   * 检查节点安全性
   */
  private checkNodeSecurity(node: Element): void {
    // 检查可疑的属性和内容
    const suspiciousAttributes = [
      'onclick',
      'onload',
      'onerror',
      'onmouseover',
    ];
    const suspiciousTags = ['script', 'iframe', 'object', 'embed'];

    if (suspiciousTags.includes(node.tagName.toLowerCase())) {
      this.recordSecurityEvent('suspicious_tag_detected', {
        tag: node.tagName,
        content: node.textContent?.substring(0, 100),
      });
    }

    suspiciousAttributes.forEach((attr) => {
      if (node.hasAttribute(attr)) {
        this.recordSecurityEvent('suspicious_attribute_detected', {
          attribute: attr,
          value: node.getAttribute(attr),
        });
      }
    });
  }

  /**
   * 拦截网络请求
   */
  private interceptNetworkRequests(): void {
    // 重写 fetch 方法
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();

      // 检查可疑的 URL
      if (this.detectSuspiciousURL(url)) {
        this.recordSecurityEvent('suspicious_url_request', { url });
        throw new Error('Suspicious URL detected');
      }

      // 检查请求头
      if (init?.headers) {
        const headers = init.headers as Record<string, string>;
        if (this.detectSuspiciousHeaders(headers)) {
          this.recordSecurityEvent('suspicious_headers_detected', { headers });
        }
      }

      return originalFetch(input, init);
    };
  }

  /**
   * 检测可疑的 URL
   */
  private detectSuspiciousURL(url: string): boolean {
    const suspiciousPatterns = [
      /javascript:/gi,
      /data:text\/html/gi,
      /vbscript:/gi,
      /file:/gi,
      /ftp:/gi,
    ];

    return suspiciousPatterns.some((pattern) => pattern.test(url));
  }

  /**
   * 检测可疑的请求头
   */
  private detectSuspiciousHeaders(headers: Record<string, string>): boolean {
    const suspiciousHeaders = [
      'x-forwarded-for',
      'x-real-ip',
      'x-original-url',
    ];
    return Object.keys(headers).some((header) =>
      suspiciousHeaders.includes(header.toLowerCase())
    );
  }

  /**
   * 监控存储访问
   */
  private monitorStorageAccess(): void {
    // 监控 localStorage 访问
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key: string, value: string) {
      // 检查是否存储敏感信息
      if (SecurityManager.getInstance().isSensitiveData(key, value)) {
        SecurityManager.getInstance().recordSecurityEvent(
          'sensitive_data_storage_attempt',
          {
            key,
            value: value.substring(0, 50) + '...',
          }
        );
      }

      return originalSetItem.call(this, key, value);
    };
  }

  /**
   * 检查是否为敏感数据
   */
  private isSensitiveData(key: string, value: string): boolean {
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth'];
    const sensitivePatterns = [
      /^[A-Za-z0-9+/]{20,}={0,2}$/, // Base64 编码的令牌
      /^[A-Za-z0-9-_]{20,}$/, // JWT 令牌
      /^[0-9a-f]{32,}$/i, // MD5 哈希
    ];

    return (
      sensitiveKeys.some((k) => key.toLowerCase().includes(k)) ||
      sensitivePatterns.some((pattern) => pattern.test(value))
    );
  }

  /**
   * 记录安全事件
   */
  private recordSecurityEvent(type: string, data: Record<string, any>): void {
    const event: SecurityEvent = {
      id: `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      ip: this.getClientIP(),
    };

    this.securityEvents.push(event);

    // 发送到监控系统
    monitoring.recordError(new Error(`Security event: ${type}`), {
      securityEvent: event,
      severity: 'high',
    });

    // 记录到日志
    logger.warn(`Security event detected: ${type}`, event);

    // 检查是否需要触发告警
    this.checkSecurityThresholds(type);
  }

  /**
   * 检查安全阈值
   */
  private checkSecurityThresholds(eventType: string): void {
    const now = Date.now();
    const windowMs = 5 * 60 * 1000; // 5分钟窗口

    const recentEvents = this.securityEvents.filter(
      (event) => event.timestamp > now - windowMs && event.type === eventType
    );

    if (recentEvents.length > 10) {
      this.triggerSecurityAlert(eventType, recentEvents.length);
    }
  }

  /**
   * 触发安全告警
   */
  private triggerSecurityAlert(eventType: string, count: number): void {
    const alert = {
      type: 'security_alert',
      message: `High frequency of security events: ${eventType} (${count} in 5 minutes)`,
      severity: 'critical',
      timestamp: Date.now(),
    };

    // 发送告警通知
    this.sendSecurityAlert(alert);

    // 记录告警
    logger.error('Security alert triggered', alert);
  }

  /**
   * 发送安全告警
   */
  private sendSecurityAlert(alert: any): void {
    // 这里可以集成具体的告警渠道
    // 例如：Slack、邮件、短信等

    // 发送到监控系统
    monitoring.recordError(new Error(alert.message), {
      securityAlert: alert,
      severity: 'critical',
    });
  }

  /**
   * 获取客户端 IP
   */
  private getClientIP(): string {
    // 这里可以通过 API 获取真实 IP
    // 或者从请求头中获取
    return 'unknown';
  }

  /**
   * 获取安全报告
   */
  getSecurityReport(): SecurityReport {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    const recentEvents = this.securityEvents.filter(
      (event) => event.timestamp > oneHourAgo
    );

    const eventTypes = recentEvents.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalEvents: this.securityEvents.length,
      recentEvents: recentEvents.length,
      eventTypes,
      blockedIPs: Array.from(this.blockedIPs),
      timestamp: now,
    };
  }

  /**
   * 清理旧的安全事件
   */
  cleanup(): void {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    this.securityEvents = this.securityEvents.filter(
      (event) => event.timestamp > oneDayAgo
    );
  }
}

// 类型定义
interface SecurityConfig {
  enableCSP: boolean;
  enableHSTS: boolean;
  enableXSSProtection: boolean;
  enableContentTypeSniffing: boolean;
  enableFrameOptions: boolean;
  enableReferrerPolicy: boolean;
  maxRequestRate: number;
  rateLimitWindow: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  enableIPBlocking: boolean;
  enableRequestValidation: boolean;
  enableInputSanitization: boolean;
  enableOutputEncoding: boolean;
}

interface RateLimitInfo {
  count: number;
  firstRequest: number;
  blocked: boolean;
}

interface SecurityEvent {
  id: string;
  type: string;
  data: Record<string, any>;
  timestamp: number;
  userAgent: string;
  url: string;
  ip: string;
}

interface SecurityReport {
  totalEvents: number;
  recentEvents: number;
  eventTypes: Record<string, number>;
  blockedIPs: string[];
  timestamp: number;
}

// 导出单例
export const securityManager = SecurityManager.getInstance();

// 便捷方法
export const validateInput = (value: string): boolean => {
  const manager = SecurityManager.getInstance();
  return (
    !manager['detectXSS'](value) &&
    !manager['detectSQLInjection'](value) &&
    !manager['detectCommandInjection'](value)
  );
};

export const sanitizeValue = (value: string): string => {
  const manager = SecurityManager.getInstance();
  return manager['sanitizeValue'](value);
};
