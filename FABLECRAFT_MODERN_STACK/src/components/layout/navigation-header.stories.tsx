import type { Meta, StoryObj } from '@storybook/react';
import { NavigationHeader } from './navigation-header';

const meta = {
  title: 'Layout/NavigationHeader',
  component: NavigationHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Reusable navigation header with configurable auth states and navigation items.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showAuthButton: {
      control: 'boolean',
      description: 'Whether to show the authentication button',
    },
    authButtonText: {
      control: 'text',
      description: 'Text for the auth button',
    },
    isAuthenticated: {
      control: 'boolean',
      description: 'User authentication status',
    },
    showNavItems: {
      control: 'boolean',
      description: 'Whether to show navigation items',
    },
    user: {
      control: 'object',
      description: 'User object with username, email, id',
    },
  },
} satisfies Meta<typeof NavigationHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default state - landing page with auth button
export const Default: Story = {
  args: {
    showAuthButton: true,
    authButtonText: 'Sign Up / Sign In',
    isAuthenticated: false,
    showNavItems: true,
    onAuthClick: () => console.log('Auth clicked'),
    onNavigate: (view) => console.log('Navigate to:', view),
  },
};

// Authenticated state with user dropdown
export const Authenticated: Story = {
  args: {
    showAuthButton: true,
    isAuthenticated: true,
    showNavItems: true,
    user: {
      username: 'JohnDoe',
      email: 'john@example.com',
      id: '123',
    },
    onLogout: async () => console.log('Logout clicked'),
    onNavigate: (view) => console.log('Navigate to:', view),
  },
};

// Auth page variant - no auth button
export const AuthPage: Story = {
  args: {
    showAuthButton: false,
    showNavItems: true,
    onNavigate: (view) => console.log('Navigate to:', view),
  },
};

// Minimal variant - no nav items
export const MinimalNoNav: Story = {
  args: {
    showAuthButton: false,
    showNavItems: false,
    onNavigate: (view) => console.log('Navigate to:', view),
  },
};

// Mobile view
export const Mobile: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Dark theme
export const DarkTheme: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};