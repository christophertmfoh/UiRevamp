import { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Lightbulb, Zap, LucideIcon } from 'lucide-react'

const keyBenefits = [
  {
    icon: CheckCircle,
    title: 'World Bible Intelligence',
    description:
      'Create interconnected characters, locations, cultures, and factions with AI that understands your entire creative universe.',
  },
  {
    icon: Lightbulb,
    title: 'Contextual Story AI',
    description:
      'Get intelligent suggestions that respect your established lore, character arcs, and narrative consistency across all projects.',
  },
  {
    icon: Zap,
    title: 'Visual Production Ready',
    description:
      'From concept art to final graphics, transform your written stories into visual masterpieces with integrated design tools.',
  },
]

const trustIndicators = [
  { number: '500M+', label: 'Words Generated', icon: CheckCircle },
  { number: '50K+', label: 'Stories Created', icon: Lightbulb },
  { number: '99%', label: 'Uptime Guarantee', icon: Zap },
  { number: '100%', label: 'Workflow Integration', icon: CheckCircle },
]

interface FeatureCardsProps {
  className?: string
}

export const FeatureCards = memo(function FeatureCards({ className = '' }: FeatureCardsProps) {
  return (
    <section className={`relative z-10 mx-auto max-w-7xl px-8 py-24 ${className}`}>
      <div className="space-y-16 text-center">
        <div className="space-y-6">
          <Badge className="border-border bg-card/95 font-bold text-foreground shadow-md backdrop-blur-md">
            Revolutionary Creative Technology
          </Badge>
          <h2 className="text-4xl font-black leading-[1.2] tracking-tight text-foreground drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)] md:text-5xl">
            The Creative Industry's First True End-to-End Suite
          </h2>
          <p className="mx-auto max-w-3xl text-xl font-medium leading-[1.75] tracking-normal text-foreground drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
            Break free from scattered tools. Fablecraft replaces 15+ applications with one
            intelligent platform that understands your entire creative process from world-building
            to visual production.
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="grid gap-8 md:grid-cols-4">
          {trustIndicators.map((indicator, index) => {
            const IconComponent = indicator.icon as LucideIcon
            return (
              <Card
                key={index}
                className="group relative cursor-pointer overflow-hidden border-border bg-card/80 backdrop-blur-lg transition-all duration-500 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl"
              >
                {/* Animated background gradient */}
                <div className="via-accent/3 to-primary/2 absolute inset-0 bg-gradient-to-br from-primary/5 opacity-0 transition-all duration-700 group-hover:opacity-100"></div>

                <CardContent className="relative z-10 space-y-6 p-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:shadow-xl">
                    <IconComponent className="h-8 w-8 text-primary-foreground transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <div className="space-y-2">
                    <div className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-4xl font-bold text-transparent transition-all duration-500 group-hover:from-primary group-hover:to-foreground">
                      {indicator.number}
                    </div>
                    <div className="font-semibold text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                      {indicator.label}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Key Benefits */}
        <div className="grid gap-8 pt-16 lg:grid-cols-3">
          {keyBenefits.map((benefit, index) => {
            const IconComponent = benefit.icon as LucideIcon
            return (
              <div
                key={index}
                className="group relative space-y-6 rounded-3xl border border-border/50 bg-card/50 p-8 transition-all duration-700 hover:bg-card/80 hover:shadow-2xl"
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-all duration-700 group-hover:opacity-100"></div>

                <div className="relative z-10 space-y-6">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary/80 shadow-xl transition-all duration-500 group-hover:rotate-3 group-hover:scale-110 group-hover:shadow-2xl">
                    <IconComponent className="h-10 w-10 text-primary-foreground transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                    {benefit.title}
                  </h3>
                  <p className="leading-relaxed text-foreground/70 transition-colors duration-300 group-hover:text-foreground">
                    {benefit.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
})
