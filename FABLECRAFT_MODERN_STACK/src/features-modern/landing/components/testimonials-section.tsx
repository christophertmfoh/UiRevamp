import { memo } from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * TESTIMONIALS SECTION
 * Migrated from client build with enhancements:
 * - TypeScript interfaces
 * - Theme system integration
 * - Responsive design improvements
 * - Accessibility enhancements
 * - Component optimization
 */

interface Testimonial {
  id: string;
  name: string;
  role: string;
  initials: string;
  rating: number;
  content: string;
}

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
  className?: string;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 'testimonial-1',
    name: 'Sarah Chen',
    role: 'Fantasy Novelist',
    initials: 'SL',
    rating: 5,
    content:
      'FableCraft transformed how I develop characters. The AI understands nuance in ways I never expected, and the 164+ fields capture every detail that matters to my stories.',
  },
  {
    id: 'testimonial-2',
    name: 'Marcus Rivera',
    role: 'Screenwriter',
    initials: 'MR',
    rating: 5,
    content:
      'Finally, a platform that gets the creative process. The world bible feature keeps all my storylines consistent, and the collaboration tools let my writing partner contribute seamlessly.',
  },
  {
    id: 'testimonial-3',
    name: 'Alex Thompson',
    role: 'Graphic Novelist',
    initials: 'AT',
    rating: 5,
    content:
      "The visual storytelling features are incredible. I can generate consistent character art and storyboards that perfectly match my written descriptions. It's like having a whole creative team.",
  },
];

/**
 * Individual Testimonial Card Component
 */
const TestimonialCard = memo(
  ({ testimonial }: { testimonial: Testimonial }) => (
    <Card className='group surface-elevated backdrop-blur-lg border-border hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer overflow-hidden relative'>
      <div
        className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700'
        style={{
          background:
            'linear-gradient(135deg, hsl(var(--orb-primary) / 0.05) 0%, hsl(var(--orb-secondary) / 0.03) 50%, hsl(var(--orb-primary) / 0.02) 100%)',
        }}
      />

      <CardContent className='relative z-10 p-8 space-y-6'>
        <div className='flex space-x-1 mb-4'>
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className='w-5 h-5 fill-primary text-primary' />
          ))}
        </div>
        <p className='text-foreground italic leading-relaxed'>
          {testimonial.content}
        </p>
        <div className='flex items-center space-x-3'>
          <div className='w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center'>
            <span className='text-primary-foreground font-bold text-sm'>
              {testimonial.initials}
            </span>
          </div>
          <div>
            <div className='font-semibold text-foreground'>
              {testimonial.name}
            </div>
            <div className='text-sm text-muted-foreground'>
              {testimonial.role}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
);

TestimonialCard.displayName = 'TestimonialCard';

/**
 * Main Testimonials Section Component
 */
export const TestimonialsSection = memo(
  ({
    testimonials = DEFAULT_TESTIMONIALS,
    className = '',
  }: TestimonialsSectionProps) => {
    return (
      <section
        className={`relative z-10 max-w-7xl mx-auto px-8 py-24 ${className}`}
      >
        <div className='text-center space-y-16'>
          <div className='space-y-6'>
            <Badge className='bg-card/95 text-foreground border-border font-bold backdrop-blur-md shadow-md'>
              Trusted by Professional Writers
            </Badge>
            <h2 className='text-4xl md:text-5xl font-black text-heading-primary drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)] leading-[1.2] tracking-tight'>
              What Our Users Are Saying
            </h2>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            {testimonials.map(testimonial => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>
    );
  }
);

TestimonialsSection.displayName = 'TestimonialsSection';
