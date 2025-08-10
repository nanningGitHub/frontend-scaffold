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
  systemTheme: Theme;
}

/**
 * 主题动作接口
 */
interface ThemeActions {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  detectSystemTheme: () => void;
}

/**
 * 主题 Store 类型
 */
export type ThemeStore = ThemeState & ThemeActions;

/**
 * 创建主题 Store
 */
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      theme: 'system',
      systemTheme: 'light',

      // 设置主题
      setTheme: (theme: Theme) => {
        set({ theme });
        
        // 应用主题到 DOM
        if (theme === 'system') {
          const systemTheme = get().systemTheme;
          document.documentElement.className = systemTheme;
        } else {
          document.documentElement.className = theme;
        }
      },

      // 切换主题
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },

      // 检测系统主题
      detectSystemTheme: () => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const systemTheme: Theme = mediaQuery.matches ? 'dark' : 'light';
        
        set({ systemTheme });
        
        // 如果当前主题是系统主题，则应用检测到的主题
        if (get().theme === 'system') {
          document.documentElement.className = systemTheme;
        }
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
