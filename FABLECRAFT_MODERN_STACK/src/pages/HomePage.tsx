import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function HomePage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto space-y-8'>
        {/* Hero Section */}
        <div className='text-center space-y-4'>
          <h1 className='text-4xl font-bold tracking-tight fable-text-gradient sm:text-6xl'>
            FableCraft
          </h1>
          <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
            Modern Creative Writing Platform Built with the Latest Tech Stack
          </p>
          <div className='flex gap-2 justify-center flex-wrap'>
            <Badge variant='secondary'>Vite 7</Badge>
            <Badge variant='secondary'>React 18</Badge>
            <Badge variant='secondary'>TypeScript 5.8</Badge>
            <Badge variant='secondary'>Tailwind CSS</Badge>
          </div>
        </div>

        {/* Stack Info */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 Modern Stack Ready</CardTitle>
            <CardDescription>
              Your development environment is now powered by the latest and most
              stable tools
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <h3 className='font-semibold'>⚡ Development</h3>
                <ul className='text-sm text-muted-foreground space-y-1'>
                  <li>• Lightning fast Vite 7 dev server</li>
                  <li>• Hot Module Replacement (HMR)</li>
                  <li>• Path aliases configured (@/)</li>
                  <li>• TypeScript strict mode</li>
                </ul>
              </div>
              <div className='space-y-2'>
                <h3 className='font-semibold'>🎨 UI/UX</h3>
                <ul className='text-sm text-muted-foreground space-y-1'>
                  <li>• Radix UI components</li>
                  <li>• Tailwind CSS with custom theme</li>
                  <li>• Dark mode support</li>
                  <li>• FableCraft brand colors</li>
                </ul>
              </div>
            </div>

            <div className='pt-4 border-t'>
              <Button className='w-full sm:w-auto'>
                Start Building Features
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className='grid gap-4 md:grid-cols-3'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>📚 Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground mb-3'>
                All your old components and assets are preserved for reference
              </p>
              <Button variant='outline' size='sm'>
                Browse Assets
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>🔧 Development</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground mb-3'>
                Start the dev server and begin migrating your features
              </p>
              <Button variant='outline' size='sm'>
                npm run dev
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>🚀 Deploy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground mb-3'>
                Ready for Vercel deployment with zero configuration
              </p>
              <Button variant='outline' size='sm'>
                Deploy Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
