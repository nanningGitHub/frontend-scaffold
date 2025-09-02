import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { logger } from '../utils/logger';

/**
 * 主题类型
 */
type Theme = 'light' | 'dark' | 'system';

/**
 * 主题状态接口
 */
interface ThemeState {
  theme: Theme;
  systemTheme: 'light' | 'dark';
}

/**
 * 主题动作接口
 */
interface ThemeActions {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  detectSystemTheme: () => void;
  getCurrentTheme: () => 'light' | 'dark';
}

/**
 * 主题 Store 类型
 */
export type ThemeStore = ThemeState & ThemeActions;

/**
 * 应用主题到DOM
 */
const applyThemeToDOM = (theme: Theme) => {
  logger.debug('applyThemeToDOM called with:', theme);

  try {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      logger.debug('Added dark class to document.documentElement');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      logger.debug('Removed dark class from document.documentElement');
    }
    // 对于 'system' 类型，不直接应用，而是通过 detectSystemTheme 处理

    // 验证结果
    const hasDarkClass = document.documentElement.classList.contains('dark');
    logger.debug('Theme applied successfully. Has dark class:', hasDarkClass);
  } catch (error) {
    logger.error('Error applying theme to DOM:', error);
  }
};

/**
 * 创建主题 Store
 */
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      theme: 'light',
      systemTheme: 'light',

      // 设置主题
      setTheme: (theme: Theme) => {
        logger.debug('setTheme called with:', theme);
        set({ theme });

        // 应用主题到 DOM
        if (theme === 'system') {
          const systemTheme = get().systemTheme;
          logger.debug('Applying system theme:', systemTheme);
          applyThemeToDOM(systemTheme);
        } else {
          logger.debug('Applying direct theme:', theme);
          applyThemeToDOM(theme);
        }
      },

      // 切换主题
      toggleTheme: () => {
        const currentTheme = get().theme;
        logger.debug('toggleTheme called, current theme:', currentTheme);
        if (currentTheme === 'system') {
          // 如果当前是系统主题，切换到浅色主题
          logger.debug('Switching from system to light');
          get().setTheme('light');
        } else {
          // 在浅色和深色之间切换
          const newTheme = currentTheme === 'light' ? 'dark' : 'light';
          logger.debug('Switching from', currentTheme, 'to', newTheme);
          get().setTheme(newTheme);
        }
      },

      // 检测系统主题
      detectSystemTheme: () => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const systemTheme: 'light' | 'dark' = mediaQuery.matches
          ? 'dark'
          : 'light';

        logger.debug('detectSystemTheme called, system theme:', systemTheme);
        set({ systemTheme });

        // 如果当前主题是系统主题，则应用检测到的主题
        if (get().theme === 'system') {
          applyThemeToDOM(systemTheme);
        }
      },

      // 获取当前实际应用的主题
      getCurrentTheme: (): 'light' | 'dark' => {
        const { theme, systemTheme } = get();
        if (theme === 'system') {
          return systemTheme;
        }
        return theme === 'dark' ? 'dark' : 'light';
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ theme: state.theme }),
      // 初始化时应用主题
      onRehydrateStorage: () => (state) => {
        if (state) {
          logger.debug('onRehydrateStorage called, state:', state);
          // 延迟应用主题，确保DOM已准备好
          setTimeout(() => {
            logger.debug('Applying theme after rehydration');
            if (state.theme === 'system') {
              state.detectSystemTheme();
            } else {
              applyThemeToDOM(state.theme);
            }
          }, 100);
        }
      },
    }
  )
);
