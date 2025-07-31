import { memo } from 'react';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/**
 * PRICING SECTION
 * Migrated from client build with enhancements:
 * - TypeScript interfaces
 * - Theme system integration
 * - Responsive design improvements
 * - Accessibility enhancements
 * - Component optimization
 */

interface PricingFeature {
  id: string;
  text: string;
  included: boolean;
}

interface PricingTier {
  id: string;
  name: string;
  price: string;
  period?: string;
  description: string;
  features: PricingFeature[];
  isPopular?: boolean;
  ctaText: string;
}

interface PricingSectionProps {
  tiers?: PricingTier[];
  className?: string;
  onSelectPlan?: (tierId: string) => void;
  isAuthenticated?: boolean;
  onAuth?: () => void;
  onNavigate?: (view: string) => void;
}

const DEFAULT_PRICING_TIERS: PricingTier[] = [
  {
    id: 'storyteller',
    name: 'Storyteller',
    price: 'Free',
    description: 'Perfect for getting started',
    ctaText: 'Get Started Free',
    features: [
      { id: 'projects-3', text: '3 Projects', included: true },
      {
        id: 'character-gen',
        text: 'Character Generation (164+ fields)',
        included: true,
      },
      { id: 'world-bible', text: 'World Bible', included: true },
      { id: 'ai-story', text: 'AI Story Assistance', included: true },
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$19',
    period: '/month',
    description: 'For serious storytellers',
    isPopular: true,
    ctaText: 'Start Professional Trial',
    features: [
      { id: 'projects-unlimited', text: 'Unlimited Projects', included: true },
      { id: 'advanced-ai', text: 'Advanced Character AI', included: true },
      { id: 'collaboration', text: 'Real-time Collaboration', included: true },
      { id: 'export-tools', text: 'Export & Publishing Tools', included: true },
      { id: 'priority-support', text: 'Priority Support', included: true },
    ],
  },
];

/**
 * Individual Pricing Card Component
 */
const PricingCard = memo(
  ({
    tier,
    onSelectPlan,
    isAuthenticated,
    onAuth,
    onNavigate,
  }: {
    tier: PricingTier;
    onSelectPlan?: (tierId: string) => void;
    isAuthenticated?: boolean;
    onAuth?: () => void;
    onNavigate?: (view: string) => void;
  }) => {
    const handleCTAClick = () => {
      if (onSelectPlan) {
        onSelectPlan(tier.id);
      } else if (isAuthenticated && onNavigate) {
        onNavigate('projects');
      } else if (onAuth) {
        onAuth();
      }
    };

    return (
      <Card
        className={`group surface-elevated backdrop-blur-lg border-border hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer overflow-hidden relative ${tier.isPopular ? 'border-primary' : ''}`}
      >
        <div
          className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700'
          style={{
            background:
              'linear-gradient(135deg, hsl(var(--orb-primary) / 0.05) 0%, hsl(var(--orb-secondary) / 0.03) 50%, hsl(var(--orb-primary) / 0.02) 100%)',
          }}
        />

        {tier.isPopular && (
          <div className='absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 rounded-bl-lg text-sm font-semibold'>
            Most Popular
          </div>
        )}

        <CardContent className='relative z-10 p-8 space-y-6'>
          <div className='space-y-4'>
            <h3 className='text-2xl font-bold text-heading-primary'>
              {tier.name}
            </h3>
            <div className='space-y-2'>
              <div className='text-4xl font-bold text-heading-primary'>
                {tier.price}
                {tier.period && (
                  <span className='text-lg text-muted-foreground'>
                    {tier.period}
                  </span>
                )}
              </div>
              <p className='text-muted-foreground'>{tier.description}</p>
            </div>
          </div>

          <div className='space-y-3 text-left'>
            {tier.features.map(feature => (
              <div key={feature.id} className='flex items-center space-x-3'>
                <CheckCircle className='w-5 h-5 text-primary flex-shrink-0' />
                <span className='text-foreground'>{feature.text}</span>
              </div>
            ))}
          </div>

          <Button
            onClick={handleCTAClick}
            className='w-full btn-enhanced gradient-primary text-primary-foreground px-6 py-3 text-lg font-semibold shadow-xl hover:shadow-2xl rounded-2xl focus-ring'
          >
            {tier.ctaText}
          </Button>
        </CardContent>
      </Card>
    );
  }
);

PricingCard.displayName = 'PricingCard';

/**
 * Main Pricing Section Component
 */
export const PricingSection = memo(
  ({
    tiers = DEFAULT_PRICING_TIERS,
    className = '',
    onSelectPlan,
    isAuthenticated = false,
    onAuth,
    onNavigate,
  }: PricingSectionProps) => {
    return (
      <section
        className={`relative z-10 max-w-7xl mx-auto px-8 py-24 ${className}`}
      >
        <div className='text-center space-y-16'>
          <div className='space-y-6'>
            <Badge className='bg-card/95 text-foreground border-border font-bold backdrop-blur-md shadow-md'>
              Simple, Transparent Pricing
            </Badge>
            <h2 className='text-4xl md:text-5xl font-black text-heading-primary drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)] leading-[1.2] tracking-tight'>
              Start Free, Scale with Your Stories
            </h2>
            <p className='text-xl text-foreground max-w-3xl mx-auto font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] leading-[1.75] tracking-normal'>
              Whether you're writing your first novel or managing an entire
              creative universe, we have a plan that grows with your ambition.
            </p>
          </div>

          <div className='grid md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
            {tiers.map(tier => (
              <PricingCard
                key={tier.id}
                tier={tier}
                onSelectPlan={onSelectPlan}
                isAuthenticated={isAuthenticated}
                onAuth={onAuth}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }
);

PricingSection.displayName = 'PricingSection';
