import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navigation from '../Navigation';

// Mock stores
jest.mock('../../stores/themeStore', () => ({
  useThemeStore: () => ({
    theme: 'light',
    toggleTheme: jest.fn(),
    getCurrentTheme: () => 'light',
  }),
}));

jest.mock('../../stores/authStore', () => ({
  useAuthStore: () => ({
    isAuthenticated: false,
    user: null,
    logout: jest.fn(),
  }),
}));

jest.mock('../../stores/uiStore', () => ({
  useUIStore: () => ({
    sidebarOpen: false,
    toggleSidebar: jest.fn(),
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Navigation Component', () => {
  it('renders navigation bar', () => {
    renderWithRouter(<Navigation />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders logo/brand', () => {
    renderWithRouter(<Navigation />);
    expect(screen.getByText('前端脚手架')).toBeInTheDocument();
  });

  it('renders main navigation links', () => {
    renderWithRouter(<Navigation />);
    expect(screen.getByText('首页')).toBeInTheDocument();
    expect(screen.getByText('关于')).toBeInTheDocument();
  });

  it('renders theme toggle button', () => {
    renderWithRouter(<Navigation />);
    expect(screen.getByRole('button', { name: /主题/i })).toBeInTheDocument();
  });
});
