import type { Meta, StoryObj } from '@storybook/react';
import { NotificationSystem } from './NotificationSystem';
import { useNotification } from '../hooks/useNotification';

// Mock the useNotification hook for Storybook
const meta: Meta<typeof NotificationSystem> = {
  title: 'Components/NotificationSystem',
  component: NotificationSystem,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component to demonstrate notifications
const NotificationDemo = () => {
  const { addNotification, clearAll } = useNotification();

  return (
    <div className="p-4 space-y-4">
      <div className="space-x-2">
        <button
          onClick={() =>
            addNotification({
              type: 'success',
              title: 'Success',
              message: 'Operation completed successfully!',
            })
          }
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Success
        </button>
        <button
          onClick={() =>
            addNotification({
              type: 'error',
              title: 'Error',
              message: 'Something went wrong. Please try again.',
            })
          }
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Add Error
        </button>
        <button
          onClick={() =>
            addNotification({
              type: 'warning',
              title: 'Warning',
              message: 'Please check your input before proceeding.',
            })
          }
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Add Warning
        </button>
        <button
          onClick={() =>
            addNotification({
              type: 'info',
              title: 'Info',
              message: 'Here is some useful information for you.',
            })
          }
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Info
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Clear All
        </button>
      </div>
      <NotificationSystem />
    </div>
  );
};

export const Default: Story = {
  render: () => <NotificationDemo />,
};

export const SuccessNotification: Story = {
  render: () => {
    const { addNotification } = useNotification();

    // Add a success notification
    addNotification({
      type: 'success',
      title: 'Success',
      message: 'Your changes have been saved successfully!',
    });

    return <NotificationSystem />;
  },
};

export const ErrorNotification: Story = {
  render: () => {
    const { addNotification } = useNotification();

    // Add an error notification
    addNotification({
      type: 'error',
      title: 'Error',
      message: 'Failed to save changes. Please try again.',
    });

    return <NotificationSystem />;
  },
};

export const WarningNotification: Story = {
  render: () => {
    const { addNotification } = useNotification();

    // Add a warning notification
    addNotification({
      type: 'warning',
      title: 'Warning',
      message: 'This action cannot be undone.',
    });

    return <NotificationSystem />;
  },
};

export const InfoNotification: Story = {
  render: () => {
    const { addNotification } = useNotification();

    // Add an info notification
    addNotification({
      type: 'info',
      title: 'Info',
      message: 'New features are available in the latest update.',
    });

    return <NotificationSystem />;
  },
};

export const MultipleNotifications: Story = {
  render: () => {
    const { addNotification } = useNotification();

    // Add multiple notifications
    addNotification({
      type: 'success',
      title: 'Success',
      message: 'Data saved successfully',
    });
    addNotification({
      type: 'error',
      title: 'Error',
      message: 'Network connection failed',
    });
    addNotification({
      type: 'warning',
      title: 'Warning',
      message: 'Low disk space',
    });
    addNotification({
      type: 'info',
      title: 'Info',
      message: 'System maintenance scheduled',
    });

    return <NotificationSystem />;
  },
};

export const LongMessage: Story = {
  render: () => {
    const { addNotification } = useNotification();

    // Add a notification with a long message
    addNotification({
      type: 'info',
      title: 'Important Information',
      message:
        'This is a very long notification message that demonstrates how the notification system handles longer text content. It should wrap properly and maintain good readability.',
    });

    return <NotificationSystem />;
  },
};

export const CustomDuration: Story = {
  render: () => {
    const { addNotification } = useNotification();

    // Add a notification with custom duration
    addNotification({
      type: 'success',
      title: 'Quick Success',
      message: 'This notification will disappear in 2 seconds',
      duration: 2000,
    });

    return <NotificationSystem />;
  },
};
