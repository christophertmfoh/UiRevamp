import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from '../components/ui/button';
import { EnhancedCard, FloatingCard } from '../components/ui/enhanced-card';

describe('Enhanced Components Integration', () => {
  it('renders enhanced card with all variants', () => {
    const { container } = render(
      <>
        <EnhancedCard variant="default">Default Card</EnhancedCard>
        <EnhancedCard variant="glass">Glass Card</EnhancedCard>
        <EnhancedCard variant="gradient">Gradient Card</EnhancedCard>
        <EnhancedCard variant="glow">Glow Card</EnhancedCard>
      </>
    );
    
    expect(container.querySelectorAll('.glass-card')).toHaveLength(1);
    expect(container.textContent).toContain('Default Card');
    expect(container.textContent).toContain('Glass Card');
    expect(container.textContent).toContain('Gradient Card');
    expect(container.textContent).toContain('Glow Card');
  });

  it('renders buttons with new premium variants', () => {
    render(
      <>
        <Button variant="gradient">Gradient Button</Button>
        <Button variant="glow">Glow Button</Button>
        <Button variant="glass">Glass Button</Button>
        <Button variant="premium">Premium Button</Button>
      </>
    );
    
    expect(screen.getByText('Gradient Button')).toBeInTheDocument();
    expect(screen.getByText('Glow Button')).toBeInTheDocument();
    expect(screen.getByText('Glass Button')).toBeInTheDocument();
    expect(screen.getByText('Premium Button')).toBeInTheDocument();
  });

  it('button loading state works correctly', () => {
    const { rerender } = render(
      <Button loading={false}>Click Me</Button>
    );
    
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
    expect(screen.getByText('Click Me')).toBeInTheDocument();
    
    rerender(<Button loading={true}>Click Me</Button>);
    expect(button).toBeDisabled();
    expect(button).toHaveClass('cursor-wait opacity-70');
  });

  it('enhanced card hover effects work', () => {
    const { container } = render(
      <EnhancedCard hover="lift" className="test-card">
        Hover Card
      </EnhancedCard>
    );
    
    const card = container.querySelector('.test-card');
    expect(card).toHaveClass('hover-lift');
  });

  it('floating card has correct classes', () => {
    const { container } = render(
      <FloatingCard>Floating Content</FloatingCard>
    );
    
    const card = container.firstChild;
    expect(card).toHaveClass('glass-card');
    expect(card).toHaveClass('animate-float');
  });

  it('button animation prop works', () => {
    render(
      <>
        <Button animation="subtle" data-testid="subtle">Subtle</Button>
        <Button animation="bounce" data-testid="bounce">Bounce</Button>
        <Button animation="pulse" data-testid="pulse">Pulse</Button>
      </>
    );
    
    expect(screen.getByTestId('subtle')).toHaveClass('hover:scale-105');
    expect(screen.getByTestId('bounce')).toHaveClass('hover:animate-bounce');
    expect(screen.getByTestId('pulse')).toHaveClass('animate-pulse');
  });
});