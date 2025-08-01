import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Feather, 
  UserCircle, 
  ChevronDown, 
  BookOpen, 
  User, 
  Settings, 
  LogOut,
  FolderOpen,
  Target,
  Sparkles,
  CheckSquare,
} from 'lucide-react'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,

} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useIsAuthenticated, useUser, useAuthStore } from '../../auth/stores/auth-store'
import { cn } from '@/lib/utils'

/**
 * ADAPTIVE HEADER PROPS INTERFACE
 * Configuration options for the header component
 */
interface AdaptiveHeaderProps {
  className?: string
}

/**
 * PRE-LOGIN NAVIGATION COMPONENT
 * Navigation menu for unauthenticated users
 */
const PreLoginNavigation: React.FC = () => {
  const navigate = useNavigate()

  const navigationItems = [
    { label: 'COMMUNITY', path: '/community' },
    { label: 'GALLERY', path: '/gallery' },
    { label: 'LIBRARY', path: '/library' },
    { label: 'ABOUT', path: '/about' },
    { label: 'CONTACT', path: '/contact' },
  ]

  return (
    <>
      {/* Professional Navigation Menu */}
      <div className='hidden md:flex items-center space-x-8'>
        {navigationItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className='text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors duration-200 tracking-wide cursor-pointer uppercase'
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Auth Actions */}
      <div className='flex items-center'>
        <Button
          onClick={() => navigate('/auth')}
          className={cn(
            'bg-primary hover:bg-primary/90 text-primary-foreground',
            'px-6 py-2 font-semibold shadow-md hover:shadow-lg',
            'transition-all duration-300 hover:scale-105 rounded-xl'
          )}
        >
          Get Started
        </Button>
      </div>
    </>
  )
}

/**
 * POST-LOGIN NAVIGATION COMPONENT
 * Navigation menu for authenticated users with dashboard features
 */
