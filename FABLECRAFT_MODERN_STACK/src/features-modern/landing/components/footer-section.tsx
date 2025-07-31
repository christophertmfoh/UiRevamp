import { memo } from 'react';
import { Feather } from 'lucide-react';

/**
 * FOOTER SECTION
 * Migrated from client build with enhancements:
 * - TypeScript interfaces
 * - Theme system integration
 * - Responsive design improvements
 * - Accessibility enhancements
 * - Component optimization
 */

interface FooterSectionProps {
  className?: string;
  showBranding?: boolean;
  tagline?: string;
  subtitle?: string;
}

/**
 * Main Footer Section Component
 */
export const FooterSection = memo(
  ({
    className = '',
    showBranding = true,
    tagline = 'Where every story finds its voice',
    subtitle = 'Made with',
  }: FooterSectionProps) => {
    return (
      <footer
        className={`relative z-10 section-spacing-compact px-8 bg-gradient-to-t from-muted/30 to-transparent ${className}`}
      >
        <div className='max-w-7xl mx-auto text-center'>
          {showBranding && (
            <div className='flex items-center justify-center gap-4 group cursor-pointer'>
              <div className='w-14 h-14 gradient-primary-br rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500'>
                <Feather className='w-7 h-7 text-primary-foreground group-hover:scale-110 transition-transform duration-300' />
              </div>
              <span className='text-3xl font-bold gradient-primary-text group-hover:text-primary transition-all duration-300'>
                Fablecraft
              </span>
            </div>
          )}

          {/* Tagline with Mathematical Spacing */}
          <p className='text-xl text-foreground/80 font-medium mt-best-friends'>{tagline}</p>

          {/* Made with Love Line with Mathematical Spacing */}
          <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground mt-friends'>
            <span>{subtitle}</span>
            <div
              className='w-4 h-4 rounded-full animate-pulse'
              style={{
                background:
                  'linear-gradient(to right, hsl(var(--orb-primary)), hsl(var(--orb-secondary)))',
              }}
            />
            <span>for storytellers everywhere</span>
          </div>
        </div>
      </footer>
    );
  }
);

FooterSection.displayName = 'FooterSection';
