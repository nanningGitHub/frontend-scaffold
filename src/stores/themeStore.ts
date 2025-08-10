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
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (theme === 'light') {
    document.documentElement.classList.remove('dark');
  }
  // 对于 'system' 类型，不直接应用，而是通过 detectSystemTheme 处理
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
        set({ theme });

        // 应用主题到 DOM
        if (theme === 'system') {
          const systemTheme = get().systemTheme;
          applyThemeToDOM(systemTheme);
        } else {
          applyThemeToDOM(theme);
        }
      },

      // 切换主题
      toggleTheme: () => {
        const currentTheme = get().theme;
        if (currentTheme === 'system') {
          // 如果当前是系统主题，切换到浅色主题
          get().setTheme('light');
        } else {
          // 在浅色和深色之间切换
          const newTheme = currentTheme === 'light' ? 'dark' : 'light';
          get().setTheme(newTheme);
        }
      },

      // 检测系统主题
      detectSystemTheme: () => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const systemTheme: Theme = mediaQuery.matches ? 'dark' : 'light';

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
        // 由于 theme 可能是 'system'，我们需要确保返回正确的类型
        return theme === 'dark' ? 'dark' : 'light';
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ theme: state.theme }),
      // 初始化时应用主题
      onRehydrateStorage: () => (state) => {
        if (state) {
          // 延迟应用主题，确保DOM已准备好
          setTimeout(() => {
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
