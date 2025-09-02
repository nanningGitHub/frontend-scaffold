import type { Meta, StoryObj } from '@storybook/react';
import { LanguageSwitcher } from './LanguageSwitcher';

const meta: Meta<typeof LanguageSwitcher> = {
  title: 'Components/LanguageSwitcher',
  component: LanguageSwitcher,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
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

export const WithCustomStyling: Story = {
  args: {
    className: 'bg-blue-500 text-white px-4 py-2 rounded-lg',
  },
};

export const Large: Story = {
  args: {
    className: 'text-lg px-6 py-3',
  },
};

export const Small: Story = {
  args: {
    className: 'text-sm px-2 py-1',
  },
};

export const Rounded: Story = {
  args: {
    className: 'rounded-full px-4 py-2',
  },
};

export const WithBorder: Story = {
  args: {
    className: 'border-2 border-gray-300 px-4 py-2',
  },
};

export const DarkTheme: Story = {
  args: {
    className: 'bg-gray-800 text-white px-4 py-2 rounded',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

export const LightTheme: Story = {
  args: {
    className:
      'bg-white text-gray-800 border border-gray-300 px-4 py-2 rounded',
  },
  parameters: {
    backgrounds: {
      default: 'light',
    },
  },
};
