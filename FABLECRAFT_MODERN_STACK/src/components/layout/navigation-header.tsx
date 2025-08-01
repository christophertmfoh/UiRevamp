'use client';

import React from 'react';
import { ThemeToggle } from '@/features-modern/theme/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  Feather,
  BookOpen,
  Users,
  ChevronDown,
  User,
  LogOut,
  UserCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

/**
 * NavigationHeader Props
 * @param showAuthButton - Whether to show the auth button (default: true)
 * @param authButtonText - Custom text for auth button (default: 'Sign Up / Sign In')
 * @param onAuthClick - Handler for auth button click
 * @param isAuthenticated - User authentication status
 * @param user - User object with username, email, id
 * @param onLogout - Logout handler
 * @param onNavigate - Navigation handler for menu items
 * @param showNavItems - Whether to show navigation items (default: true)
 * @param className - Additional CSS classes
 */
export interface NavigationHeaderProps {
  showAuthButton?: boolean;
  authButtonText?: string;
  onAuthClick?: () => void;
  isAuthenticated?: boolean;
  user?: {
    username?: string;
    email?: string;
    id?: string;
  } | null;
  onLogout?: () => Promise<void>;
  onNavigate?: (view: string) => void;
  showNavItems?: boolean;
  className?: string;
}

/**
 * Reusable Navigation Header Component
 * 
 * @example
 * ```tsx
 * // Landing page usage
 * <NavigationHeader
 *   isAuthenticated={isAuthenticated}
 *   user={user}
 *   onAuthClick={handleAuth}
 *   onLogout={handleLogout}
 *   onNavigate={handleNavigate}
 * />
 * 
 * // Auth page usage (without auth button)
 * <NavigationHeader
 *   showAuthButton={false}
 *   onNavigate={handleNavigate}
 * />
 * ```
 */
export function NavigationHeader({
  showAuthButton = true,
  authButtonText = 'Sign Up / Sign In',
  onAuthClick,
  isAuthenticated = false,
  user,
  onLogout,
  onNavigate,
  showNavItems = true,
  className,
}: NavigationHeaderProps) {
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
          <div
            className='flex items-center space-x-3 group cursor-pointer'
            onClick={() => onNavigate?.('home')}
          >
            <div className='w-14 h-14 bg-primary/10 hover:bg-primary/20 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300'>
              <Feather className='w-7 h-7 text-primary' aria-hidden='true' />
            </div>
            <span className='text-3xl font-black text-foreground tracking-wide'>
              Fablecraft
            </span>
          </div>

          {/* Professional Navigation Menu */}
          {showNavItems && (
            <div className='flex items-center space-x-8'>
              <button
                onClick={() => {
                  /* Community functionality to be implemented */
                }}
                className='text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors duration-200 tracking-wide cursor-pointer uppercase'
              >
                COMMUNITY
              </button>
              <button
                onClick={() => {
                  /* Gallery functionality to be implemented */
                }}
                className='text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors duration-200 tracking-wide cursor-pointer uppercase'
              >
                GALLERY
              </button>
              <button
                onClick={() => {
                  /* Library functionality to be implemented */
                }}
                className='text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors duration-200 tracking-wide cursor-pointer uppercase'
              >
                LIBRARY
              </button>
              <button
                onClick={() => {
                  /* About functionality to be implemented */
                }}
                className='text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors duration-200 tracking-wide cursor-pointer uppercase'
              >
                ABOUT
              </button>
              <button
                onClick={() => {
                  /* Contact functionality to be implemented */
                }}
                className='text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors duration-200 tracking-wide cursor-pointer uppercase'
              >
                CONTACT
              </button>
            </div>
          )}

          {/* Navigation Actions */}
          <div className='flex items-center space-x-4'>
            {/* Authentication Section */}
            {showAuthButton && (
              <>
                {isAuthenticated && user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className={cn(
                          'group bg-primary hover:bg-primary/90 text-primary-foreground',
                          'px-4 py-2 font-semibold shadow-md hover:shadow-lg',
                          'transition-all duration-300 hover:scale-105 rounded-xl'
                        )}
                        aria-label={`User menu for ${user?.username || 'User'}`}
                      >
                        <span className='flex items-center'>
                          <UserCircle className='mr-2 h-4 w-4' aria-hidden='true' />
                          Welcome {user?.username || 'User'}
                          <ChevronDown
                            className='ml-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-300'
                            aria-hidden='true'
                          />
                        </span>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align='end'
                      className='w-64 bg-card/95 backdrop-blur-xl border border-border shadow-xl rounded-xl mt-2'
                    >
                      {/* Workspace Section */}
                      <div className='p-2 border-b border-border/20'>
                        <div className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2'>
                          Workspace
                        </div>
                        <DropdownMenuItem
                          onClick={() => onNavigate?.('projects')}
                          className='cursor-pointer hover:bg-accent/10 py-3 px-4 rounded-lg transition-colors'
                        >
                          <BookOpen
                            className='mr-3 h-4 w-4 text-primary'
                            aria-hidden='true'
                          />
                          <div>
                            <div className='font-medium'>Creative Workspace</div>
                            <div className='text-xs text-muted-foreground'>
                              Projects, characters & world bible
                            </div>
                          </div>
                        </DropdownMenuItem>
                      </div>

                      {/* Account Section */}
                      <div className='p-2 border-b border-border/20'>
                        <div className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2'>
                          Account
                        </div>
                        <DropdownMenuItem
                          onClick={() => {
                            /* Profile functionality not implemented yet */
                          }}
                          className='cursor-pointer hover:bg-accent/10 py-3 px-4 rounded-lg transition-colors'
                        >
                          <User
                            className='mr-3 h-4 w-4 text-primary'
                            aria-hidden='true'
                          />
                          <div>
                            <div className='font-medium'>Profile & Settings</div>
                            <div className='text-xs text-muted-foreground'>
                              Manage your account
                            </div>
                          </div>
                        </DropdownMenuItem>
                      </div>

                      {/* Community Section */}
                      <div className='p-2 border-b border-border/20'>
                        <div className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2'>
                          Community
                        </div>
                        <DropdownMenuItem
                          onClick={() => {
                            /* Community functionality not implemented yet */
                          }}
                          className='cursor-pointer hover:bg-accent/10 py-3 px-4 rounded-lg transition-colors'
                        >
                          <Users
                            className='mr-3 h-4 w-4 text-primary'
                            aria-hidden='true'
                          />
                          <div>
                            <div className='font-medium'>Writer Community</div>
                            <div className='text-xs text-muted-foreground'>
                              Connect with other writers
                            </div>
                          </div>
                        </DropdownMenuItem>
                      </div>

                      {/* Sign Out */}
                      <div className='p-2'>
                        <DropdownMenuItem
                          onClick={onLogout}
                          className='cursor-pointer hover:bg-destructive/10 py-3 px-4 rounded-lg transition-colors'
                        >
                          <LogOut
                            className='mr-3 h-4 w-4 text-destructive'
                            aria-hidden='true'
                          />
                          <span className='font-medium text-destructive'>
                            Sign Out
                          </span>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    onClick={onAuthClick}
                    className={cn(
                      'group bg-primary hover:bg-primary/90 text-primary-foreground',
                      'px-4 py-2 font-semibold shadow-md hover:shadow-lg',
                      'transition-all duration-300 hover:scale-105 rounded-xl'
                    )}
                    aria-label={authButtonText}
                  >
                    <span className='flex items-center'>
                      <Users className='mr-2 h-4 w-4' aria-hidden='true' />
                      {authButtonText}
                    </span>
                  </Button>
                )}
              </>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavigationHeader;