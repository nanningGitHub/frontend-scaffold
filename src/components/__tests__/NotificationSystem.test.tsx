import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NotificationSystem } from '../NotificationSystem';
import { useNotification } from '../../hooks/useNotification';

// Mock the useNotification hook
jest.mock('../../hooks/useNotification');
const mockUseNotification = useNotification as jest.MockedFunction<
  typeof useNotification
>;

describe('NotificationSystem', () => {
  const mockRemoveNotification = jest.fn();

  const mockNotifications = [
    {
      id: '1',
      type: 'success' as const,
      title: 'Success',
      message: 'Operation completed successfully',
      duration: 5000,
    },
    {
      id: '2',
      type: 'error' as const,
      title: 'Error',
      message: 'Something went wrong',
      duration: 0,
    },
  ];

  beforeEach(() => {
    mockUseNotification.mockReturnValue({
      notifications: mockNotifications,
      addNotification: jest.fn(),
      removeNotification: mockRemoveNotification,
      clearAll: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders all notifications', () => {
    render(<NotificationSystem />);

    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(
      screen.getByText('Operation completed successfully')
    ).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders empty state when no notifications', () => {
    mockUseNotification.mockReturnValue({
      notifications: [],
      addNotification: jest.fn(),
      removeNotification: mockRemoveNotification,
      clearAll: jest.fn(),
    });

    render(<NotificationSystem />);

    expect(screen.queryByText('Success')).not.toBeInTheDocument();
  });

  it('calls removeNotification when close button is clicked', () => {
    render(<NotificationSystem />);

    const closeButtons = screen.getAllByRole('button');
    fireEvent.click(closeButtons[0]);

    expect(mockRemoveNotification).toHaveBeenCalledWith('1');
  });

  it('applies correct CSS classes for different notification types', () => {
    render(<NotificationSystem />);

    const successNotification = screen
      .getByText('Operation completed successfully')
      .closest('div');
    const errorNotification = screen
      .getByText('Something went wrong')
      .closest('div');

    expect(successNotification).toHaveClass('border-green-500');
    expect(errorNotification).toHaveClass('border-red-500');
  });

  it('auto-removes notification after duration', async () => {
    jest.useFakeTimers();

    const shortNotification = {
      id: '3',
      type: 'info' as const,
      title: 'Info',
      message: 'This will disappear',
      duration: 1000,
    };

    mockUseNotification.mockReturnValue({
      notifications: [shortNotification],
      addNotification: jest.fn(),
      removeNotification: mockRemoveNotification,
      clearAll: jest.fn(),
    });

    render(<NotificationSystem />);

    expect(screen.getByText('This will disappear')).toBeInTheDocument();

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(mockRemoveNotification).toHaveBeenCalledWith('3');
    });

    jest.useRealTimers();
  });

  it('does not auto-remove notification with duration 0', () => {
    jest.useFakeTimers();

    render(<NotificationSystem />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    jest.advanceTimersByTime(10000);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(mockRemoveNotification).not.toHaveBeenCalledWith('2');

    jest.useRealTimers();
  });

  it('renders notification with correct icon for warning type', () => {
    const warningNotification = {
      id: '4',
      type: 'warning' as const,
      title: 'Warning',
      message: 'Custom warning',
      duration: 5000,
    };

    mockUseNotification.mockReturnValue({
      notifications: [warningNotification],
      addNotification: jest.fn(),
      removeNotification: mockRemoveNotification,
      clearAll: jest.fn(),
    });

    render(<NotificationSystem />);

    // Check that warning icon is rendered (SVG with warning path)
    const warningIcon = screen
      .getByText('Custom warning')
      .closest('div')
      ?.querySelector('svg');
    expect(warningIcon).toBeInTheDocument();
  });
});
