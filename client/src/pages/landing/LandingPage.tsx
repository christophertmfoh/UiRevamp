import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Users, Zap, Globe, BookOpen, Sparkles, ArrowRight, Star } from 'lucide-react';
import { Link } from 'wouter';

const features = [
  {
    icon: Users,
    title: "AI Character Generation",
    description: "Create rich, detailed characters with 164+ customizable fields powered by advanced AI",
    image: "/api/placeholder/400/300"
  },
  {
    icon: Globe,
    title: "World Bible Management", 
    description: "Build complex, interconnected worlds with timeline and relationship tracking",
    image: "/api/placeholder/400/300"
  },
  {
    icon: Zap,
    title: "Real-time Collaboration",
    description: "Work with team members in real-time with live editing and instant feedback",
    image: "/api/placeholder/400/300"
  },
  {
    icon: BookOpen,
    title: "Multi-Format Projects",
    description: "Support for novels, screenplays, comics, D&D campaigns, and poetry",
    image: "/api/placeholder/400/300"
  }
];

const pricingPlans = [
  {
    name: "Creator",
    price: "$0",
    period: "forever",
    description: "Perfect for individual writers getting started",
    features: [
      "3 Projects",
      "Basic AI Character Generation",
      "World Bible Tools", 
      "Community Support",
      "Export Options"
    ],
    cta: "Get Started Free",
    popular: false
  },
  {
    name: "Professional",
    price: "$19",
    period: "month",
    description: "For serious writers and creative teams",
    features: [
      "Unlimited Projects",
      "Advanced AI Generation",
      "Real-time Collaboration",
      "Priority Support",
      "Team Management",
      "Advanced Analytics",
      "API Access"
    ],
    cta: "Start Free Trial",
    popular: true
  }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Fantasy Novelist",
    content: "FableCraft transformed how I develop characters. The AI suggestions are incredibly nuanced and help me discover aspects of my characters I never would have considered.",
    avatar: "/api/placeholder/64/64",
    rating: 5
  },
  {
    name: "Marcus Rodriguez", 
    role: "Screenwriter",
    content: "The world-building tools are phenomenal. I can track complex relationships and timelines across multiple projects seamlessly.",
    avatar: "/api/placeholder/64/64", 
    rating: 5
  },
  {
    name: "Emily Watson",
    role: "D&D Campaign Creator",
    content: "Real-time collaboration with my co-DMs has made campaign planning so much more efficient. We can all contribute to character and world development simultaneously.",
    avatar: "/api/placeholder/64/64",
    rating: 5
  }
];

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 sm:py-32">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-200">
            <Sparkles className="w-4 h-4 mr-2" />
            Powered by Advanced AI
          </Badge>
          
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            The Future of{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Creative Writing
            </span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            AI-powered creative development platform for writers, storytellers, and creative teams. 
            Build rich characters, expansive worlds, and compelling narratives with intelligent assistance.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/auth">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                Start Writing Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-3">
              Watch Demo
            </Button>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Free to start
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              164+ character fields
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to bring stories to life
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            From character development to world building, FableCraft provides the tools 
            and AI assistance to enhance every aspect of your creative process.
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-2">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                  <Icon className="h-16 w-16 text-blue-600" />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-blue-600" />
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Choose your creative journey
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Start free and upgrade when you're ready to unlock the full power of AI-assisted writing.
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-blue-600 shadow-lg scale-105' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
                <p className="mt-2 text-gray-600">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href="/auth">
                  <Button 
                    className={`w-full ${plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by creative professionals
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            See how writers and storytellers are transforming their creative process with FableCraft.
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <blockquote className="text-gray-700 mb-6">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4">FableCraft</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              The AI-powered creative development platform that transforms how writers, 
              storytellers, and creative teams bring their stories to life.
            </p>
            <div className="flex gap-4">
              <Link href="/auth">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 FableCraft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <FooterSection />
    </div>
  );
}