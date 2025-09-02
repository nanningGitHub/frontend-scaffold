import { renderHook, act } from '@testing-library/react';
import { useNotification } from '../useNotification';

describe('useNotification', () => {
  beforeEach(() => {
    // Clear any existing notifications
    jest.clearAllMocks();
  });

  it('should initialize with empty notifications', () => {
    const { result } = renderHook(() => useNotification());

    expect(result.current.notifications).toEqual([]);
  });

  it('should add a notification', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.addNotification({
        type: 'success',
        title: 'Success',
        message: 'Operation completed',
      });
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0]).toMatchObject({
      type: 'success',
      title: 'Success',
      message: 'Operation completed',
    });
    expect(result.current.notifications[0].id).toBeDefined();
  });

  it('should add notification with custom duration', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.addNotification({
        type: 'info',
        title: 'Info',
        message: 'Custom duration',
        duration: 10000,
      });
    });

    expect(result.current.notifications[0].duration).toBe(10000);
  });

  it('should remove a notification by id', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.addNotification({
        type: 'success',
        title: 'Success',
        message: 'Operation completed',
      });
    });

    const notificationId = result.current.notifications[0].id;

    act(() => {
      result.current.removeNotification(notificationId);
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it('should clear all notifications', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.addNotification({
        type: 'success',
        title: 'Success 1',
        message: 'Message 1',
      });
      result.current.addNotification({
        type: 'error',
        title: 'Error 1',
        message: 'Message 2',
      });
    });

    expect(result.current.notifications).toHaveLength(2);

    act(() => {
      result.current.clearAll();
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it('should auto-remove notification after duration', async () => {
    jest.useFakeTimers();

    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.addNotification({
        type: 'info',
        title: 'Auto remove',
        message: 'This will disappear',
        duration: 1000,
      });
    });

    expect(result.current.notifications).toHaveLength(1);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.notifications).toHaveLength(0);

    jest.useRealTimers();
  });

  it('should not auto-remove notification with duration 0', async () => {
    jest.useFakeTimers();

    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.addNotification({
        type: 'error',
        title: 'Persistent error',
        message: 'This will not disappear',
        duration: 0,
      });
    });

    expect(result.current.notifications).toHaveLength(1);

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(result.current.notifications).toHaveLength(1);

    jest.useRealTimers();
  });

  it('should handle multiple notifications with different durations', async () => {
    jest.useFakeTimers();

    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.addNotification({
        type: 'success',
        title: 'Quick success',
        message: 'Disappears quickly',
        duration: 500,
      });
      result.current.addNotification({
        type: 'error',
        title: 'Persistent error',
        message: 'Stays forever',
        duration: 0,
      });
    });

    expect(result.current.notifications).toHaveLength(2);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].title).toBe('Persistent error');

    jest.useRealTimers();
  });

  it('should generate unique ids for notifications', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.addNotification({
        type: 'info',
        title: 'Notification 1',
        message: 'Message 1',
      });
      result.current.addNotification({
        type: 'info',
        title: 'Notification 2',
        message: 'Message 2',
      });
    });

    const ids = result.current.notifications.map((n) => n.id);
    expect(ids[0]).not.toBe(ids[1]);
  });

  it('should handle notification with custom data', () => {
    const { result } = renderHook(() => useNotification());

    const customData = { userId: '123', action: 'login' };

    act(() => {
      result.current.addNotification({
        type: 'success',
        title: 'Custom notification',
        message: 'With custom data',
        data: customData,
      });
    });

    expect(result.current.notifications[0].data).toEqual(customData);
  });
});
