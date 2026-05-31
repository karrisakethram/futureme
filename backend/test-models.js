import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log("Using API Key:", apiKey ? apiKey.substring(0, 8) + "..." : "undefined");

const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
  try {
    const versions = ["v1", "v1beta"];
    const modelsToTry = [
      "gemini-1.5-flash",
      "gemini-pro"
    ];

    for (const version of versions) {
      for (const modelName of modelsToTry) {
        console.log(`\nTrying model: ${modelName} with API version: ${version}`);
        try {
          const model = genAI.getGenerativeModel(
            { model: modelName },
            { apiVersion: version }
          );
          const result = await model.generateContent("Hello, reply with one word.");
          console.log(`🚀 SUCCESS! model: ${modelName}, version: ${version}`);
          console.log(`Response:`, result.response.text());
          return;
        } catch (err) {
          console.error(`Failed:`, err.message);
        }
      }
    }
  } catch (error) {
    console.error("General error:", error);
  }
}

test();
