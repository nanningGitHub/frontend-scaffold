import { useState, useCallback, useEffect, useRef } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  data?: Record<string, unknown>;
}

export interface UseNotificationReturn {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotification = (): UseNotificationReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  const generateId = useCallback(() => {
    return `notification_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }, []);

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id'>) => {
      const id = generateId();
      const newNotification: Notification = {
        id,
        duration: 5000, // Default duration
        ...notification,
      };

      setNotifications((prev) => [...prev, newNotification]);

      // Auto-remove notification after duration (if duration > 0)
      if (newNotification.duration && newNotification.duration > 0) {
        const timer = setTimeout(() => {
          removeNotification(id);
        }, newNotification.duration);

        timersRef.current.set(id, timer);
      }
    },
    [generateId]
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );

    // Clear timer if exists
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const clearAll = useCallback(() => {
    // Clear all timers
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();

    setNotifications([]);
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
  };
};
