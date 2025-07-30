import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyA2XLqHO4Dp75VQeESnt4N9J9FFXwYsOHE');

async function testCharacterGeneration() {
  console.log('🎭 Testing direct character generation with working API key...');
  
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-pro",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
      maxOutputTokens: 8192
    }
  });

  const prompt = `Generate a detailed character for the project "Test Project"

Project description: A fantasy adventure

Character type: custom
Role in story: auto-detect
Personality traits: auto-generate
Archetype: auto-detect

Additional requirements: A brave knight

Generate a comprehensive character with name, description, personality, abilities, background, and other relevant details. Return valid JSON format.`;

  try {
    console.log('📤 Sending prompt to Gemini...');
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    console.log('✅ SUCCESS! Character generated:');
    console.log(response.substring(0, 500) + '...');
    
    // Try to parse JSON
    const character = JSON.parse(response);
    console.log('\n🎯 Character name:', character.name);
    console.log('🎯 Character type:', typeof character);
    
  } catch (error) {
    console.log('❌ FAILED:', error.message);
  }
}

testCharacterGeneration();
