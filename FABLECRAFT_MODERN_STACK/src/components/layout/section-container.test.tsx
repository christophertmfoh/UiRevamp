import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { SectionContainer, SectionContent } from './section-container';

describe('SectionContainer', () => {
  it('renders as section element by default', () => {
    const { container } = render(
      <SectionContainer>Test Content</SectionContainer>
    );
    
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveTextContent('Test Content');
  });

  it('renders with default spacing class', () => {
    const { container } = render(
      <SectionContainer>Content</SectionContainer>
    );
    
    const section = container.querySelector('section');
    expect(section?.className).toContain('section-spacing');
  });

  it('applies hero spacing variant', () => {
    const { container } = render(
      <SectionContainer spacing="hero">Hero Content</SectionContainer>
    );
    
    const section = container.querySelector('section');
    expect(section?.className).toContain('section-spacing-hero');
    expect(section?.className).not.toContain('section-spacing-compact');
  });

  it('applies compact spacing variant', () => {
    const { container } = render(
      <SectionContainer spacing="compact">Compact Content</SectionContainer>
    );
    
    const section = container.querySelector('section');
    expect(section?.className).toContain('section-spacing-compact');
  });

  it('applies width variants', () => {
    const { container: narrow } = render(
      <SectionContainer width="narrow">Narrow</SectionContainer>
    );
    expect(narrow.querySelector('section')?.className).toContain('max-w-5xl');

    const { container: wide } = render(
      <SectionContainer width="wide">Wide</SectionContainer>
    );
    expect(wide.querySelector('section')?.className).toContain('max-w-screen-2xl');
  });

  it('applies padding variants', () => {
    const { container: loose } = render(
      <SectionContainer padding="loose">Loose</SectionContainer>
    );
    expect(loose.querySelector('section')?.className).toContain('px-6');

    const { container: tight } = render(
      <SectionContainer padding="tight">Tight</SectionContainer>
    );
    expect(tight.querySelector('section')?.className).toContain('px-4');
  });

  it('renders as different element when specified', () => {
    const { container } = render(
      <SectionContainer as="article">Article Content</SectionContainer>
    );
    
    const article = container.querySelector('article');
    expect(article).toBeInTheDocument();
    expect(container.querySelector('section')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <SectionContainer className="custom-class">Content</SectionContainer>
    );
    
    const section = container.querySelector('section');
    expect(section?.className).toContain('custom-class');
  });

  it('maintains standard classes with custom className', () => {
    const { container } = render(
      <SectionContainer className="bg-red-500">Content</SectionContainer>
    );
    
    const section = container.querySelector('section');
    expect(section?.className).toContain('relative');
    expect(section?.className).toContain('z-10');
    expect(section?.className).toContain('mx-auto');
    expect(section?.className).toContain('bg-red-500');
  });
});

describe('SectionContent', () => {
  it('renders with center alignment by default', () => {
    const { container } = render(<SectionContent>Test Content</SectionContent>);
    
    const content = container.firstChild as HTMLElement;
    expect(content?.className).toContain('text-center');
  });

  it('applies alignment classes', () => {
    const { container, rerender } = render(
      <SectionContent align="left">Left</SectionContent>
    );
    let content = container.firstChild as HTMLElement;
    expect(content?.className).toContain('text-left');

    rerender(<SectionContent align="right">Right</SectionContent>);
    content = container.firstChild as HTMLElement;
    expect(content?.className).toContain('text-right');
  });

  it('applies spacing classes', () => {
    const { container: tight } = render(
      <SectionContent spacing="tight">Tight</SectionContent>
    );
    expect(tight.firstChild?.className).toContain('space-y-8');

    const { container: loose } = render(
      <SectionContent spacing="loose">Loose</SectionContent>
    );
    expect(loose.firstChild?.className).toContain('space-y-16');
  });

  it('applies maxWidth style', () => {
    const { container } = render(
      <SectionContent maxWidth="800px">Limited Width</SectionContent>
    );
    
    const content = container.firstChild as HTMLElement;
    expect(content).toHaveStyle({ maxWidth: '800px' });
    expect(content?.className).toContain('mx-auto');
  });

  it('combines multiple props correctly', () => {
    const { container } = render(
      <SectionContent 
        align="left" 
        spacing="tight" 
        maxWidth="600px"
        className="custom-content"
      >
        Combined Props
      </SectionContent>
    );
    
    const content = container.firstChild as HTMLElement;
    expect(content?.className).toContain('text-left');
    expect(content?.className).toContain('space-y-8');
    expect(content?.className).toContain('custom-content');
    expect(content).toHaveStyle({ maxWidth: '600px' });
  });
});