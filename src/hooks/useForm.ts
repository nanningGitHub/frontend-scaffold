import React from 'react';
import { useState, useCallback, useMemo } from 'react';
import { validateForm, ValidationRules } from '../utils/validation';
import { logger } from '../utils/logger';

/**
 * 表单状态接口
 */
interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isDirty: boolean;
}

/**
 * 表单配置接口
 */
interface FormConfig<T> {
  initialValues: T;
  validationRules?: ValidationRules;
  onSubmit?: (_values: T) => Promise<void> | void;
  onError?: (_errors: Partial<Record<keyof T, string>>) => void;
}

/**
 * 通用表单管理 Hook
 *
 * 功能：
 * 1. 表单状态管理
 * 2. 表单验证
 * 3. 错误处理
 * 4. 提交处理
 * 5. 性能优化
 *
 * 使用方式：
 * const { values, errors, handleChange, handleSubmit, reset } = useForm({
 *   initialValues: { email: '', password: '' },
 *   validationRules: { email: { required: true }, password: { required: true } },
 *   onSubmit: async (values) => { // 处理提交逻辑 }
 * })
 */
export function useForm<T extends Record<string, any>>(config: FormConfig<T>) {
  const { initialValues, validationRules, onSubmit, onError } = config;

  // 表单状态
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isValid: true,
    isDirty: false,
  });

  // 提交状态
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 计算表单是否有效
   */
  const isValid = useMemo(() => {
    if (!validationRules) return true;

    const validation = validateForm(state.values, validationRules);
    return validation.isValid;
  }, [state.values, validationRules]);

  /**
   * 计算表单是否已修改
   */
  const isDirty = useMemo(() => {
    return JSON.stringify(state.values) !== JSON.stringify(initialValues);
  }, [state.values, initialValues]);

  /**
   * 验证表单
   */
  const validate = useCallback(() => {
    if (!validationRules) return { isValid: true, errors: {} };

    const validation = validateForm(state.values, validationRules);

    setState((prev) => ({
      ...prev,
      errors: validation.errors,
      isValid: validation.isValid,
    }));

    return validation;
  }, [state.values, validationRules]);

  /**
   * 处理字段变化
   */
  const handleChange = useCallback(
    (name: keyof T, value: T[keyof T]) => {
      setState((prev) => {
        const newValues = { ...prev.values, [name]: value };
        const newTouched = { ...prev.touched, [name]: true };

        // 实时验证（如果字段已被触摸）
        const newErrors = { ...prev.errors };
        if (validationRules && newTouched[name]) {
          const fieldValidation = validateForm(
            { [name]: value },
            { [name]: validationRules[name] }
          );
          if (fieldValidation.errors[name as string]) {
            newErrors[name] = fieldValidation.errors[name as string];
          } else {
            delete newErrors[name];
          }
        }

        return {
          ...prev,
          values: newValues,
          touched: newTouched,
          errors: newErrors,
        };
      });
    },
    [validationRules]
  );

  /**
   * 处理输入事件
   */
  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value, type } = e.target;
      const fieldName = name as keyof T;

      // 处理不同类型的输入
      let processedValue: T[keyof T] = value as T[keyof T];

      if (type === 'checkbox') {
        const checkbox = e.target as HTMLInputElement;
        processedValue = checkbox.checked as T[keyof T];
      } else if (type === 'number') {
        processedValue = Number(value) as T[keyof T];
      }

      handleChange(fieldName, processedValue);
    },
    [handleChange]
  );

  /**
   * 处理表单提交
   */
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      // 验证表单
      const validation = validate();

      if (!validation.isValid) {
        logger.warn('Form validation failed', { errors: validation.errors });
        onError?.(validation.errors as Partial<Record<keyof T, string>>);
        return false;
      }

      setIsSubmitting(true);

      try {
        await onSubmit?.(state.values);
        logger.info('Form submitted successfully', { values: state.values });
        return true;
      } catch (error) {
        logger.error('Form submission failed', error);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [state.values, validate, onSubmit, onError]
  );

  /**
   * 重置表单
   */
  const reset = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
      isValid: true,
      isDirty: false,
    });
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * 设置字段值
   */
  const setFieldValue = useCallback(
    (name: keyof T, value: T[keyof T]) => {
      handleChange(name, value);
    },
    [handleChange]
  );

  /**
   * 设置字段错误
   */
  const setFieldError = useCallback((name: keyof T, error: string) => {
    setState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [name]: error },
    }));
  }, []);

  /**
   * 清除字段错误
   */
  const clearFieldError = useCallback((name: keyof T) => {
    setState((prev) => {
      const newErrors = { ...prev.errors };
      delete newErrors[name];
      return { ...prev, errors: newErrors };
    });
  }, []);

  /**
   * 触摸字段
   */
  const touchField = useCallback((name: keyof T) => {
    setState((prev) => ({
      ...prev,
      touched: { ...prev.touched, [name]: true },
    }));
  }, []);

  /**
   * 触摸所有字段
   */
  const touchAllFields = useCallback(() => {
    const touched: Partial<Record<keyof T, boolean>> = {};
    Object.keys(state.values).forEach((key) => {
      touched[key as keyof T] = true;
    });

    setState((prev) => ({
      ...prev,
      touched,
    }));
  }, [state.values]);

  return {
    // 状态
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isValid,
    isDirty,
    isSubmitting,

    // 方法
    handleChange,
    handleInputChange,
    handleSubmit,
    reset,
    validate,
    setFieldValue,
    setFieldError,
    clearFieldError,
    touchField,
    touchAllFields,
  };
}
