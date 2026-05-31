import { GoogleGenerativeAI } from '@google/generative-ai';

export const handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  // CORS Preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }

  // Method restriction
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: "Method Not Allowed" })
    };
  }

  try {
    const { userProfile, chatHistory, question } = JSON.parse(event.body);

    if (!userProfile || !question) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "User profile and question are required for continuous dialogue."
        })
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'replace_with_your_gemini_api_key' || apiKey === 'your_api_key_here') {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: "FutureMe could not respond right now. (API Key not configured on Netlify. Please set GEMINI_API_KEY in your Netlify site settings.)"
        })
      };
    }

    // Format chat history
    const historyString = (chatHistory || []).map(msg => {
      const roleName = msg.role === 'user' ? 'Current Self' : 'Future Self';
      return `${roleName}: ${msg.message}`;
    }).join('\n');

    // System prompt configuration
    const prompt = `You are FutureMe, the future version of the user who already achieved their one-year vision. Reply directly to the user’s question. Be personal, sharp, honest, and useful. Do not sound like a normal AI assistant. Do not mention that you are Gemini or an AI model. Speak like the future self.

User profile:
Name: ${userProfile.name}
Age: ${userProfile.age}
Goal: ${userProfile.goal}
Struggle: ${userProfile.struggle}
One-year vision: ${userProfile.oneYearVision}
Tone: ${userProfile.tone}

Recent chat history:
${historyString}

Current question:
${userProfile.name} asks: "${question}"

Reply in 2-5 short paragraphs. Give at least one clear action. Keep the tone matching the chosen mode: ${userProfile.tone}.`;

    // Query Gemini 3.5 Flash
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        reply: reply.trim()
      })
    };

  } catch (error) {
    console.error("Netlify Function Chat Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: "FutureMe could not respond right now. Try again."
      })
    };
  }
};
