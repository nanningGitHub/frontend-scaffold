import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSwitcher from '../LanguageSwitcher';
import { useI18n } from '../../hooks/useI18n';

// Mock the useI18n hook
jest.mock('../../hooks/useI18n');
const mockUseI18n = useI18n as jest.MockedFunction<typeof useI18n>;

describe('LanguageSwitcher', () => {
  const mockChangeLanguage = jest.fn();

  beforeEach(() => {
    mockUseI18n.mockReturnValue({
      t: jest.fn((key: string) => key),
      i18n: {
        changeLanguage: mockChangeLanguage,
        language: 'en',
      },
      ready: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders language switcher with current language', () => {
    render(<LanguageSwitcher />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('shows language options when clicked', () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('中文')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('changes language when option is selected', () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const chineseOption = screen.getByText('中文');
    fireEvent.click(chineseOption);

    expect(mockChangeLanguage).toHaveBeenCalledWith('zh');
  });

  it('closes dropdown when clicking outside', () => {
    render(
      <div>
        <LanguageSwitcher />
        <div data-testid="outside">Outside</div>
      </div>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('中文')).toBeInTheDocument();

    const outside = screen.getByTestId('outside');
    fireEvent.click(outside);

    expect(screen.queryByText('中文')).not.toBeInTheDocument();
  });

  it('displays correct language name for different languages', () => {
    mockUseI18n.mockReturnValue({
      t: jest.fn((key: string) => key),
      i18n: {
        changeLanguage: mockChangeLanguage,
        language: 'zh',
      },
      ready: true,
    });

    render(<LanguageSwitcher />);

    expect(screen.getByText('中文')).toBeInTheDocument();
  });

  it('handles loading state', () => {
    mockUseI18n.mockReturnValue({
      t: jest.fn((key: string) => key),
      i18n: {
        changeLanguage: mockChangeLanguage,
        language: 'en',
      },
      ready: false,
    });

    render(<LanguageSwitcher />);

    // Should show loading state or be disabled
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
