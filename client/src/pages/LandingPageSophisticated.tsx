import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '../shared/components/ui/button';
import { ThemeToggle } from '../shared/components/theme-toggle';
import { 
  PenTool, 
  BookOpen, 
  Sparkles
} from 'lucide-react';

interface LandingPageProps {
  onNavigate?: (view: string) => void;
  onNewProject?: () => void;
  onUploadManuscript?: () => void;
  onAuth?: () => void;
  onLogout?: () => Promise<void>;
  user?: any;
  isAuthenticated?: boolean;
}

export function LandingPage({ 
  onNavigate = () => {}, 
  onNewProject = () => {}, 
  onUploadManuscript = () => {}, 
  onAuth = () => {},
  onLogout = async () => {},
  user = null,
  isAuthenticated = false
}: LandingPageProps = {}) {
  const [, setLocation] = useLocation();

  const handleNewProject = () => {
    console.log('Creating new project...');
    onNewProject();
  };

  const handleNavigateToProjects = () => {
    console.log('Navigating to projects...');
    setLocation('/workspace');
    onNavigate('projects');
  };

  const handleNavigate = (view: string) => {
    onNavigate(view);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-stone-900 to-stone-950"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]"></div>
      
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 lg:p-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 brand-gradient-bg rounded-xl flex items-center justify-center">
            <PenTool className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">Fablecraft</span>
        </div>
        <ThemeToggle />
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-4xl animate-fade-in">
          {/* Hero Badge */}
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-8 animate-pulse-glow">
            <Sparkles className="w-4 h-4 icon-primary" />
            <span className="text-sm font-medium text-body-secondary">AI-Powered Creative Writing Studio</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-8 gradient-text">
            Where Stories Come to Life
          </h1>
          
          {/* Description */}
          <p className="text-xl text-body-secondary mb-12 max-w-2xl mx-auto leading-relaxed">
            From the first spark of an idea to the final polished manuscript. Craft novels, screenplays, 
            and graphic novels with AI that understands the art of storytelling.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={handleNewProject}
              className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <PenTool className="mr-2 h-5 w-5" />
              Begin Your Story
            </Button>
            <Button 
              size="lg"
              onClick={handleNavigateToProjects}
              variant="outline"
              className="border-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 font-semibold px-8 py-4 rounded-xl transition-all duration-200"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Browse Stories
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}