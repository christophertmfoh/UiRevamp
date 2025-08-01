import { describe, it, expect } from 'vitest';
import {
  companyInfo,
  footerLinks,
  newsletterContent,
  socialLinks,
  footerBranding,
  getCurrentYear,
  getCopyrightText,
} from './footer-content';

describe('Footer Content', () => {
  describe('Company Info', () => {
    it('has all required company information', () => {
      expect(companyInfo.name).toBe('Fablecraft');
      expect(companyInfo.tagline).toBeTruthy();
      expect(companyInfo.description).toBeTruthy();
      expect(companyInfo.contact.email).toContain('@');
      expect(companyInfo.contact.phone).toBeTruthy();
      expect(companyInfo.contact.location).toBeTruthy();
    });
  });

  describe('Footer Links', () => {
    it('has product links', () => {
      expect(footerLinks.product).toBeInstanceOf(Array);
      expect(footerLinks.product.length).toBeGreaterThan(0);
      expect(footerLinks.product).toContain('Character Creator');
    });

    it('has company links', () => {
      expect(footerLinks.company).toBeInstanceOf(Array);
      expect(footerLinks.company.length).toBeGreaterThan(0);
      expect(footerLinks.company).toContain('About Us');
    });

    it('has support links', () => {
      expect(footerLinks.support).toBeInstanceOf(Array);
      expect(footerLinks.support.length).toBeGreaterThan(0);
      expect(footerLinks.support).toContain('Help Center');
    });

    it('has legal links', () => {
      expect(footerLinks.legal).toBeInstanceOf(Array);
      expect(footerLinks.legal.length).toBe(3);
      expect(footerLinks.legal).toContain('Privacy Policy');
    });
  });

  describe('Newsletter Content', () => {
    it('has all newsletter fields', () => {
      expect(newsletterContent.title).toBeTruthy();
      expect(newsletterContent.description).toBeTruthy();
      expect(newsletterContent.placeholder).toBeTruthy();
      expect(newsletterContent.buttonText).toBeTruthy();
      expect(newsletterContent.disclaimer).toBeTruthy();
    });
  });

  describe('Social Links', () => {
    it('has social media links with icons', () => {
      expect(socialLinks).toBeInstanceOf(Array);
      expect(socialLinks.length).toBe(5);
      
      socialLinks.forEach(link => {
        expect(link.icon).toBeTruthy();
        expect(link.label).toBeTruthy();
      });
    });

    it('includes major social platforms', () => {
      const labels = socialLinks.map(link => link.label);
      expect(labels).toContain('Twitter');
      expect(labels).toContain('GitHub');
    });
  });

  describe('Footer Branding', () => {
    it('has all branding text', () => {
      expect(footerBranding.followText).toBeTruthy();
      expect(footerBranding.madeWithText).toBeTruthy();
      expect(footerBranding.madeForText).toBeTruthy();
    });
  });

  describe('Helper Functions', () => {
    it('getCurrentYear returns current year', () => {
      const currentYear = new Date().getFullYear();
      expect(getCurrentYear()).toBe(currentYear);
    });

    it('getCopyrightText returns proper format', () => {
      const copyrightText = getCopyrightText();
      expect(copyrightText).toContain('©');
      expect(copyrightText).toContain(companyInfo.name);
      expect(copyrightText).toContain('All rights reserved');
      expect(copyrightText).toContain(new Date().getFullYear().toString());
    });
  });
});