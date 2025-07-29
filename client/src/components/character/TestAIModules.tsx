import React, { useState } from 'react';
import { CharacterAICreationUnified } from './CharacterAICreationUnified';
import { CharacterTemplatesUnified } from './CharacterTemplatesUnified';
import { Button } from '@/components/ui/button';
import type { Character } from '@/lib/types';

export function TestAIModules() {
  const [activeModule, setActiveModule] = useState<'ai' | 'templates' | null>(null);
  const [testResult, setTestResult] = useState<Character | null>(null);

  const handleComplete = (character: Character) => {
    console.log('🧪 TEST COMPLETE: Character received:', character);
    setTestResult(character);
    setActiveModule(null);
    alert(`SUCCESS! Character created: ${character.name}`);
  };

  const handleBack = () => {
    console.log('🧪 TEST: Back button clicked');
    setActiveModule(null);
  };

  if (activeModule === 'ai') {
    return (
      <div className="h-screen">
        <CharacterAICreationUnified
          projectId="test-project-ai"
          onBack={handleBack}
          onComplete={handleComplete}
        />
      </div>
    );
  }

  if (activeModule === 'templates') {
    return (
      <div className="h-screen">
        <CharacterTemplatesUnified
          projectId="test-project-templates"
          onBack={handleBack}
          onComplete={handleComplete}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-2xl font-bold">🧪 AI Modules Test</h1>
        
        <div className="space-y-4">
          <Button 
            onClick={() => setActiveModule('ai')}
            className="w-full"
            size="lg"
          >
            Test Custom AI Module
          </Button>
          
          <Button 
            onClick={() => setActiveModule('templates')}
            className="w-full"
            size="lg"
            variant="outline"
          >
            Test AI Templates Module
          </Button>
        </div>

        {testResult && (
          <div className="mt-8 p-4 border rounded-lg bg-green-50">
            <h3 className="font-semibold text-green-800">Last Test Result:</h3>
            <p className="text-sm text-green-700">
              Created: {testResult.name} ({testResult.id})
            </p>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>Open browser console to see detailed logs</p>
          <p>Each test should take exactly 10 seconds</p>
        </div>
      </div>
    </div>
  );
}