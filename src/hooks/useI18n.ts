import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

/**
 * 国际化工具 Hook
 *
 * 功能：
 * 1. 提供翻译功能
 * 2. 语言切换
 * 3. 当前语言状态
 * 4. 格式化日期和数字
 */
export const useI18n = () => {
  const { t, i18n } = useTranslation();

  // 当前语言
  const currentLanguage = i18n.language;

  // 切换语言
  const changeLanguage = useCallback(
    (language: string) => {
      i18n.changeLanguage(language);
    },
    [i18n]
  );

  // 格式化日期
  const formatDate = useCallback(
    (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return new Intl.DateTimeFormat(currentLanguage, options).format(dateObj);
    },
    [currentLanguage]
  );

  // 格式化数字
  const formatNumber = useCallback(
    (number: number, options?: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat(currentLanguage, options).format(number);
    },
    [currentLanguage]
  );

  // 格式化货币
  const formatCurrency = useCallback(
    (amount: number, currency = 'CNY', options?: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat(currentLanguage, {
        style: 'currency',
        currency,
        ...options,
      }).format(amount);
    },
    [currentLanguage]
  );

  // 获取语言方向
  const getDirection = useCallback(() => {
    return currentLanguage === 'ar' || currentLanguage === 'he' ? 'rtl' : 'ltr';
  }, [currentLanguage]);

  // 检查是否为 RTL 语言
  const isRTL = useCallback(() => {
    return getDirection() === 'rtl';
  }, [getDirection]);

  return {
    t,
    currentLanguage,
    changeLanguage,
    formatDate,
    formatNumber,
    formatCurrency,
    getDirection,
    isRTL,
  };
};
