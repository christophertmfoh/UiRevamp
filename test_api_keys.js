const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKeys = [
  { name: 'GEMINI_X', key: 'AIzaSyA2XLqHO4Dp75VQeESnt4N9J9FFXwYsOHE' },
  { name: 'GEMINI_API_KEY', key: 'AIzaSyBPlF4hoibR24tKKQoOPpqBInmRG6KeXGw' },
  { name: 'GOOGLE_API_KEY', key: 'AIzaSyB7M4TLYpz7bXIaCsrpRvuCnQMdxKwAkbA' },
  { name: 'GOOGLE_API_KEY_1', key: 'AIzaSyDZ3dwihCJv7Vq3eqrEsCkby3cD6ZdWoKs' },
  { name: 'GOOGLE_API_KEY_2', key: 'AIzaSyD93b8viK2qXl5pG6FteUY3h9MO-kBjfHQ' },
  { name: 'GOOGLE_API_KEY4', key: 'AIzaSyA5OPaYNtuH7Xh4LJJ1TpU9bktpaU68P3s' },
  { name: 'GOOGLE_API_KEY_NEW', key: 'AIzaSyAixD8sBJ3PTAwCLFqCE2RZj2jWRvC0dNY' }
];

async function testApiKey(name, key) {
  try {
    console.log(`\n🔑 Testing ${name}: ${key}`);
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent("Generate a simple test character: a brave knight");
    console.log(`✅ ${name} WORKS!`);
    console.log(`Response: ${result.response.text().substring(0, 100)}...`);
    return true;
  } catch (error) {
    console.log(`❌ ${name} FAILED: ${error.message}`);
    return false;
  }
}

async function testAllKeys() {
  console.log('🧪 Testing all API keys for Gemini access...\n');
  
  for (const {name, key} of apiKeys) {
    const works = await testApiKey(name, key);
    if (works) {
      console.log(`\n🎯 FOUND WORKING KEY: ${name}`);
      console.log(`Set this as primary in your environment!`);
      break;
    }
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

testAllKeys().catch(console.error);
