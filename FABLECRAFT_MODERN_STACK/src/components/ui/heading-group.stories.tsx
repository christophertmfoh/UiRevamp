import type { Meta, StoryObj } from '@storybook/react';
import { HeadingGroup } from './heading-group';

const meta = {
  title: 'UI/HeadingGroup',
  component: HeadingGroup,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Reusable component for the badge+title+description pattern used in section headers.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    badge: {
      control: 'text',
      description: 'Badge text to display above the title',
    },
    title: {
      control: 'text',
      description: 'Main heading text',
    },
    description: {
      control: 'text',
      description: 'Optional description text',
    },
    centered: {
      control: 'boolean',
      description: 'Whether to center align the content',
    },
    size: {
      control: 'select',
      options: ['default', 'large', 'medium', 'small', 'compact'],
      description: 'Size variant for the heading and description',
    },
    showDot: {
      control: 'boolean',
      description: 'Whether to show the decorative animated dot',
    },
    headingLevel: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description: 'Heading level for semantic HTML',
    },
  },
} satisfies Meta<typeof HeadingGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default usage
export const Default: Story = {
  args: {
    badge: 'Revolutionary Creative Technology',
    title: "The Creative Industry's First Complete Multimedia Suite",
    description: 'Break free from scattered tools. Fablecraft replaces 50+ applications with one intelligent platform that understands your entire creative process.',
  },
};

// With animated dot
export const WithDot: Story = {
  args: {
    badge: 'New Feature',
    title: 'AI-Powered Character Creation',
    description: 'Let our AI assistant help you create rich, complex characters in minutes.',
    showDot: true,
  },
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-16">
      <HeadingGroup
        badge="Large Size"
        title="This is a Large Heading"
        description="Large size is perfect for hero sections and major announcements."
        size="large"
      />
      
      <HeadingGroup
        badge="Default Size"
        title="This is a Default Heading"
        description="Default size works well for most section headers."
        size="default"
      />
      
      <HeadingGroup
        badge="Medium Size"
        title="This is a Medium Heading"
        description="Medium size is great for subsections."
        size="medium"
      />
      
      <HeadingGroup
        badge="Small Size"
        title="This is a Small Heading"
        description="Small size works for minor sections."
        size="small"
      />
      
      <HeadingGroup
        badge="Compact Size"
        title="This is a Compact Heading"
        description="Compact size is ideal for tight spaces."
        size="compact"
      />
    </div>
  ),
};

// Without badge
export const NoBadge: Story = {
  args: {
    title: 'Simple Heading Without Badge',
    description: 'Sometimes you just need a title and description without the badge element.',
  },
};

// Without description
export const NoDescription: Story = {
  args: {
    badge: 'Features',
    title: 'Powerful Tools for Creative Writers',
  },
};

// Left aligned
export const LeftAligned: Story = {
  args: {
    badge: 'Documentation',
    title: 'Getting Started Guide',
    description: 'Learn how to make the most of Fablecraft with our comprehensive documentation.',
    centered: false,
  },
};

// As main page heading (h1)
export const AsPageHeading: Story = {
  args: {
    badge: 'Welcome',
    title: 'Start Your Creative Journey',
    description: 'Everything you need to bring stories to life, all in one powerful platform.',
    headingLevel: 'h1',
    size: 'large',
    showDot: true,
  },
};

// Custom badge styling
export const CustomBadge: Story = {
  args: {
    badge: 'Limited Time',
    title: 'Special Launch Offer',
    description: 'Get 50% off your first year when you sign up today.',
    badgeProps: {
      variant: 'destructive',
      className: 'animate-pulse',
    },
  },
};

// Multiple in context
export const InPageContext: Story = {
  render: () => (
    <div className="space-y-24">
      <HeadingGroup
        badge: "What's New"
        title: "Introducing Fablecraft 2.0"
        description: "A complete reimagining of creative writing tools for the modern storyteller."
        size="large"
        headingLevel="h1"
        showDot
      />
      
      <HeadingGroup
        badge: "Features"
        title: "Everything You Need to Write"
        description: "From character creation to world-building, we've got you covered."
      />
      
      <HeadingGroup
        badge: "Pricing"
        title: "Choose Your Plan"
        description: "Flexible pricing options for writers at every stage."
      />
      
      <HeadingGroup
        badge: "Community"
        title: "Join Thousands of Writers"
        description: "Connect, collaborate, and share your stories."
        size="medium"
      />
    </div>
  ),
};

// Custom description width
export const CustomDescriptionWidth: Story = {
  args: {
    badge: 'About',
    title: 'Our Mission',
    description: 'We believe every writer deserves professional tools that inspire creativity and streamline the writing process. Our mission is to democratize storytelling by making advanced creative tools accessible to everyone.',
    descriptionMaxWidth: 'max-w-2xl',
  },
};

// With custom classes
export const WithCustomClasses: Story = {
  args: {
    badge: 'Beta',
    title: 'AI Story Assistant',
    description: 'Get intelligent suggestions as you write.',
    className: 'bg-gradient-to-b from-primary/5 to-transparent p-8 rounded-2xl',
    headingClassName: 'bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent',
    descriptionClassName: 'text-foreground/80',
  },
};