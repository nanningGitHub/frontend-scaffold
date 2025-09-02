/**
 * 简化的安全管理工具
 *
 * 功能：
 * 1. 基础安全验证
 * 2. XSS 防护
 * 3. CSRF 防护
 * 4. 输入验证
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
