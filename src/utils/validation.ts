import { VALIDATION_RULES } from '../constants';

/**
 * 表单验证工具
 *
 * 功能：
 * 1. 统一的表单验证逻辑
 * 2. 可复用的验证规则
 * 3. 类型安全的验证结果
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown, formData?: Record<string, unknown>) => string | null;
}

export interface ValidationRules {
  [fieldName: string]: ValidationRule;
}

/**
 * 验证单个字段
 */
export function validateField(
  value: unknown,
  fieldName: string,
  rules: ValidationRule,
  formData?: Record<string, unknown>
): string | null {
  // 必填验证
  if (rules.required && (!value || value.toString().trim() === '')) {
    return `${fieldName}不能为空`;
  }

  // 如果值为空且不是必填，则跳过其他验证
  if (!value || value.toString().trim() === '') {
    return null;
  }

  const stringValue = value.toString();

  // 最小长度验证
  if (rules.minLength && stringValue.length < rules.minLength) {
    return `${fieldName}至少${rules.minLength}个字符`;
  }

  // 最大长度验证
  if (rules.maxLength && stringValue.length > rules.maxLength) {
    return `${fieldName}不能超过${rules.maxLength}个字符`;
  }

  // 正则表达式验证
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    return `${fieldName}格式不正确`;
  }

  // 自定义验证
  if (rules.custom) {
    return rules.custom(value, formData);
  }

  return null;
}

/**
 * 验证整个表单
 */
export function validateForm(
  formData: Record<string, unknown>,
  validationRules: ValidationRules
): ValidationResult {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [fieldName, rules] of Object.entries(validationRules)) {
    const error = validateField(
      formData[fieldName],
      fieldName,
      rules,
      formData
    );
    if (error) {
      errors[fieldName] = error;
      isValid = false;
    }
  }

  return { isValid, errors };
}

/**
 * 预定义的验证规则
 */
export const commonValidationRules = {
  email: {
    required: true,
    pattern: VALIDATION_RULES.EMAIL.PATTERN,
  },
  password: {
    required: true,
    minLength: VALIDATION_RULES.PASSWORD.MIN_LENGTH,
  },
  name: {
    required: true,
    minLength: VALIDATION_RULES.NAME.MIN_LENGTH,
  },
  confirmPassword: {
    required: true,
    custom: (value: string, formData?: Record<string, unknown>) => {
      if (formData && value !== (formData.password as string)) {
        return '两次输入的密码不一致';
      }
      return null;
    },
  },
} as const;

/**
 * 验证邮箱格式
 */
export function validateEmail(email: string): boolean {
  return VALIDATION_RULES.EMAIL.PATTERN.test(email);
}

/**
 * 验证密码强度
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  suggestions: string[];
} {
  const suggestions: string[] = [];
  let score = 0;

  // 长度检查
  if (password.length >= 8) score += 1;
  else suggestions.push('密码至少8位');

  // 包含数字
  if (/\d/.test(password)) score += 1;
  else suggestions.push('包含数字');

  // 包含小写字母
  if (/[a-z]/.test(password)) score += 1;
  else suggestions.push('包含小写字母');

  // 包含大写字母
  if (/[A-Z]/.test(password)) score += 1;
  else suggestions.push('包含大写字母');

  // 包含特殊字符
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  else suggestions.push('包含特殊字符');

  let strength: 'weak' | 'medium' | 'strong';
  if (score <= 2) strength = 'weak';
  else if (score <= 4) strength = 'medium';
  else strength = 'strong';

  return {
    isValid: score >= 3,
    strength,
    suggestions: score >= 4 ? [] : suggestions,
  };
}

/**
 * 验证手机号格式（中国大陆）
 */
export function validatePhone(phone: string): boolean {
  const phonePattern = /^1[3-9]\d{9}$/;
  return phonePattern.test(phone);
}

/**
 * 验证身份证号格式（中国大陆）
 */
export function validateIdCard(idCard: string): boolean {
  const idCardPattern =
    /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  return idCardPattern.test(idCard);
}

/**
 * 验证URL格式
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 验证文件大小
 */
export function validateFileSize(file: File, maxSize: number): boolean {
  return file.size <= maxSize;
}

/**
 * 验证文件类型
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}
