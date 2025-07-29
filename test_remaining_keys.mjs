import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKeys = [
  { name: 'GOOGLE_API_KEY', key: 'AIzaSyB7M4TLYpz7bXIaCsrpRvuCnQMdxKwAkbA' },
  { name: 'GOOGLE_API_KEY4', key: 'AIzaSyA5OPaYNtuH7Xh4LJJ1TpU9bktpaU68P3s' },
  { name: 'GOOGLE_API_KEY_NEW', key: 'AIzaSyAixD8sBJ3PTAwCLFqCE2RZj2jWRvC0dNY' }
];

async function testKey(name, key) {
  try {
    console.log(`\n🔑 Testing ${name}...`);
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Generate a character name: brave knight");
    console.log(`✅ ${name} WORKS! Generated: ${result.response.text()}`);
    return { name, key };
  } catch (error) {
    console.log(`❌ ${name} FAILED: ${error.message.includes('quota') ? 'QUOTA EXCEEDED' : error.message.includes('overloaded') ? 'MODEL OVERLOADED' : 'AUTH ERROR'}`);
    return null;
  }
}

async function findWorkingKey() {
  for (const keyData of apiKeys) {
    const result = await testKey(keyData.name, keyData.key);
    if (result) {
      console.log(`\n🎯 WORKING KEY FOUND: ${result.name}`);
      console.log(`🔧 Use this in your .env: ${result.name}=${result.key}`);
      return result;
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  console.log('\n❌ All keys are rate limited or failing');
  return null;
}

findWorkingKey();
