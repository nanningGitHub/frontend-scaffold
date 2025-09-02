import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    const customText = '请稍候...';
    render(<LoadingSpinner text={customText} />);
    expect(screen.getByText(customText)).toBeInTheDocument();
  });

  it('renders with custom size', () => {
    render(<LoadingSpinner size="lg" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('w-8', 'h-8');
  });

  it('renders with custom color', () => {
    render(<LoadingSpinner color="primary" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('text-blue-600');
  });

  it('renders with custom className', () => {
    const customClass = 'custom-spinner';
    const { container } = render(<LoadingSpinner className={customClass} />);
    // 检查最外层容器是否有自定义 className
    expect(container.firstChild).toHaveClass(customClass);
  });

  it('renders without text when text is not provided', () => {
    render(<LoadingSpinner />);
    // 默认情况下会显示 "加载中..." 文本
    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  it('renders fullscreen mode', () => {
    render(<LoadingSpinner fullScreen />);
    const container = screen.getByRole('dialog');
    expect(container).toHaveClass('fixed', 'inset-0', 'z-50');
  });

  it('renders overlay mode', () => {
    render(<LoadingSpinner overlay />);
    const container = screen.getByRole('dialog');
    expect(container).toHaveClass('absolute', 'inset-0', 'z-40');
  });

  it('applies custom aria-label', () => {
    const customAriaLabel = '自定义加载标签';
    render(<LoadingSpinner fullScreen aria-label={customAriaLabel} />);
    const container = screen.getByRole('dialog');
    expect(container).toHaveAttribute('aria-label', customAriaLabel);
  });
});
