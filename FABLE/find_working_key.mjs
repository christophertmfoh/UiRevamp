// Test each key with exact same setup as image generation
import { GoogleGenerativeAI } from '@google/generative-ai';

const keys = {
  'GEMINI_X': 'AIzaSyA2XLqHO4Dp75VQeESnt4N9J9FFXwYsOHE',
  'GOOGLE_API_KEY_2': 'AIzaSyD93b8viK2qXl5pG6FteUY3h9MO-kBjfHQ', 
  'GOOGLE_API_KEY_1': 'AIzaSyDZ3dwihCJv7Vq3eqrEsCkby3cD6ZdWoKs',
  'GOOGLE_API_KEY': 'AIzaSyB7M4TLYpz7bXIaCsrpRvuCnQMdxKwAkbA',
  'GEMINI_API_KEY': 'AIzaSyBPlF4hoibR24tKKQoOPpqBInmRG6KeXGw'
};

async function testKeyQuick(name, key) {
  try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    await model.generateContent("Test");
    console.log(`✅ ${name} - WORKING`);
    return true;
  } catch (error) {
    const msg = error.message;
    if (msg.includes('quota') || msg.includes('exceeded')) {
      console.log(`❌ ${name} - QUOTA EXCEEDED`);
    } else if (msg.includes('overloaded') || msg.includes('503')) {
      console.log(`⚠️  ${name} - MODEL OVERLOADED (but key valid)`);
    } else {
      console.log(`❌ ${name} - AUTH ERROR`);
    }
    return false;
  }
}

console.log('🔍 Testing keys in IMAGE GENERATION priority order...\n');

for (const [name, key] of Object.entries(keys)) {
  await testKeyQuick(name, key);
  await new Promise(resolve => setTimeout(resolve, 500));
}
