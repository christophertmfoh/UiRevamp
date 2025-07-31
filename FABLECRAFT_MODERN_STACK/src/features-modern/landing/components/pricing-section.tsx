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

/**
 * Default pricing tiers with 4-tier structure
 */
const defaultPricingTiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 'Free',
    period: '',
    description: 'Get started with limited features',
    isPopular: false,
    ctaText: 'Start Free',
    features: [
      { id: 'projects-3', text: '3 Free Projects', included: true },
      { id: 'ai-credits-limited', text: 'Limited Free AI Credits/Month', included: true },
      { id: 'basic-features', text: 'All Basic Features', included: true },
      { id: 'community-access', text: 'Community Access & Sharing', included: true },
      { id: 'standard-export', text: 'Standard Export & Sharing', included: true },
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '$15',
    period: '/month',
    description: 'Perfect for serious creators',
    isPopular: false,
    ctaText: 'Choose Starter',
    features: [
      { id: 'projects-unlimited', text: 'Unlimited Projects', included: true },
      { id: 'ai-credits-standard', text: 'Standard AI Credits/Month', included: true },
      { id: 'advanced-features', text: 'Advanced Creative Features', included: true },
      { id: 'basic-collaboration', text: 'Basic Collaboration Tools', included: true },
      { id: 'enhanced-export', text: 'Enhanced Export Options', included: true },
      { id: 'project-templates', text: 'Professional Project Templates', included: true },
    ],
  },
  {
    id: 'professional',
    name: 'Creative Studio',
    price: '$29',
    period: '/month',
    description: 'Complete multimedia production powerhouse',
    isPopular: true,
    ctaText: 'Unleash Full Power',
    features: [
      { id: 'projects-unlimited', text: 'Unlimited Multimedia Projects', included: true },
      { id: 'ai-credits-premium', text: 'Premium AI Credits/Month', included: true },
      { id: 'video-generation', text: 'Pre-vis & Video Generation', included: true },
      { id: 'audio-suite', text: 'Full Audio Production Suite & DAW', included: true },
      { id: 'priority-support', text: 'Priority Support & Beta Access', included: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Contact for Pricing',
    period: '',
    description: 'Custom solutions for teams and organizations',
    isPopular: false,
    ctaText: 'Contact Sales',
    features: [
      { id: 'everything-included', text: 'Everything in Creative Studio', included: true },
      { id: 'unlimited-credits', text: 'Unlimited AI Credits', included: true },
      { id: 'custom-integrations', text: 'Custom Integrations & API Access', included: true },
      { id: 'dedicated-support', text: 'Dedicated Account Manager', included: true },
      { id: 'sso-security', text: 'SSO & Advanced Security', included: true },
      { id: 'custom-training', text: 'Custom Training & Onboarding', included: true },
      { id: 'sla-guarantee', text: 'SLA Guarantee', included: true },
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
        className={`group surface-elevated backdrop-blur-lg border-border hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer overflow-hidden relative flex-1 min-w-[280px] ${tier.isPopular ? 'border-primary' : ''}`}
      >
        <div
          className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700'
          style={{
            background:
              'linear-gradient(135deg, hsl(var(--orb-primary) / 0.05) 0%, hsl(var(--orb-secondary) / 0.03) 50%, hsl(var(--orb-primary) / 0.02) 100%)',
          }}
        />

        {tier.isPopular && (
          <div className='absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-sm font-semibold z-20'>
            Most Popular
          </div>
        )}

        <CardContent className={`relative z-10 p-6 ${tier.isPopular ? 'pt-12' : ''}`}>
          {/* Plan Name */}
          <h3 className='text-2xl font-bold text-heading-primary'>
            {tier.name}
          </h3>
          
          {/* Price and Period */}
          <div className='mt-best-friends'>
            <div className='text-4xl font-bold text-heading-primary'>
              {tier.price}
              {tier.period && (
                <span className='text-lg text-muted-foreground'>
                  {tier.period}
                </span>
              )}
            </div>
            <p className='text-muted-foreground mt-best-friends'>{tier.description}</p>
          </div>

          {/* Features List */}
          <div className='text-left mt-friends'>
            {tier.features.map((feature, index) => (
              <div key={feature.id} className={`flex items-center gap-3 ${index > 0 ? 'mt-2' : ''}`}>
                <CheckCircle className='w-5 h-5 text-primary flex-shrink-0' />
                <span className='text-foreground'>{feature.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleCTAClick}
            className='w-full btn-enhanced gradient-primary text-primary-foreground px-6 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl rounded-2xl focus-ring mt-acquaintances'
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
    tiers = defaultPricingTiers,
    className = '',
    onSelectPlan,
    isAuthenticated = false,
    onAuth,
    onNavigate,
  }: PricingSectionProps) => {
    return (
      <section
        className={`relative z-10 max-w-7xl mx-auto px-8 section-spacing-compact ${className}`}
      >
        <div className='text-center'>
          {/* Header Section with Mathematical Spacing */}
          <div className='flex flex-col items-center'>
            {/* Badge with Pulsing Dot */}
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 rounded-full animate-pulse bg-primary" />
              <Badge className='bg-card/95 text-foreground border-border font-bold backdrop-blur-md shadow-md text-base px-4 py-2'>
                Simple, Transparent Pricing
              </Badge>
            </div>
            
            <h2 className='text-4xl md:text-5xl font-black text-heading-primary drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)] leading-[1.2] tracking-tight mt-best-friends'>
              Start Free, Scale with Your Stories
            </h2>
            
            <p className='text-xl text-foreground max-w-3xl mx-auto font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] leading-[1.75] tracking-normal mt-friends'>
              Whether you're writing your first novel or managing an entire
              creative universe, we have a plan that grows with your ambition.
            </p>
          </div>

          {/* Pricing Cards in Straight Line */}
          <div className='flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto mt-acquaintances overflow-x-auto lg:overflow-visible'>
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
