import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme'
import { FloatingOrbs } from '@/components/effects/floating-orbs'
import { CTASection } from './CTASection'
import { FeatureCards } from './FeatureCards'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Feather,
  BookOpen,
  Compass,
  Palette,
  Lightbulb,
  Library,
  PenTool,
  User,
  Settings,
  LogOut,
  UserCircle,
  LucideIcon,
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface LandingPageProps {
  onNavigate: (view: 'auth' | 'projects' | 'dashboard') => void
  onNewProject: () => void
  onAuth: () => void
  onLogout: () => Promise<void>
  user?: User | null
  isAuthenticated: boolean
}

const processSteps = [
  {
    icon: Lightbulb,
    title: 'Ideation',
    description: 'From spark to story seed',
    detail: 'Transform fleeting inspiration into rich narrative foundations with AI guidance',
  },
  {
    icon: Library,
    title: 'World Crafting',
    description: 'Build living story universes',
    detail: 'Characters, places, cultures - all interconnected in your digital story bible',
  },
  {
    icon: BookOpen,
    title: 'Manuscript Import',
    description: 'Breathe life into existing work',
    detail: 'Upload character sheets and documents - AI extracts deep story insights',
  },
  {
    icon: Compass,
    title: 'Story Architecture',
    description: 'Blueprint your narrative',
    detail: 'AI-assisted plotting that weaves through your carefully crafted world',
  },
  {
    icon: PenTool,
    title: 'Contextual Writing',
    description: 'Write within living worlds',
    detail:
      'Every word informed by your story bible - characters, places, history at your fingertips',
  },
  {
    icon: Palette,
    title: 'Visual Storytelling',
    description: 'Pictures worth a thousand words',
    detail: 'Generate consistent artwork, storyboards, and multimedia from your narrative',
  },
]

export function LandingPage({
  onNavigate,
  onNewProject,
  onAuth,
  onLogout,
  user,
  isAuthenticated,
}: LandingPageProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background" ref={scrollContainerRef}>
      {/* Floating orbs background */}
      <FloatingOrbs />

      {/* Navigation */}
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? 'bg-background/80 shadow-lg backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
                <Feather className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-xl font-bold text-transparent">
                FableCraft
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden items-center space-x-8 md:flex">
              <a
                href="#features"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                How It Works
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Pricing
              </a>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />

              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <UserCircle className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onNavigate('dashboard')}>
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate('projects')}>
                      <Library className="mr-2 h-4 w-4" />
                      Projects
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={onAuth} className="bg-gradient-to-r from-primary to-primary/90">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Value Proposition */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-5xl space-y-8 text-center lg:space-y-12">
          {/* Business Badge */}
          <div className="inline-flex items-center space-x-3 rounded-full border border-border bg-card/90 px-4 py-2 shadow-md backdrop-blur-sm">
            <div className="h-2 w-2 animate-pulse rounded-full bg-primary"></div>
            <span className="text-sm font-bold uppercase leading-tight tracking-[0.15em] text-foreground">
              Professional Creative Writing Platform
            </span>
          </div>

          {/* Main Value Proposition */}
          <h1 className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-4xl font-black leading-[1.1] tracking-tight text-transparent drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] sm:text-5xl lg:text-6xl xl:text-7xl">
            Replace 15+ Tools with{' '}
            <span className="bg-gradient-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
              One Platform
            </span>
          </h1>

          {/* Business Benefit Statement */}
          <p className="mx-auto max-w-3xl text-lg font-medium leading-[1.7] text-foreground drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] sm:text-xl">
            Professional writers choose FableCraft to streamline their entire creative workflow.
            From character development to final manuscripts - everything you need in one intelligent
            platform.
          </p>

          {/* Primary Call to Action */}
          <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row sm:gap-6 sm:pt-6">
            <Button
              size="lg"
              onClick={onNewProject}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/90 px-10 py-5 text-lg font-semibold text-primary-foreground shadow-xl transition-all duration-500 hover:-translate-y-1 hover:scale-110 hover:shadow-2xl hover:brightness-110"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <span className="relative z-10 flex items-center">
                <PenTool className="mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                Start Free Trial
              </span>
            </Button>
            <Button
              size="lg"
              onClick={() => onNavigate('projects')}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/90 px-10 py-5 text-lg font-semibold text-primary-foreground shadow-xl transition-all duration-500 hover:-translate-y-1 hover:scale-110 hover:shadow-2xl hover:brightness-110"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <span className="relative z-10 flex items-center">
                <Library className="mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                View Demo
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works - Process */}
      <section id="how-it-works" className="relative z-10 mx-auto max-w-7xl px-8 py-24">
        <div className="space-y-16 text-center">
          <div className="space-y-6">
            <Badge className="border-border bg-card/95 font-bold text-foreground shadow-md backdrop-blur-md">
              How It Works
            </Badge>
            <h2 className="text-4xl font-black leading-[1.2] tracking-tight text-foreground drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)] md:text-5xl">
              Your Complete Writing Workflow
            </h2>
            <p className="mx-auto max-w-3xl text-xl font-medium leading-[1.75] tracking-normal text-foreground drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
              Follow our proven 6-step process used by professional writers worldwide. Each stage
              builds seamlessly into the next, ensuring your creative vision stays consistent from
              start to finish.
            </p>
          </div>

          {/* Process Flow */}
          <div className="relative">
            {/* Connection line */}
            <div className="absolute left-0 right-0 top-16 hidden h-1 rounded-full bg-gradient-to-r from-primary via-primary/50 to-primary lg:block"></div>

            <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
              {processSteps.map((step, index) => {
                const IconComponent = step.icon as LucideIcon
                return (
                  <div key={index} className="group relative space-y-4 text-center">
                    <div className="relative z-10 mx-auto flex h-28 w-28 cursor-pointer items-center justify-center rounded-3xl border border-border bg-card/90 shadow-lg backdrop-blur-sm transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-3 group-hover:scale-110 group-hover:shadow-2xl">
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl">
                        <IconComponent className="h-8 w-8 text-primary-foreground transition-transform duration-300 group-hover:scale-110" />
                      </div>
                    </div>

                    <div className="space-y-3 transition-transform duration-300 group-hover:-translate-y-1">
                      <h4 className="text-lg font-black leading-[1.3] tracking-tight text-foreground drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-colors duration-300 group-hover:text-primary">
                        {step.title}
                      </h4>
                      <p className="text-sm font-medium leading-[1.6] tracking-normal text-foreground/70 transition-colors duration-300 group-hover:text-foreground">
                        {step.description}
                      </p>
                      <p className="translate-y-2 transform text-xs font-semibold leading-[1.5] tracking-wide text-muted-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <FeatureCards />

      {/* CTA Section */}
      <CTASection onNewProject={onNewProject} onNavigateToProjects={() => onNavigate('projects')} />
    </div>
  )
}
