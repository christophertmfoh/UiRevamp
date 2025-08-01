import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { HeadingGroup } from './heading-group';

describe('HeadingGroup', () => {
  it('renders title, badge, and description', () => {
    render(
      <HeadingGroup
        badge="Test Badge"
        title="Test Title"
        description="Test description text"
      />
    );
    
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test description text')).toBeInTheDocument();
  });

  it('renders without badge when not provided', () => {
    render(
      <HeadingGroup
        title="Just a Title"
        description="Just a description"
      />
    );
    
    expect(screen.queryByRole('img', { hidden: true })).not.toBeInTheDocument(); // No badge
    expect(screen.getByText('Just a Title')).toBeInTheDocument();
  });

  it('renders without description when not provided', () => {
    render(
      <HeadingGroup
        badge="Badge Only"
        title="Title Only"
      />
    );
    
    expect(screen.getByText('Badge Only')).toBeInTheDocument();
    expect(screen.getByText('Title Only')).toBeInTheDocument();
    expect(screen.queryByText(/description/)).not.toBeInTheDocument();
  });

  it('renders with animated dot when showDot is true', () => {
    const { container } = render(
      <HeadingGroup
        badge="With Dot"
        title="Title"
        showDot
      />
    );
    
    const dot = container.querySelector('.animate-pulse.bg-primary');
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies centered styles by default', () => {
    const { container } = render(
      <HeadingGroup title="Centered Title" />
    );
    
    const wrapper = container.querySelector('.heading-group');
    expect(wrapper?.className).toContain('text-center');
  });

  it('removes centered styles when centered is false', () => {
    const { container } = render(
      <HeadingGroup title="Left Aligned" centered={false} />
    );
    
    const wrapper = container.querySelector('.heading-group');
    expect(wrapper?.className).not.toContain('text-center');
  });

  it('renders correct heading level', () => {
    const { rerender } = render(
      <HeadingGroup title="H1 Title" headingLevel="h1" />
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('H1 Title');

    rerender(<HeadingGroup title="H3 Title" headingLevel="h3" />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('H3 Title');
  });

  it('applies size variants correctly', () => {
    const { container } = render(
      <HeadingGroup
        title="Large Title"
        description="Large description"
        size="large"
      />
    );
    
    const heading = screen.getByRole('heading');
    expect(heading.className).toContain('text-golden-4xl');
    
    const description = screen.getByText('Large description');
    expect(description.className).toContain('text-golden-xl');
  });

  it('applies custom class names', () => {
    const { container } = render(
      <HeadingGroup
        title="Custom Classes"
        description="Custom description"
        className="custom-wrapper"
        headingClassName="custom-heading"
        descriptionClassName="custom-description"
      />
    );
    
    const wrapper = container.querySelector('.heading-group');
    expect(wrapper?.className).toContain('custom-wrapper');
    
    const heading = screen.getByRole('heading');
    expect(heading.className).toContain('custom-heading');
    
    const description = screen.getByText('Custom description');
    expect(description.className).toContain('custom-description');
  });

  it('applies custom badge props', () => {
    render(
      <HeadingGroup
        badge="Custom Badge"
        title="Title"
        badgeProps={{
          variant: 'destructive',
          className: 'custom-badge-class'
        }}
      />
    );
    
    const badge = screen.getByText('Custom Badge');
    expect(badge.className).toContain('custom-badge-class');
  });

  it('applies custom description max width', () => {
    render(
      <HeadingGroup
        title="Title"
        description="Description with custom width"
        descriptionMaxWidth="max-w-xl"
      />
    );
    
    const description = screen.getByText('Description with custom width');
    expect(description.className).toContain('max-w-xl');
  });

  it('adds margin classes between elements', () => {
    const { container } = render(
      <HeadingGroup
        badge="Badge"
        title="Title"
        description="Description"
      />
    );
    
    const heading = screen.getByRole('heading');
    expect(heading.className).toContain('mt-best-friends'); // After badge
    
    const description = screen.getByText('Description');
    expect(description.className).toContain('mt-friends'); // After title
  });
});