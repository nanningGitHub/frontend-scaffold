import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSpinner } from './LoadingSpinner';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Components/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the spinner',
    },
    color: {
      control: { type: 'select' },
      options: ['blue', 'green', 'red', 'yellow', 'purple', 'gray'],
      description: 'Color of the spinner',
    },
    text: {
      control: 'text',
      description: 'Loading text to display',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
  },
};

export const WithText: Story = {
  args: {
    text: 'Loading...',
  },
};

export const CustomText: Story = {
  args: {
    text: 'Please wait while we process your request',
  },
};

export const Blue: Story = {
  args: {
    color: 'blue',
    text: 'Loading in blue',
  },
};

export const Green: Story = {
  args: {
    color: 'green',
    text: 'Loading in green',
  },
};

export const Red: Story = {
  args: {
    color: 'red',
    text: 'Loading in red',
  },
};

export const Yellow: Story = {
  args: {
    color: 'yellow',
    text: 'Loading in yellow',
  },
};

export const Purple: Story = {
  args: {
    color: 'purple',
    text: 'Loading in purple',
  },
};

export const Gray: Story = {
  args: {
    color: 'gray',
    text: 'Loading in gray',
  },
};

export const LargeWithText: Story = {
  args: {
    size: 'lg',
    text: 'Processing your data...',
    color: 'blue',
  },
};

export const SmallWithText: Story = {
  args: {
    size: 'sm',
    text: 'Loading',
    color: 'green',
  },
};

export const CustomStyling: Story = {
  args: {
    size: 'md',
    text: 'Custom styled spinner',
    color: 'purple',
    className: 'border-2 border-dashed border-purple-300 p-4 rounded-lg',
  },
};

export const DarkTheme: Story = {
  args: {
    size: 'lg',
    text: 'Loading in dark theme',
    color: 'blue',
    className: 'bg-gray-800 text-white p-6 rounded-lg',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

export const LightTheme: Story = {
  args: {
    size: 'lg',
    text: 'Loading in light theme',
    color: 'blue',
    className: 'bg-white text-gray-800 p-6 rounded-lg border',
  },
  parameters: {
    backgrounds: {
      default: 'light',
    },
  },
};
