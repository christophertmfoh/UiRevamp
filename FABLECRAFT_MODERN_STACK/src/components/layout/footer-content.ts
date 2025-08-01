/**
 * Footer Content Configuration
 * 
 * Centralized content for the footer section.
 * This makes it easy to update footer links, contact info, and other content
 * without modifying the component itself.
 */

import {
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Github,
  type LucideIcon,
} from 'lucide-react';

/**
 * Company information
 */
export const companyInfo = {
  name: 'Fablecraft',
  tagline: 'Where every story finds its voice',
  description: 'Empowering writers and storytellers with AI-powered tools for character creation, world building, and narrative development.',
  contact: {
    email: 'hello@fablecraft.com',
    phone: '+1 (555) 123-4567',
    location: 'Hartford, CT',
  },
} as const;

/**
 * Footer navigation links organized by category
 */
export const footerLinks = {
  product: [
    'Character Creator',
    'World Builder',
    'Story Planner',
    'Writing Assistant',
    'AI Companion',
    'Templates',
    'Manuscripts',
  ],
  company: [
    'About Us',
    'Careers',
    'Blog',
    'Press Kit',
    'Partners',
    'Contact',
  ],
  support: [
    'Help Center',
    'Documentation',
    'Community Forum',
    'Status Page',
  ],
  legal: [
    'Privacy Policy',
    'Terms of Service',
    'Cookie Policy',
  ],
} as const;

/**
 * Newsletter section content
 */
export const newsletterContent = {
  title: 'Stay Updated',
  description: 'Get the latest updates, writing tips, and feature announcements.',
  placeholder: 'Enter your email',
  buttonText: 'Subscribe',
  disclaimer: 'We respect your privacy. Unsubscribe at any time.',
} as const;

/**
 * Social media links with icons
 */
export interface SocialLink {
  icon: LucideIcon;
  label: string;
  href?: string; // URL can be added when implementing actual links
}

export const socialLinks: SocialLink[] = [
  { icon: Twitter, label: 'Twitter' },
  { icon: Facebook, label: 'Facebook' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Linkedin, label: 'LinkedIn' },
  { icon: Github, label: 'GitHub' },
];

/**
 * Footer branding and taglines
 */
export const footerBranding = {
  followText: 'Follow us',
  madeWithText: 'Made with',
  madeForText: 'for storytellers everywhere',
} as const;

/**
 * Get current year for copyright
 */
export const getCurrentYear = () => new Date().getFullYear();

/**
 * Get copyright text
 */
export const getCopyrightText = () => 
  `© ${getCurrentYear()} ${companyInfo.name}. All rights reserved.`;