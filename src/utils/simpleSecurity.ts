/**
 * 企业级安全管理工具
 *
 * 功能：
 * 1. 基础安全验证
 * 2. XSS 防护
 * 3. CSRF 防护
 * 4. 输入验证
 * 5. 内容安全策略
 * 6. 安全响应头
 */

import { logger } from './simpleLogger';

export class SimpleSecurity {
  /**
   * 清理 HTML 内容，防止 XSS
   */
  static sanitizeHtml(input: string): string {
    if (typeof input !== 'string') return '';

    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * 验证邮箱格式
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 验证密码强度
   */
  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('密码长度至少8位');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('密码必须包含大写字母');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('密码必须包含小写字母');
    }

    if (!/\d/.test(password)) {
      errors.push('密码必须包含数字');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 生成 CSRF Token
   */
  static generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
      ''
    );
  }

  /**
   * 验证 CSRF Token
   */
  static validateCSRFToken(token: string, expectedToken: string): boolean {
    if (!token || !expectedToken) {
      logger.warn('CSRF token validation failed: missing tokens');
      return false;
    }

    return token === expectedToken;
  }

  /**
   * 基础输入验证
   */
  static validateInput(
    input: unknown,
    type: 'string' | 'number' | 'email' | 'url'
  ): boolean {
    if (input === null || input === undefined) return false;

    switch (type) {
      case 'string':
        return typeof input === 'string' && input.trim().length > 0;
      case 'number':
        return typeof input === 'number' && !isNaN(input);
      case 'email':
        return typeof input === 'string' && this.isValidEmail(input);
      case 'url':
        try {
          new URL(input);
          return true;
        } catch {
          return false;
        }
      default:
        return false;
    }
  }

  /**
   * 记录安全事件
   */
  static logSecurityEvent(event: string, details?: unknown): void {
    logger.warn(`Security Event: ${event}`, details);
  }

  /**
   * 内容安全策略 (CSP) 配置
   */
  static getCSPHeader(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ');
  }

  /**
   * 安全响应头配置
   */
  static getSecurityHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Content-Security-Policy': this.getCSPHeader(),
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    };
  }

  /**
   * 验证文件上传
   */
  static validateFileUpload(
    file: File,
    options: {
      maxSize?: number;
      allowedTypes?: string[];
      allowedExtensions?: string[];
    } = {}
  ): { isValid: boolean; error?: string } {
    const {
      maxSize = 10 * 1024 * 1024,
      allowedTypes = [],
      allowedExtensions = [],
    } = options;

    // 检查文件大小
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `文件大小不能超过 ${maxSize / 1024 / 1024}MB`,
      };
    }

    // 检查文件类型
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return { isValid: false, error: `不支持的文件类型: ${file.type}` };
    }

    // 检查文件扩展名
    if (allowedExtensions.length > 0) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !allowedExtensions.includes(extension)) {
        return { isValid: false, error: `不支持的文件扩展名: ${extension}` };
      }
    }

    return { isValid: true };
  }

  /**
   * 生成安全的随机字符串
   */
  static generateSecureRandom(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
      ''
    );
  }

  /**
   * 验证 JWT Token
   */
  static validateJWT(token: string): {
    isValid: boolean;
    payload?: unknown;
    error?: string;
  } {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return { isValid: false, error: 'Invalid JWT format' };
      }

      const payload = JSON.parse(atob(parts[1]));

      // 检查过期时间
      if (payload.exp && payload.exp < Date.now() / 1000) {
        return { isValid: false, error: 'Token expired' };
      }

      return { isValid: true, payload };
    } catch (error) {
      return { isValid: false, error: 'Invalid JWT token' };
    }
  }
}

// 导出常用方法
export const {
  sanitizeHtml,
  isValidEmail,
  validatePassword,
  generateCSRFToken,
  validateCSRFToken,
  validateInput,
  logSecurityEvent,
} = SimpleSecurity;
