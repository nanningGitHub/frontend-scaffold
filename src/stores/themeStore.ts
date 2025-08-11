import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  console.log('applyThemeToDOM called with:', theme);

  try {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      console.log('Added dark class to document.documentElement');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      console.log('Removed dark class from document.documentElement');
    }
    // 对于 'system' 类型，不直接应用，而是通过 detectSystemTheme 处理

    // 验证结果
    const hasDarkClass = document.documentElement.classList.contains('dark');
    console.log('Theme applied successfully. Has dark class:', hasDarkClass);
  } catch (error) {
    console.error('Error applying theme to DOM:', error);
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
        console.log('setTheme called with:', theme);
        set({ theme });

        // 应用主题到 DOM
        if (theme === 'system') {
          const systemTheme = get().systemTheme;
          console.log('Applying system theme:', systemTheme);
          applyThemeToDOM(systemTheme);
        } else {
          console.log('Applying direct theme:', theme);
          applyThemeToDOM(theme);
        }
      },

      // 切换主题
      toggleTheme: () => {
        const currentTheme = get().theme;
        console.log('toggleTheme called, current theme:', currentTheme);
        if (currentTheme === 'system') {
          // 如果当前是系统主题，切换到浅色主题
          console.log('Switching from system to light');
          get().setTheme('light');
        } else {
          // 在浅色和深色之间切换
          const newTheme = currentTheme === 'light' ? 'dark' : 'light';
          console.log('Switching from', currentTheme, 'to', newTheme);
          get().setTheme(newTheme);
        }
      },

      // 检测系统主题
      detectSystemTheme: () => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const systemTheme: 'light' | 'dark' = mediaQuery.matches
          ? 'dark'
          : 'light';

        console.log('detectSystemTheme called, system theme:', systemTheme);
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
          console.log('onRehydrateStorage called, state:', state);
          // 延迟应用主题，确保DOM已准备好
          setTimeout(() => {
            console.log('Applying theme after rehydration');
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
