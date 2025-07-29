import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKeys = [
  { name: 'GEMINI_API_KEY', key: 'AIzaSyBPlF4hoibR24tKKQoOPpqBInmRG6KeXGw' },
  { name: 'GOOGLE_API_KEY_1', key: 'AIzaSyDZ3dwihCJv7Vq3eqrEsCkby3cD6ZdWoKs' },
  { name: 'GOOGLE_API_KEY_2', key: 'AIzaSyD93b8viK2qXl5pG6FteUY3h9MO-kBjfHQ' }
];

async function testKey(name, key) {
  try {
    console.log(`\n🔑 Testing ${name}...`);
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Test: Generate a simple fantasy character name");
    console.log(`✅ ${name} WORKS! Response: ${result.response.text()}`);
    return key;
  } catch (error) {
    console.log(`❌ ${name} FAILED: ${error.message.substring(0, 100)}...`);
    return null;
  }
}

async function findWorkingKey() {
  for (const {name, key} of apiKeys) {
    const workingKey = await testKey(name, key);
    if (workingKey) {
      console.log(`\n🎯 FOUND WORKING KEY: ${name}`);
      return workingKey;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  console.log('\n❌ No working keys found');
  return null;
}

findWorkingKey();
