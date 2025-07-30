/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
// Conditional import for bundle analyzer (only during build)
const getBundleAnalyzer = async () => {
    if (process.env.ANALYZE === 'true') {
        const { visualizer } = await import('rollup-plugin-visualizer');
        return visualizer({
            filename: 'dist/stats.html',
            open: true,
            gzipSize: true,
            brotliSize: true,
        });
    }
    return null;
};
// https://vite.dev/config/
export default defineConfig(async () => {
    const bundleAnalyzer = await getBundleAnalyzer();
    return {
        plugins: [
            react(),
            ...(bundleAnalyzer ? [bundleAnalyzer] : []),
        ],
        server: {
            host: '0.0.0.0',
            port: 5173,
            strictPort: true,
            allowedHosts: [
                'bbf3cad8-c58a-41be-acec-fe1f62f386e3-00-qku0gbybmuzb.kirk.replit.dev',
                'ui-revamp-christophertmfo.replit.app',
                'fablecraft-enterprise.christophertmfo.replit.dev',
                'localhost',
                '127.0.0.1',
                '0.0.0.0'
            ],
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: ['./src/test/setup.ts'],
            css: true,
            coverage: {
                provider: 'v8',
                reporter: ['text', 'json', 'html'],
                exclude: [
                    'node_modules/',
                    'src/test/',
                    '**/*.d.ts',
                    '**/*.config.*',
                    '**/mockData/*',
                    'src/main.tsx',
                ],
                thresholds: {
                    statements: 80,
                    branches: 80,
                    functions: 80,
                    lines: 80,
                },
            },
        },
    };
});
