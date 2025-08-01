import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { GlassCard } from './glass-card';

describe('GlassCard', () => {
  it('renders with default light variant', () => {
    const { container } = render(<GlassCard>Test Content</GlassCard>);
    
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('bg-card/95');
    expect(card.className).toContain('backdrop-blur-md');
  });

  it('renders with heavy variant', () => {
    const { container } = render(<GlassCard variant="heavy">Heavy Content</GlassCard>);
    
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('bg-card/90');
    expect(card.className).toContain('backdrop-blur-lg');
  });

  it('renders with elevated variant', () => {
    const { container } = render(<GlassCard variant="elevated">Elevated Content</GlassCard>);
    
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('surface-elevated');
    expect(card.className).toContain('backdrop-blur-lg');
  });

  it('applies hover effect when hover prop is true', () => {
    const { container } = render(<GlassCard hover>Hover Card</GlassCard>);
    
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('hover:scale-[1.02]');
  });

  it('applies custom className', () => {
    const { container } = render(<GlassCard className="custom-class">Custom Card</GlassCard>);
    
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('custom-class');
  });

  it('passes through HTML attributes', () => {
    render(
      <GlassCard data-testid="glass-card" aria-label="Test Card">
        Test
      </GlassCard>
    );
    
    const card = screen.getByTestId('glass-card');
    expect(card).toHaveAttribute('aria-label', 'Test Card');
  });

  it('renders children correctly', () => {
    render(
      <GlassCard>
        <h2>Title</h2>
        <p>Description</p>
      </GlassCard>
    );
    
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });
});