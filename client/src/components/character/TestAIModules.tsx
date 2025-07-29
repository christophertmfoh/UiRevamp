import React, { useState } from 'react';
import { CharacterAICreationUnified } from './CharacterAICreationUnified';
import { CharacterTemplatesUnified } from './CharacterTemplatesUnified';
import { Button } from '@/components/ui/button';
import type { Character } from '@/lib/types';

export function TestAIModules() {
  const [activeModule, setActiveModule] = useState<'ai' | 'templates' | null>(null);
  const [testResult, setTestResult] = useState<Character | null>(null);
  const [lastTestType, setLastTestType] = useState<string>('');

  const handleComplete = (character: Character) => {
    console.log('🧪 TEST COMPLETE: Character received:', character);
    setTestResult(character);
    setActiveModule(null);
    
    // Enhanced success message with save confirmation
    const successMessage = `SUCCESS! Character created and saved:
    
✅ Name: ${character.name}
✅ ID: ${character.id}
✅ Project: ${character.projectId}
✅ Fields: ${Object.keys(character).length}/86
✅ Completion: ${character.completionPercentage}%
${character.imageUrl ? '✅ Portrait: Included' : '⚠️ Portrait: Missing'}

This character is now saved in the backend and ready for use!`;
    
    alert(successMessage);
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
      <div className="text-center space-y-6 max-w-lg">
        <h1 className="text-2xl font-bold">🧪 AI Modules Test</h1>
        <p className="text-muted-foreground">Complete end-to-end testing with character saving</p>
        
        <div className="space-y-4">
          <Button 
            onClick={() => {
              setActiveModule('ai');
              setLastTestType('Custom AI');
            }}
            className="w-full"
            size="lg"
          >
            Test Custom AI Module
          </Button>
          
          <Button 
            onClick={() => {
              setActiveModule('templates');
              setLastTestType('AI Templates');
            }}
            className="w-full"
            size="lg"
            variant="outline"
          >
            Test AI Templates Module
          </Button>
        </div>

        {testResult && (
          <div className="mt-8 p-4 border rounded-lg bg-green-50">
            <h3 className="font-semibold text-green-800">✅ Last Test Success:</h3>
            <div className="text-sm text-green-700 space-y-1">
              <p><strong>Type:</strong> {lastTestType}</p>
              <p><strong>Character:</strong> {testResult.name}</p>
              <p><strong>ID:</strong> {testResult.id}</p>
              <p><strong>Project:</strong> {testResult.projectId}</p>
              <p><strong>Saved:</strong> ✅ Yes (Backend)</p>
              <p><strong>Fields:</strong> {Object.keys(testResult).length}/86</p>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-2">
          <p><strong>Test Process:</strong></p>
          <div className="text-left space-y-1">
            <p>1. ⏱️ 10-second loading with progress steps</p>
            <p>2. 🎭 Generate complete character (86 fields)</p>
            <p>3. 💾 Save character to backend database</p>
            <p>4. ✅ Success confirmation with details</p>
          </div>
          <p className="pt-2"><strong>📊 Console:</strong> Open F12 for detailed logs</p>
        </div>
      </div>
    </div>
  );
}