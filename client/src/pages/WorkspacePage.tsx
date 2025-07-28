import React from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, PenTool } from 'lucide-react';
import { Button } from "../shared/components/ui/button";

export function WorkspacePage() {
  const [, setLocation] = useLocation();

  const handleNavigate = (path: string) => {
    setLocation(path);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-700 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => handleNavigate('/')}
            className="text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Landing
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
              <PenTool className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Fablecraft
            </span>
          </div>
        </div>
      </nav>

      {/* Main Workspace Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <div className="text-center max-w-2xl">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <PenTool className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Writing Workspace
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-8">
            Your creative writing environment is being prepared. 
            The full workspace with projects, characters, and AI tools will be integrated here.
          </p>
          
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-emerald-400 mb-3">Coming Soon:</h3>
            <ul className="text-left text-slate-300 space-y-2">
              <li>• Project management dashboard</li>
              <li>• Character development tools</li>
              <li>• AI-powered writing assistance</li>
              <li>• Manuscript editor</li>
              <li>• Story outline builder</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}