import type { Meta, StoryObj } from '@storybook/react';
import { SectionContainer, SectionContent } from './section-container';

const meta = {
  title: 'Layout/SectionContainer',
  component: SectionContainer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Container component for consistent section spacing and layout based on the design system.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ['section', 'div', 'article', 'main'],
      description: 'HTML element to render',
    },
    spacing: {
      control: 'select',
      options: ['default', 'hero', 'compact', 'custom'],
      description: 'Section spacing variant',
    },
    width: {
      control: 'select',
      options: ['default', 'narrow', 'wide', 'full'],
      description: 'Max width constraint',
    },
    padding: {
      control: 'select',
      options: ['default', 'loose', 'tight', 'none'],
      description: 'Horizontal padding',
    },
  },
} satisfies Meta<typeof SectionContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample content component
const SampleContent = () => (
  <>
    <h2 className="text-3xl font-bold mb-4">Section Title</h2>
    <p className="text-muted-foreground mb-8">
      This demonstrates how SectionContainer provides consistent spacing and layout
      for page sections. The mathematical spacing system ensures visual harmony.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 bg-card rounded-lg border">
        <h3 className="font-semibold mb-2">Feature One</h3>
        <p className="text-sm text-muted-foreground">Description of the first feature.</p>
      </div>
      <div className="p-6 bg-card rounded-lg border">
        <h3 className="font-semibold mb-2">Feature Two</h3>
        <p className="text-sm text-muted-foreground">Description of the second feature.</p>
      </div>
      <div className="p-6 bg-card rounded-lg border">
        <h3 className="font-semibold mb-2">Feature Three</h3>
        <p className="text-sm text-muted-foreground">Description of the third feature.</p>
      </div>
    </div>
  </>
);

// Default section
export const Default: Story = {
  args: {
    children: <SampleContent />,
  },
};

// Hero section spacing
export const HeroSpacing: Story = {
  args: {
    spacing: 'hero',
    children: (
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-6">Hero Section</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          This uses hero spacing (96px) which is slightly less than default,
          perfect for prominent hero sections at the top of pages.
        </p>
      </div>
    ),
  },
};

// Compact spacing
export const CompactSpacing: Story = {
  args: {
    spacing: 'compact',
    children: <SampleContent />,
  },
};

// Narrow width
export const NarrowWidth: Story = {
  args: {
    width: 'narrow',
    children: (
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Narrow Container</h2>
        <p className="text-muted-foreground">
          This section uses max-w-5xl for content that benefits from a narrower reading width.
          Perfect for blog posts, articles, or centered content.
        </p>
      </div>
    ),
  },
};

// With SectionContent wrapper
export const WithSectionContent: Story = {
  render: () => (
    <SectionContainer spacing="default">
      <SectionContent align="center" spacing="default">
        <div>
          <h2 className="text-4xl font-bold mb-4">Using SectionContent</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            SectionContent provides consistent spacing between child elements.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="p-6 bg-card rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Left Card</h3>
            <p className="text-muted-foreground">
              The spacing between these elements is automatically handled by SectionContent.
            </p>
          </div>
          <div className="p-6 bg-card rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Right Card</h3>
            <p className="text-muted-foreground">
              This creates a consistent vertical rhythm throughout the section.
            </p>
          </div>
        </div>
      </SectionContent>
    </SectionContainer>
  ),
};

// Multiple sections
export const MultipleSections: Story = {
  render: () => (
    <>
      <SectionContainer spacing="hero" className="bg-muted/30">
        <SectionContent align="center">
          <h1 className="text-5xl font-bold">Page Title</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hero section with special background
          </p>
        </SectionContent>
      </SectionContainer>

      <SectionContainer spacing="compact">
        <SectionContent align="center">
          <h2 className="text-3xl font-bold">Features Section</h2>
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-4 bg-card rounded-lg">
                Feature {i}
              </div>
            ))}
          </div>
        </SectionContent>
      </SectionContainer>

      <SectionContainer spacing="default" className="bg-card">
        <SectionContent align="center">
          <h2 className="text-3xl font-bold">Content Section</h2>
          <p className="text-muted-foreground">
            Standard spacing between sections creates visual hierarchy
          </p>
        </SectionContent>
      </SectionContainer>
    </>
  ),
};

// Custom element type
export const AsArticle: Story = {
  args: {
    as: 'article',
    width: 'narrow',
    children: (
      <>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Article Title</h1>
          <p className="text-muted-foreground">Published on January 1, 2024</p>
        </header>
        <div className="prose prose-lg">
          <p>
            When using SectionContainer with as="article", it renders semantic HTML
            that's better for SEO and accessibility. This is perfect for blog posts
            or documentation pages.
          </p>
        </div>
      </>
    ),
  },
};

// Responsive behavior
export const ResponsiveBehavior: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">Responsive Spacing</h2>
        <p className="text-muted-foreground">
          Resize your browser to see how padding and spacing adapt:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="p-4 bg-primary/10 rounded text-center">
              Item {i}
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          • Mobile: Tighter spacing and padding<br />
          • Tablet: Standard spacing<br />
          • Desktop: Generous spacing for better readability
        </p>
      </div>
    ),
  },
};