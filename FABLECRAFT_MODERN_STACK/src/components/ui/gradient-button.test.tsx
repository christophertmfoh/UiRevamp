import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { GradientButton } from './gradient-button';

describe('GradientButton', () => {
  it('renders button with gradient overlay by default', () => {
    const { container } = render(<GradientButton>Click me</GradientButton>);
    
    // Check button exists
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    
    // Check for gradient overlay
    const overlay = container.querySelector('.bg-gradient-to-r');
    expect(overlay).toBeInTheDocument();
    expect(overlay?.className).toContain('opacity-0');
    expect(overlay?.className).toContain('group-hover:opacity-100');
  });

  it('renders without gradient overlay when showGradientOverlay is false', () => {
    const { container } = render(
      <GradientButton showGradientOverlay={false}>No overlay</GradientButton>
    );
    
    const overlay = container.querySelector('.bg-gradient-to-r');
    expect(overlay).not.toBeInTheDocument();
  });

  it('applies custom gradient colors', () => {
    const { container } = render(
      <GradientButton gradientColors="from-primary/30 to-transparent">
        Custom gradient
      </GradientButton>
    );
    
    const overlay = container.querySelector('.bg-gradient-to-r');
    expect(overlay?.className).toContain('from-primary/30');
    expect(overlay?.className).toContain('to-transparent');
  });

  it('applies custom gradient duration', () => {
    const { container } = render(
      <GradientButton gradientDuration="duration-1000">
        Slow fade
      </GradientButton>
    );
    
    const overlay = container.querySelector('.bg-gradient-to-r');
    expect(overlay?.className).toContain('duration-1000');
  });

  it('renders with primary styles by default', () => {
    render(<GradientButton>Primary button</GradientButton>);
    
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-primary');
    expect(button.className).toContain('text-primary-foreground');
  });

  it('passes through button props', () => {
    const onClick = vi.fn();
    render(
      <GradientButton
        onClick={onClick}
        disabled
        variant="secondary"
        size="lg"
      >
        Test button
      </GradientButton>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    // Variant prop should override default primary styles
    expect(button.className).not.toContain('bg-primary');
  });

  it('wraps children in relative span for z-index', () => {
    const { container } = render(
      <GradientButton>
        <span data-testid="icon">🚀</span>
        Launch
      </GradientButton>
    );
    
    const contentSpan = container.querySelector('.relative.z-10');
    expect(contentSpan).toBeInTheDocument();
    expect(contentSpan).toContainElement(screen.getByTestId('icon'));
  });

  it('maintains proper structure for accessibility', () => {
    const { container } = render(
      <GradientButton>Accessible button</GradientButton>
    );
    
    const button = screen.getByRole('button');
    const overlay = container.querySelector('[aria-hidden="true"]');
    
    expect(overlay).toBeInTheDocument(); // Overlay is aria-hidden
    expect(button).toHaveAccessibleName('Accessible button');
  });
});