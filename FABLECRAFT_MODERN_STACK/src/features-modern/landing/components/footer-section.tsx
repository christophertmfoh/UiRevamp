import { memo } from 'react';
import {
  Feather,
  Mail,
  MapPin,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * FOOTER SECTION
 * Professional footer with comprehensive elements:
 * - Contact Information
 * - Navigation Links (organized by category)
 * - Social Media Icons
 * - Legal Links
 * - Newsletter Signup
 * - Copyright Notice
 */

interface FooterSectionProps {
  className?: string;
  showBranding?: boolean;
  tagline?: string;
}

/**
 * Main Footer Section Component
 */
export const FooterSection = memo(
  ({
    className = '',
    showBranding = true,
    tagline = 'Where every story finds its voice',
  }: FooterSectionProps) => {
    return (
      <footer
        className={`relative z-10 bg-gradient-to-t from-muted/30 to-transparent border-t border-border ${className}`}
      >
        <div className='max-w-7xl mx-auto px-8 py-16'>
          {/* Main Footer Content Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12'>
            {/* Company Section */}
            <div className='space-y-6'>
              {showBranding && (
                <div className='flex items-center gap-3 group cursor-pointer'>
                  <div className='w-12 h-12 gradient-primary-br rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300'>
                    <Feather className='w-6 h-6 text-primary-foreground' />
                  </div>
                  <span className='text-2xl font-bold gradient-primary-text'>
                    Fablecraft
                  </span>
                </div>
              )}
              <p className='text-foreground/70 text-sm leading-relaxed max-w-xs'>
                {tagline}. Empowering writers and storytellers with AI-powered
                tools for character creation, world building, and narrative
                development.
              </p>

              {/* Contact Information */}
              <div className='space-y-3'>
                <div className='flex items-center gap-3 text-sm text-foreground/60'>
                  <Mail className='w-4 h-4' />
                  <span>hello@fablecraft.com</span>
                </div>
                <div className='flex items-center gap-3 text-sm text-foreground/60'>
                  <Phone className='w-4 h-4' />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className='flex items-center gap-3 text-sm text-foreground/60'>
                  <MapPin className='w-4 h-4' />
                  <span>Hartford, CT</span>
                </div>
              </div>
            </div>

            {/* Product Links */}
            <div className='space-y-6'>
              <h3 className='text-sm font-semibold text-foreground uppercase tracking-wider'>
                Product
              </h3>
              <ul className='space-y-3'>
                {[
                  'Character Creator',
                  'World Builder',
                  'Story Planner',
                  'Writing Assistant',
                  'AI Companion',
                  'Templates',
                  'Manuscripts',
                ].map(item => (
                  <li key={item}>
                    <button className='text-sm text-foreground/60 hover:text-foreground transition-colors duration-200'>
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div className='space-y-6'>
              <h3 className='text-sm font-semibold text-foreground uppercase tracking-wider'>
                Company
              </h3>
              <ul className='space-y-3'>
                {[
                  'About Us',
                  'Careers',
                  'Blog',
                  'Press Kit',
                  'Partners',
                  'Contact',
                ].map(item => (
                  <li key={item}>
                    <button className='text-sm text-foreground/60 hover:text-foreground transition-colors duration-200'>
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources & Newsletter */}
            <div className='space-y-6'>
              <h3 className='text-sm font-semibold text-foreground uppercase tracking-wider'>
                Stay Updated
              </h3>
              <p className='text-sm text-foreground/60'>
                Get the latest updates, writing tips, and feature announcements.
              </p>

              {/* Newsletter Signup */}
              <div className='space-y-3'>
                <div className='flex gap-2'>
                  <Input
                    type='email'
                    placeholder='Enter your email'
                    className='text-sm'
                  />
                  <Button size='sm' className='px-4 whitespace-nowrap'>
                    Subscribe
                  </Button>
                </div>
                <p className='text-xs text-foreground/50'>
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>

              {/* Support Links */}
              <div className='space-y-3'>
                <h4 className='text-sm font-medium text-foreground'>Support</h4>
                <ul className='space-y-2'>
                  {[
                    'Help Center',
                    'Documentation',
                    'Community Forum',
                    'Status Page',
                  ].map(item => (
                    <li key={item}>
                      <button className='text-sm text-foreground/60 hover:text-foreground transition-colors duration-200'>
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className='pt-8 border-t border-border/20'>
            <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
              {/* Copyright and Legal */}
              <div className='flex flex-col sm:flex-row items-center gap-4 text-sm text-foreground/50'>
                <span>
                  © {new Date().getFullYear()} Fablecraft. All rights reserved.
                </span>
                <div className='flex items-center gap-4'>
                  <button className='hover:text-foreground transition-colors duration-200'>
                    Privacy Policy
                  </button>
                  <button className='hover:text-foreground transition-colors duration-200'>
                    Terms of Service
                  </button>
                  <button className='hover:text-foreground transition-colors duration-200'>
                    Cookie Policy
                  </button>
                </div>
              </div>

              {/* Social Media Icons */}
              <div className='flex items-center gap-4'>
                <span className='text-sm text-foreground/60 mr-2'>
                  Follow us
                </span>
                {[
                  { icon: Twitter, label: 'Twitter' },
                  { icon: Facebook, label: 'Facebook' },
                  { icon: Instagram, label: 'Instagram' },
                  { icon: Linkedin, label: 'LinkedIn' },
                  { icon: Github, label: 'GitHub' },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className='w-8 h-8 rounded-lg bg-muted hover:bg-accent transition-colors duration-200 flex items-center justify-center group'
                    aria-label={`Follow us on ${label}`}
                  >
                    <Icon className='w-4 h-4 text-foreground/60 group-hover:text-foreground transition-colors duration-200' />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Made with Love Line */}
          <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground mt-8 pt-6 border-t border-border/10'>
            <span>Made with</span>
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
