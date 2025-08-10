import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 支持的语言类型
 */
type Locale = 'zh-CN' | 'en-US';

/**
 * 国际化状态接口
 */
interface I18nState {
  locale: Locale;
  fallbackLocale: Locale;
}

/**
 * 国际化动作接口
 */
interface I18nActions {
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  getLocale: () => Locale;
}

/**
 * 国际化 Store 类型
 */
export type I18nStore = I18nState & I18nActions;

/**
 * 创建国际化 Store
 */
export const useI18nStore = create<I18nStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      locale: 'zh-CN',
      fallbackLocale: 'en-US',

      // 设置语言
      setLocale: (locale: Locale) => {
        set({ locale });
        
        // 应用语言到 DOM
        document.documentElement.lang = locale;
        
        // 触发语言变更事件
        window.dispatchEvent(new CustomEvent('localeChange', { detail: { locale } }));
      },

      // 切换语言
      toggleLocale: () => {
        const currentLocale = get().locale;
        const newLocale: Locale = currentLocale === 'zh-CN' ? 'en-US' : 'zh-CN';
        get().setLocale(newLocale);
      },

      // 获取当前语言
      getLocale: () => get().locale,
    }),
    {
      name: 'i18n-storage',
      partialize: (state) => ({ locale: state.locale }),
    }
  )
);
