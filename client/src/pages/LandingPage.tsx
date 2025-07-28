import React from 'react';
import { useLocation } from 'wouter';
import { 
  PenTool, Sparkles, FolderPlus, Lightbulb, Users, BookOpen, 
  FileText, Star, Bot 
} from 'lucide-react';
import { Button } from "../shared/components/ui/button";
import { Card, CardContent } from "../shared/components/ui/card";

export function LandingPage() {
  const [, setLocation] = useLocation();

  const handleNavigate = (path: string) => {
    setLocation(path);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-stone-900 to-stone-950"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]"></div>
      
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 lg:p-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
            <PenTool className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Fablecraft
          </span>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-4xl">
          {/* Hero Badge */}
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-slate-300">AI-Powered Creative Writing Studio</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">Craft Your</span><br />
            <span className="text-white">Fable</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Create compelling stories with AI-powered character generation, world-building tools, and intelligent writing assistance.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <Button
              onClick={() => handleNavigate('/workspace')}
              className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg h-12"
            >
              <FolderPlus className="w-5 h-5 mr-3" />
              Enter Workspace
            </Button>
            <Button
              variant="outline"
              className="bg-stone-800/80 hover:bg-stone-700/80 border border-stone-600 text-slate-300 font-semibold px-8 py-4 rounded-2xl h-12"
            >
              <Lightbulb className="w-5 h-5 mr-3" />
              Brainstorm Ideas
            </Button>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            <Card className="bg-stone-800/30 border-stone-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Character Builder</h3>
                <p className="text-slate-400 text-sm">Create rich, complex characters with AI assistance</p>
              </CardContent>
            </Card>

            <Card className="bg-stone-800/30 border-stone-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">World Building</h3>
                <p className="text-slate-400 text-sm">Design immersive worlds and settings</p>
              </CardContent>
            </Card>

            <Card className="bg-stone-800/30 border-stone-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Story Outlining</h3>
                <p className="text-slate-400 text-sm">Structure your narrative with intelligent tools</p>
              </CardContent>
            </Card>

            <Card className="bg-stone-800/30 border-stone-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">AI Writing Coach</h3>
                <p className="text-slate-400 text-sm">Get intelligent feedback and suggestions</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}