const PostLoginNavigation: React.FC = () => {
  const navigate = useNavigate()
  const user = useUser()
  const { logout } = useAuthStore()

  const handleLogout = async () => {
    logout()
    navigate('/', { replace: true })
  }

  const dashboardItems = [
    { 
      icon: FolderOpen, 
      label: 'Your Projects', 
      description: 'Manage your writing projects',
      path: '/dashboard/projects' 
    },
    { 
      icon: Target, 
      label: 'Writing Goals', 
      description: 'Track your progress',
      path: '/dashboard/goals' 
    },
    { 
      icon: CheckSquare, 
      label: 'To-Do List', 
      description: 'Organize your tasks',
      path: '/dashboard/todos' 
    },
    { 
      icon: Sparkles, 
      label: 'AI Generations', 
      description: 'View AI-generated content',
      path: '/dashboard/ai' 
    },
  ]

  const accountItems = [
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ]

  return (
    <>
      {/* Compact Navigation for Mobile */}
      <div className='flex md:hidden'>
        <Button
          onClick={() => navigate('/dashboard')}
          variant="ghost"
          className='text-sm font-medium'
        >
          Dashboard
        </Button>
      </div>

      {/* User Dropdown Menu */}
      <div className='flex items-center space-x-4'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className={cn(
                'group bg-primary hover:bg-primary/90 text-primary-foreground',
                'px-4 py-2 font-semibold shadow-md hover:shadow-lg',
                'transition-all duration-300 hover:scale-105 rounded-xl'
              )}
              aria-label={`User menu for ${user?.name || user?.email || 'User'}`}
            >
              <span className='flex items-center'>
                <UserCircle className='mr-2 h-4 w-4' aria-hidden='true' />
                <span className='hidden sm:inline'>
                  Welcome {user?.name || user?.email?.split('@')[0] || 'User'}
                </span>
                <span className='sm:hidden'>Menu</span>
                <ChevronDown
                  className='ml-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-300'
                  aria-hidden='true'
                />
              </span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align='end'
            className='w-72 bg-card/95 backdrop-blur-xl border border-border shadow-xl rounded-xl mt-2'
          >
            {/* User Info Section */}
            <div className='p-3 border-b border-border/20'>
              <div className='text-sm font-medium text-card-foreground'>
                {user?.name || 'User'}
              </div>
              <div className='text-xs text-muted-foreground'>
                {user?.email || 'user@example.com'}
              </div>
            </div>

            {/* Dashboard Section */}
            <div className='p-2 border-b border-border/20'>
              <div className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2'>
                Dashboard
              </div>
              <DropdownMenuItem
                onClick={() => navigate('/dashboard')}
                className='cursor-pointer hover:bg-accent/10 py-3 px-3 rounded-lg transition-colors'
              >
                <BookOpen
                  className='mr-3 h-4 w-4 text-primary'
                  aria-hidden='true'
                />
                <div>
                  <div className='font-medium'>Overview</div>
                  <div className='text-xs text-muted-foreground'>
                    Your creative workspace
                  </div>
                </div>
              </DropdownMenuItem>
              
              {dashboardItems.map((item) => (
                <DropdownMenuItem
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className='cursor-pointer hover:bg-accent/10 py-3 px-3 rounded-lg transition-colors'
                >
                  <item.icon
                    className='mr-3 h-4 w-4 text-primary'
                    aria-hidden='true'
                  />
                  <div>
                    <div className='font-medium'>{item.label}</div>
                    <div className='text-xs text-muted-foreground'>
                      {item.description}
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>

            {/* Community Navigation - Moved from Header */}
            <div className='p-2 border-b border-border/20'>
              <div className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2'>
                Community
              </div>
              <DropdownMenuItem
                onClick={() => navigate('/community')}
                className='cursor-pointer hover:bg-accent/10 py-2 px-3 rounded-lg transition-colors'
              >
                <span className='text-sm'>Community</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate('/gallery')}
                className='cursor-pointer hover:bg-accent/10 py-2 px-3 rounded-lg transition-colors'
              >
                <span className='text-sm'>Gallery</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate('/library')}
                className='cursor-pointer hover:bg-accent/10 py-2 px-3 rounded-lg transition-colors'
              >
                <span className='text-sm'>Library</span>
              </DropdownMenuItem>
            </div>

            {/* Account Section */}
            <div className='p-2 border-b border-border/20'>
              <div className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2'>
                Account
              </div>
              {accountItems.map((item) => (
                <DropdownMenuItem
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className='cursor-pointer hover:bg-accent/10 py-2 px-3 rounded-lg transition-colors'
                >
                  <item.icon
                    className='mr-3 h-4 w-4 text-muted-foreground'
                    aria-hidden='true'
                  />
                  <span className='text-sm'>{item.label}</span>
                </DropdownMenuItem>
              ))}
            </div>

            {/* Logout Section */}
            <div className='p-2'>
              <DropdownMenuItem
                onClick={handleLogout}
                className='cursor-pointer hover:bg-destructive/10 py-2 px-3 rounded-lg transition-colors text-destructive'
              >
                <LogOut
                  className='mr-3 h-4 w-4'
                  aria-hidden='true'
                />
                <span className='text-sm font-medium'>Sign Out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}

/**
 * ADAPTIVE HEADER COMPONENT
 * 
 * Context-aware navigation header that adapts based on authentication state.
 * Features:
 * - Pre-login: Community, Gallery, Library, About, Contact + Sign Up button
 * - Post-login: User dropdown with projects, account, settings, logout
 * - Smooth transition between states
 * - Mobile-responsive design
 * - Theme-reactive styling
 */
export const AdaptiveHeader: React.FC<AdaptiveHeaderProps> = ({
  className = '',

}) => {
  const navigate = useNavigate()
  const isAuthenticated = useIsAuthenticated()

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/20 shadow-sm',
        className
      )}
      role='navigation'
      aria-label='Main navigation'
    >
      <div className='relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
        <div className='flex items-center justify-between'>
          {/* Brand Logo */}
          <button
            className='flex items-center space-x-3 group cursor-pointer bg-transparent border-none p-0'
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
            aria-label='Go to home'
          >
            <div className='w-14 h-14 bg-primary/10 hover:bg-primary/20 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300'>
              <Feather className='w-7 h-7 text-primary' aria-hidden='true' />
            </div>
            <span className='text-3xl font-black text-foreground tracking-wide'>
              Fablecraft
            </span>
          </button>

          {/* Adaptive Navigation */}
          <div className='flex items-center space-x-4'>
            {isAuthenticated ? (
              <PostLoginNavigation />
            ) : (
              <PreLoginNavigation />
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default AdaptiveHeader
