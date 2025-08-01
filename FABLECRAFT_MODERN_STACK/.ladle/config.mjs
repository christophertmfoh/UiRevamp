/** @type {import('@ladle/react').Config} */
export default {
  // Where to find stories
  stories: 'src/**/*.stories.{js,jsx,ts,tsx,mdx}',
  
  // Default story when Ladle opens
  defaultStory: 'ui-components--button--default',
  
  // Port to run on
  port: 61000,
  
  // Enable HMR
  hmr: true,
  
  // Configure addons
  addons: {
    // Theme switcher
    theme: {
      enabled: true,
      defaultState: 'light',
    },
    // RTL support
    rtl: {
      enabled: true, 
      defaultState: false,
    },
    // Control panel
    control: {
      enabled: true,
      defaultState: true,
    },
    // Story mode
    mode: {
      enabled: true,
      defaultState: 'full',
    },
    // Accessibility addon
    a11y: {
      enabled: true,
    },
    // Width addon for responsive testing
    width: {
      enabled: true,
      defaultState: 0,
      options: {
        mobile: 320,
        tablet: 768,
        desktop: 1024,
      },
    },
    // Actions logger
    action: {
      enabled: true,
      defaultState: true,
    },
    // Disable source addon to fix error
    source: {
      enabled: false,
    },
  },
  
  // Vite config
  viteConfig: './vite.config.ts',
}