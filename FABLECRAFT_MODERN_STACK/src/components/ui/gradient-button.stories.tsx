import type { Meta, StoryObj } from '@storybook/react';
import { GradientButton } from './gradient-button';
import { Sparkles, ArrowRight, Download, Heart } from 'lucide-react';

const meta = {
  title: 'UI/GradientButton',
  component: GradientButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Enhanced button component with gradient overlay effect on hover. Extends the base Button component.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showGradientOverlay: {
      control: 'boolean',
      description: 'Whether to show the gradient overlay on hover',
    },
    gradientColors: {
      control: 'text',
      description: 'Tailwind gradient classes for the overlay',
    },
    gradientDuration: {
      control: 'text',
      description: 'Duration class for the gradient transition',
    },
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Visual style variant (inherited from Button)',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Size of the button (inherited from Button)',
    },
  },
} satisfies Meta<typeof GradientButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default gradient button
export const Default: Story = {
  args: {
    children: 'Start Your Journey',
    showGradientOverlay: true,
  },
};

// With icon
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Sparkles className="mr-2 h-4 w-4" />
        Create Magic
      </>
    ),
  },
};

// Large size with arrow
export const LargeCTA: Story = {
  args: {
    size: 'lg',
    children: (
      <>
        Get Started Now
        <ArrowRight className="ml-2 h-5 w-5" />
      </>
    ),
  },
};

// Custom gradient colors
export const CustomGradient: Story = {
  args: {
    gradientColors: 'from-primary/30 via-secondary/20 to-transparent',
    children: 'Custom Gradient',
  },
};

// Slower transition
export const SlowTransition: Story = {
  args: {
    gradientDuration: 'duration-1000',
    children: 'Slow Fade',
  },
};

// Without gradient overlay
export const NoOverlay: Story = {
  args: {
    showGradientOverlay: false,
    children: 'No Overlay Effect',
  },
};

// Different button variants
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <GradientButton>Default</GradientButton>
      <GradientButton variant="secondary">Secondary</GradientButton>
      <GradientButton variant="destructive">Destructive</GradientButton>
      <GradientButton variant="outline">Outline</GradientButton>
      <GradientButton variant="ghost">Ghost</GradientButton>
    </div>
  ),
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <GradientButton size="sm">Small</GradientButton>
      <GradientButton>Default</GradientButton>
      <GradientButton size="lg">Large</GradientButton>
      <GradientButton size="icon">
        <Heart className="h-4 w-4" />
      </GradientButton>
    </div>
  ),
};

// Real-world examples
export const RealWorldExamples: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold">Landing Page CTA</h3>
        <GradientButton size="lg" className="px-10 py-5 text-lg">
          <Sparkles className="mr-3 h-5 w-5" />
          Start Creating Stories
        </GradientButton>
      </div>
      
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold">Download Action</h3>
        <GradientButton>
          <Download className="mr-2 h-4 w-4" />
          Download Template
        </GradientButton>
      </div>
      
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold">Auth Form</h3>
        <GradientButton className="w-full max-w-sm">
          Sign Up & Start Writing
        </GradientButton>
      </div>
    </div>
  ),
};

// Loading state
export const Loading: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <div className="mr-2 h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        Processing...
      </>
    ),
  },
};

// Gradient button group
export const ButtonGroup: Story = {
  render: () => (
    <div className="flex gap-2">
      <GradientButton className="rounded-r-none">Primary Action</GradientButton>
      <GradientButton variant="outline" className="rounded-l-none">
        Secondary
      </GradientButton>
    </div>
  ),
};