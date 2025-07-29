import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CharacterCreationService } from '@/lib/services/characterCreationService';

export function TestCharacterFlow() {
  const [isCreating, setIsCreating] = useState(false);
  const [testResult, setTestResult] = useState<string>('');
  const [testCharacterData, setTestCharacterData] = useState({
    name: 'Test Character',
    nicknames: 'Testy, TC, The Tester',
    age: '25',
    species: 'Human'
  });

  const handleTestGuidedCreation = async () => {
    setIsCreating(true);
    setTestResult('');
    
    try {
      console.log('🧪 Starting guided character creation test');
      
      const character = await CharacterCreationService.saveCharacter(
        'test-project-demo', 
        testCharacterData
      );
      
      console.log('✅ Test successful! Character created:', character);
      setTestResult(`SUCCESS: Character created with ID: ${character.id}\nNicknames: ${character.nicknames}\nType: ${typeof character.nicknames}`);
      
    } catch (error) {
      console.error('❌ Test failed:', error);
      setTestResult(`FAILED: ${error.message || 'Unknown error'}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleTestNicknamesDisplay = () => {
    const testValues = [
      '{}',
      '[]', 
      'null',
      'undefined',
      '',
      'Nick, Nicky, Nicholas',
      ['Nick', 'Nicky']
    ];
    
    const results = testValues.map(value => {
      // Simulate the safeDisplayValue function
      const safeDisplayValue = (val: any): string => {
        if (val === null || val === undefined) return '';
        if (typeof val === 'string') {
          if (val === '{}' || val === '[]' || val === 'null' || val === 'undefined') return '';
          return val;
        }
        if (Array.isArray(val)) {
          if (val.length === 0) return '';
          return val.join(', ');
        }
        return String(val);
      };
      
      return `Input: ${JSON.stringify(value)} -> Output: "${safeDisplayValue(value)}"`;
    });
    
    setTestResult('Nicknames Display Test Results:\n' + results.join('\n'));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Character System Test Suite</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold">Test Character Data:</h3>
          <div className="grid grid-cols-2 gap-2">
            <Input 
              placeholder="Name" 
              value={testCharacterData.name}
              onChange={(e) => setTestCharacterData(prev => ({...prev, name: e.target.value}))}
            />
            <Input 
              placeholder="Nicknames" 
              value={testCharacterData.nicknames}
              onChange={(e) => setTestCharacterData(prev => ({...prev, nicknames: e.target.value}))}
            />
            <Input 
              placeholder="Age" 
              value={testCharacterData.age}
              onChange={(e) => setTestCharacterData(prev => ({...prev, age: e.target.value}))}
            />
            <Input 
              placeholder="Species" 
              value={testCharacterData.species}
              onChange={(e) => setTestCharacterData(prev => ({...prev, species: e.target.value}))}
            />
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={handleTestGuidedCreation}
            disabled={isCreating}
            className="bg-primary hover:bg-primary/90"
          >
            {isCreating ? 'Creating...' : 'Test Guided Character Creation'}
          </Button>
          
          <Button 
            onClick={handleTestNicknamesDisplay}
            variant="outline"
          >
            Test Nicknames Display Logic
          </Button>
        </div>
        
        {testResult && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <h4 className="font-semibold mb-2">Test Results:</h4>
            <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}