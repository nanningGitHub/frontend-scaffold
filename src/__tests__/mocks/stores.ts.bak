/* eslint-env jest */

// Auth Store Mock
export const mockAuthStore = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  clearError: jest.fn(),
  refreshToken: jest.fn(),
};

// Theme Store Mock
export const mockThemeStore = {
  theme: 'light',
  systemTheme: 'light',
  setTheme: jest.fn(),
  toggleTheme: jest.fn(),
  detectSystemTheme: jest.fn(),
  getCurrentTheme: jest.fn(() => 'light'),
};

// UI Store Mock
export const mockUIStore = {
  sidebarOpen: false,
  notifications: [],
  modalOpen: false,
  toggleSidebar: jest.fn(),
  addNotification: jest.fn(),
  removeNotification: jest.fn(),
  setModalOpen: jest.fn(),
};

// I18n Store Mock
export const mockI18nStore = {
  currentLanguage: 'zh',
  availableLanguages: ['zh', 'en'],
  changeLanguage: jest.fn(),
  t: jest.fn((key: string) => key),
};

// 创建 Store Mock 工厂函数
export const createMockStore = (
  overrides: Partial<typeof mockAuthStore> = {}
) => ({
  ...mockAuthStore,
  ...overrides,
});

export const createMockThemeStore = (
  overrides: Partial<typeof mockThemeStore> = {}
) => ({
  ...mockThemeStore,
  ...overrides,
});

export const createMockUIStore = (
  overrides: Partial<typeof mockUIStore> = {}
) => ({
  ...mockUIStore,
  ...overrides,
});

export const createMockI18nStore = (
  overrides: Partial<typeof mockI18nStore> = {}
) => ({
  ...mockI18nStore,
  ...overrides,
});
