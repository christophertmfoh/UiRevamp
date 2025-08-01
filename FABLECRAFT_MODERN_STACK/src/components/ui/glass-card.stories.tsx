import type { Meta, StoryObj } from '@storybook/react';
import { GlassCard } from './glass-card';

const meta = {
  title: 'UI/GlassCard',
  component: GlassCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Glass morphism card component with three visual variants for different use cases.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['light', 'heavy', 'elevated'],
      description: 'Visual variant of the glass card',
    },
    hover: {
      control: 'boolean',
      description: 'Enable hover scale effect',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof GlassCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample content for demonstrations
const SampleContent = () => (
  <div className="p-6 space-y-4">
    <h3 className="text-xl font-semibold">Glass Card Content</h3>
    <p className="text-muted-foreground">
      This is a glass morphism card that provides a modern, translucent effect 
      with backdrop blur. Perfect for overlaying on complex backgrounds.
    </p>
    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
      Action Button
    </button>
  </div>
);

// Light variant - default
export const Light: Story = {
  args: {
    variant: 'light',
    hover: false,
    children: <SampleContent />,
  },
};

// Heavy variant - stronger glass effect
export const Heavy: Story = {
  args: {
    variant: 'heavy',
    hover: false,
    children: <SampleContent />,
  },
};

// Elevated variant - premium feel
export const Elevated: Story = {
  args: {
    variant: 'elevated',
    hover: false,
    children: <SampleContent />,
  },
};

// With hover effect
export const WithHover: Story = {
  args: {
    variant: 'heavy',
    hover: true,
    children: <SampleContent />,
  },
};

// Auth form example
export const AuthFormExample: Story = {
  args: {
    variant: 'heavy',
    hover: false,
    className: 'max-w-md mx-auto',
    children: (
      <div className="p-8 space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Sign In
          </button>
        </div>
      </div>
    ),
  },
};

// Card grid example
export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <GlassCard variant="light" hover>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">Light Card</h3>
          <p className="text-muted-foreground">Subtle glass effect for general content.</p>
        </div>
      </GlassCard>
      <GlassCard variant="heavy" hover>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">Heavy Card</h3>
          <p className="text-muted-foreground">Strong glass effect for important elements.</p>
        </div>
      </GlassCard>
      <GlassCard variant="elevated" hover>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">Elevated Card</h3>
          <p className="text-muted-foreground">Premium surface for featured content.</p>
        </div>
      </GlassCard>
    </div>
  ),
};

// With background pattern (to show glass effect)
export const WithBackgroundPattern: Story = {
  render: () => (
    <div 
      className="p-8 rounded-lg"
      style={{
        backgroundImage: `
          linear-gradient(45deg, hsl(var(--primary) / 0.1) 25%, transparent 25%),
          linear-gradient(-45deg, hsl(var(--primary) / 0.1) 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, hsl(var(--primary) / 0.1) 75%),
          linear-gradient(-45deg, transparent 75%, hsl(var(--primary) / 0.1) 75%)
        `,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
      }}
    >
      <GlassCard variant="heavy" className="max-w-md mx-auto">
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">Glass Effect Demo</h3>
          <p className="text-muted-foreground">
            The glass morphism effect creates a translucent appearance that 
            allows the background pattern to show through subtly.
          </p>
        </div>
      </GlassCard>
    </div>
  ),
};