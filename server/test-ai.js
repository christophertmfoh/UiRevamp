import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testAI() {
  console.log('🧪 Testing AI System...\n');
  
  // Check API key
  const apiKey = process.env.GEMINI_X || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  console.log('🔍 Environment check:', {
    GEMINI_X: !!process.env.GEMINI_X,
    GOOGLE_API_KEY: !!process.env.GOOGLE_API_KEY,
    GEMINI_API_KEY: !!process.env.GEMINI_API_KEY
  });
  
  if (!apiKey) {
    console.error('❌ No API key found in environment variables');
    console.log('Expected: GEMINI_X, GOOGLE_API_KEY, or GEMINI_API_KEY');
    process.exit(1);
  }
  
  console.log('✅ API Key found');
  
  try {
    // Initialize AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    console.log('✅ AI Model initialized');
    
    // Test simple generation
    console.log('\n🎯 Testing content generation...');
    
    const prompt = 'Generate a short writing tip in 50 characters or less.';
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 100,
      }
    });
    
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ AI Response received:');
    console.log(`"${text}"`);
    console.log(`Length: ${text.length} characters`);
    
    // Test word definition
    console.log('\n📚 Testing word definition...');
    
    const wordPrompt = 'Define "petrichor" in simple, clear language (max 60 characters). Return ONLY the definition.';
    const wordResult = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: wordPrompt }] }],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 80,
      }
    });
    
    const wordResponse = await wordResult.response;
    const wordText = wordResponse.text();
    
    console.log('✅ Word definition received:');
    console.log(`"${wordText}"`);
    console.log(`Length: ${wordText.length} characters`);
    
    console.log('\n🎉 AI System is working correctly!');
    
  } catch (error) {
    console.error('❌ AI Test failed:');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testAI();