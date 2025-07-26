import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Feather, 
  BookOpen, 
  Users,
  Edit3, 
  ArrowRight,
  Globe
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onNewProject: () => void;
  onUploadManuscript: () => void;
  guideMode: boolean;
  setGuideMode: (mode: boolean) => void;
}



export function LandingPage({ 
  onNavigate, 
  onNewProject, 
  onUploadManuscript, 
  guideMode, 
  setGuideMode 
}: LandingPageProps) {

  return (
    <div className="min-h-screen bg-white relative">
      {/* Minimal grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>
      
      {/* Single accent element */}
      <div className="absolute top-32 right-32 w-96 h-96 bg-gradient-to-br from-amber-100/20 to-orange-100/20 rounded-full blur-3xl"></div>

      {/* Navigation */}
      <nav className="relative z-10 px-8 py-8">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <Feather className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-900">
              Fablecraft
            </span>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('projects')}
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-4 py-2 font-medium"
          >
            Your Projects
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-32">
        <div className="text-center space-y-12">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              AI-Powered Writing Platform
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
              Write stories that
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600">
                captivate readers
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Professional writing tools powered by AI. Create compelling characters, 
              build immersive worlds, and craft narratives that resonate.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button 
                size="lg"
                onClick={() => onNewProject()}
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 text-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                Start Writing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="ghost"
                size="lg"
                onClick={() => onNavigate('projects')}
                className="text-slate-600 hover:text-slate-900 px-8 py-4 text-lg font-medium"
              >
                View Examples
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-colors duration-200">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-slate-700" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Character Development</h3>
            <p className="text-slate-600 leading-relaxed">
              Create compelling characters with AI-powered generation. Build detailed personas, 
              backstories, and relationships that drive your narrative forward.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-colors duration-200">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
              <Globe className="w-6 h-6 text-slate-700" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">World Building</h3>
            <p className="text-slate-600 leading-relaxed">
              Design rich, immersive worlds with interconnected histories and cultures. 
              Create the perfect setting for your stories to unfold.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-colors duration-200">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
              <Edit3 className="w-6 h-6 text-slate-700" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Professional Writing</h3>
            <p className="text-slate-600 leading-relaxed">
              Organize your work with project-based workflows. Track character arcs, 
              plot threads, and maintain consistency across your entire story.
            </p>
          </div>
        </div>
      </section>



      {/* Social Proof */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 py-24">
        <div className="text-center space-y-12">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Trusted by creative writers
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Join thousands of writers who use Fablecraft to bring their stories to life
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-slate-900">10,000+</div>
              <div className="text-slate-600">Characters Created</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-slate-900">5,000+</div>
              <div className="text-slate-600">Stories in Progress</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-slate-900">1,200+</div>
              <div className="text-slate-600">Published Works</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 py-32">
        <div className="text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
            Ready to start writing?
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Create your first project and discover how AI can enhance your storytelling
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              onClick={() => onNewProject()}
              size="lg"
              className="bg-slate-900 hover:bg-slate-800 text-white px-12 py-4 text-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={() => onNavigate('projects')}
              variant="outline"
              size="lg"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 px-12 py-4 text-lg font-medium"
            >
              View Examples
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 py-12 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-6 h-6 bg-slate-900 rounded-lg flex items-center justify-center">
              <Feather className="w-3 h-3 text-white" />
            </div>
            <span className="text-lg font-semibold text-slate-900">Fablecraft</span>
          </div>
          <p className="text-slate-600 text-sm">
            Professional writing tools for modern storytellers
          </p>
        </div>
      </footer>
    </div>
  );
}