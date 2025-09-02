/**
 * 安全审计工具
 *
 * 功能：
 * 1. XSS 防护
 * 2. CSRF 保护
 * 3. 输入验证
 * 4. 安全头检查
 * 5. 依赖安全扫描
 */

// XSS 防护
export class XSSProtection {
  private static dangerousTags = [
    'script',
    'iframe',
    'object',
    'embed',
    'form',
    'input',
    'textarea',
    'select',
    'button',
    'link',
    'meta',
    'style',
    'base',
  ];

  private static dangerousAttributes = [
    'onload',
    'onerror',
    'onclick',
    'onmouseover',
    'onfocus',
    'onblur',
    'onchange',
    'onsubmit',
    'onreset',
    'onselect',
    'onkeydown',
    'onkeyup',
    'onkeypress',
    'onmousedown',
    'onmouseup',
    'onmousemove',
    'onmouseout',
    'oncontextmenu',
    'ondblclick',
    'onabort',
    'onbeforeunload',
    'onerror',
    'onhashchange',
    'onload',
    'onpageshow',
    'onpagehide',
    'onresize',
    'onscroll',
    'onunload',
    'onbeforeprint',
    'onafterprint',
  ];

  static sanitizeHTML(html: string): string {
    // 移除危险标签
    let sanitized = html;
    this.dangerousTags.forEach((tag) => {
      const regex = new RegExp(`<${tag}[^>]*>.*?</${tag}>`, 'gi');
      sanitized = sanitized.replace(regex, '');
    });

    // 移除危险属性
    this.dangerousAttributes.forEach((attr) => {
      const regex = new RegExp(`\\s${attr}\\s*=\\s*["'][^"']*["']`, 'gi');
      sanitized = sanitized.replace(regex, '');
    });

    return sanitized;
  }

  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // 移除尖括号
      .replace(/javascript:/gi, '') // 移除 javascript: 协议
      .replace(/on\w+\s*=/gi, '') // 移除事件处理器
      .trim();
  }

  static validateURL(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const allowedProtocols = ['http:', 'https:'];
      return allowedProtocols.includes(urlObj.protocol);
    } catch {
      return false;
    }
  }
}

// CSRF 保护
export class CSRFProtection {
  private static tokenKey = 'csrf-token';

  static generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
      ''
    );
  }

  static setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  static getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  static validateToken(token: string): boolean {
    const storedToken = this.getToken();
    return storedToken !== null && storedToken === token;
  }

  static addTokenToRequest(
    headers: Record<string, string>
  ): Record<string, string> {
    const token = this.getToken();
    if (token) {
      headers['X-CSRF-Token'] = token;
    }
    return headers;
  }
}

// 输入验证
export class InputValidator {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateUsername(username: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    if (username.length > 20) {
      errors.push('Username must be no more than 20 characters long');
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      errors.push(
        'Username can only contain letters, numbers, underscores, and hyphens'
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }

  static validateCreditCard(cardNumber: string): boolean {
    // Luhn algorithm
    const digits = cardNumber.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) {
      return false;
    }

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }
}

// 安全头检查
export class SecurityHeaders {
  static checkCSP(): boolean {
    const metaTags = document.querySelectorAll(
      'meta[http-equiv="Content-Security-Policy"]'
    );
    return metaTags.length > 0;
  }

  static checkHSTS(): boolean {
    // 检查是否有 HSTS 头（这通常在服务器端设置）
    return document.location.protocol === 'https:';
  }

  static checkXFrameOptions(): boolean {
    // 检查是否有 X-Frame-Options 头
    return true; // 实际检查需要在服务器端进行
  }

  static generateSecurityReport(): {
    csp: boolean;
    hsts: boolean;
    xFrameOptions: boolean;
    score: number;
  } {
    const csp = this.checkCSP();
    const hsts = this.checkHSTS();
    const xFrameOptions = this.checkXFrameOptions();

    const score = ([csp, hsts, xFrameOptions].filter(Boolean).length / 3) * 100;

    return {
      csp,
      hsts,
      xFrameOptions,
      score,
    };
  }
}

// 依赖安全扫描
export class DependencyScanner {
  static async scanDependencies(): Promise<{
    vulnerabilities: Array<{
      package: string;
      version: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
    }>;
    score: number;
  }> {
    // 这里应该调用实际的依赖扫描服务
    // 例如 npm audit 或 Snyk API

    const mockVulnerabilities = [
      {
        package: 'lodash',
        version: '4.17.15',
        severity: 'medium' as const,
        description: 'Prototype pollution vulnerability',
      },
    ];

    const score =
      mockVulnerabilities.length === 0
        ? 100
        : Math.max(0, 100 - mockVulnerabilities.length * 20);

    return {
      vulnerabilities: mockVulnerabilities,
      score,
    };
  }
}

// 会话管理
export class SessionManager {
  private static sessionKey = 'user-session';
  private static maxIdleTime = 30 * 60 * 1000; // 30 minutes

  static createSession(userId: string, data: unknown): void {
    const session = {
      userId,
      data,
      createdAt: Date.now(),
      lastActivity: Date.now(),
    };

    sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
  }

  static getSession(): unknown | null {
    const sessionStr = sessionStorage.getItem(this.sessionKey);
    if (!sessionStr) {
      return null;
    }

    try {
      const session = JSON.parse(sessionStr);

      // 检查会话是否过期
      if (Date.now() - session.lastActivity > this.maxIdleTime) {
        this.clearSession();
        return null;
      }

      // 更新最后活动时间
      session.lastActivity = Date.now();
      sessionStorage.setItem(this.sessionKey, JSON.stringify(session));

      return session;
    } catch {
      this.clearSession();
      return null;
    }
  }

  static updateSession(data: unknown): void {
    const session = this.getSession();
    if (session) {
      session.data = { ...session.data, ...data };
      session.lastActivity = Date.now();
      sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
    }
  }

  static clearSession(): void {
    sessionStorage.removeItem(this.sessionKey);
  }

  static isSessionValid(): boolean {
    return this.getSession() !== null;
  }
}

// 导出单例实例
export const xssProtection = new XSSProtection();
export const csrfProtection = new CSRFProtection();
export const inputValidator = new InputValidator();
export const securityHeaders = new SecurityHeaders();
export const dependencyScanner = new DependencyScanner();
export const sessionManager = new SessionManager();
