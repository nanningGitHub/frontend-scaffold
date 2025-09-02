/* eslint-env jest */
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useForm } from '../useForm';

describe('useForm Hook', () => {
  const initialValues = {
    email: '',
    password: '',
  };

  const validationRules = {
    email: (value: string) => {
      if (!value) return '邮箱不能为空';
      if (!/\S+@\S+\.\S+/.test(value)) return '邮箱格式不正确';
      return null;
    },
    password: (value: string) => {
      if (!value) return '密码不能为空';
      if (value.length < 6) return '密码长度不能少于6位';
      return null;
    },
  };

  it('initializes with initial values', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationRules,
        onSubmit: jest.fn(),
      })
    );

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it('handles input changes', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationRules,
        onSubmit: jest.fn(),
      })
    );

    act(() => {
      result.current.handleInputChange({
        target: { name: 'email', value: 'test@example.com' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.values.email).toBe('test@example.com');
  });

  it('validates fields on blur', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationRules,
        onSubmit: jest.fn(),
      })
    );

    act(() => {
      result.current.handleBlur({
        target: { name: 'email' },
      } as React.FocusEvent<HTMLInputElement>);
    });

    expect(result.current.touched.email).toBe(true);
    expect(result.current.errors.email).toBe('邮箱不能为空');
  });

  it('validates all fields on submit', async () => {
    const mockOnSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationRules,
        onSubmit: mockOnSubmit,
      })
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as React.FormEvent);
    });

    expect(result.current.errors.email).toBe('邮箱不能为空');
    expect(result.current.errors.password).toBe('密码不能为空');
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit when validation passes', async () => {
    const mockOnSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: 'test@example.com', password: 'password123' },
        validationRules,
        onSubmit: mockOnSubmit,
      })
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as React.FormEvent);
    });

    expect(result.current.errors).toEqual({});
    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('handles validation errors', async () => {
    const mockOnError = jest.fn();
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationRules,
        onSubmit: jest.fn(),
        onError: mockOnError,
      })
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as React.FormEvent);
    });

    expect(mockOnError).toHaveBeenCalledWith({
      email: '邮箱不能为空',
      password: '密码不能为空',
    });
  });

  it('sets isSubmitting state during submission', async () => {
    const mockOnSubmit = jest.fn(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: 'test@example.com', password: 'password123' },
        validationRules,
        onSubmit: mockOnSubmit,
      })
    );

    const submitPromise = act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as React.FormEvent);
    });

    expect(result.current.isSubmitting).toBe(true);

    await submitPromise;
    expect(result.current.isSubmitting).toBe(false);
  });

  it('resets form to initial values', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationRules,
        onSubmit: jest.fn(),
      })
    );

    // 修改值
    act(() => {
      result.current.handleInputChange({
        target: { name: 'email', value: 'test@example.com' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.values.email).toBe('test@example.com');

    // 重置表单
    act(() => {
      result.current.resetForm();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  it('sets field value directly', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationRules,
        onSubmit: jest.fn(),
      })
    );

    act(() => {
      result.current.setFieldValue('email', 'new@example.com');
    });

    expect(result.current.values.email).toBe('new@example.com');
  });

  it('sets field error directly', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationRules,
        onSubmit: jest.fn(),
      })
    );

    act(() => {
      result.current.setFieldError('email', '自定义错误信息');
    });

    expect(result.current.errors.email).toBe('自定义错误信息');
  });

  it('validates single field', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationRules,
        onSubmit: jest.fn(),
      })
    );

    act(() => {
      result.current.validateField('email');
    });

    expect(result.current.errors.email).toBe('邮箱不能为空');
  });

  it('handles async validation', async () => {
    const asyncValidationRules = {
      email: async (value: string) => {
        // 模拟异步验证
        await new Promise((resolve) => setTimeout(resolve, 10));
        if (!value) return '邮箱不能为空';
        if (!/\S+@\S+\.\S+/.test(value)) return '邮箱格式不正确';
        return null;
      },
    };

    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationRules: asyncValidationRules,
        onSubmit: jest.fn(),
      })
    );

    await act(async () => {
      await result.current.validateField('email');
    });

    expect(result.current.errors.email).toBe('邮箱不能为空');
  });
});
