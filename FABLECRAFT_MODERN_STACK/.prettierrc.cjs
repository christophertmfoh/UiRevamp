module.exports = {
  // Core formatting
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  trailingComma: 'es5',
  printWidth: 80,
  
  // Bracket formatting
  bracketSpacing: true,
  bracketSameLine: false,
  
  // Arrow function formatting
  arrowParens: 'avoid',
  
  // Line endings
  endOfLine: 'lf',
  
  // JSX formatting
  jsxSingleQuote: true,
  
  // File-specific overrides
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 200,
        tabWidth: 2,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 100,
        proseWrap: 'always',
        tabWidth: 2,
      },
    },
    {
      files: '*.{css,scss,less}',
      options: {
        singleQuote: false,
        tabWidth: 2,
      },
    },
    {
      files: '*.{yml,yaml}',
      options: {
        tabWidth: 2,
        singleQuote: false,
      },
    },
  ],
};