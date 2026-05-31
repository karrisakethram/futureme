import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function testQuota() {
  const modelsToTry = [
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash-lite"
  ];

  for (const modelName of modelsToTry) {
    console.log(`\nTesting quota for model: ${modelName}`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say 'hello' in one word.");
      console.log(`🚀 SUCCESS! Model ${modelName} is working! Response:`, result.response.text().trim());
      return modelName;
    } catch (err) {
      console.error(`Failed with ${modelName}:`, err.message);
    }
  }
  console.log("\nAll tested models failed.");
  return null;
}

testQuota();
