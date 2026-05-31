import { GoogleGenerativeAI } from '@google/generative-ai';

// Clean Markdown wrappers and parse JSON safely
function cleanAndParseJSON(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  return JSON.parse(cleaned.trim());
}

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
    const { name, age, goal, struggle, oneYearVision, tone } = JSON.parse(event.body);

    // Payload validation
    if (!name || !age || !goal || !struggle || !oneYearVision || !tone) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "All details must be filled in order to synchronize your future self."
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

    // System prompt configuration
    const prompt = `You are FutureMe, the future successful version of the user. You are not a generic motivational coach. You speak with emotional intelligence, clarity, and deep personal understanding. Your job is to help the user see who they are becoming, what they must change, and what they should do next.

Write as if you are the user’s future self speaking directly to their current self.

Tone selected by user: ${tone}

User details:
Name: ${name}
Age: ${age}
Goal: ${goal}
Current struggle: ${struggle}
One-year vision: ${oneYearVision}

Return only valid JSON in this exact format:
{
  "message": "A powerful 120-180 word message from the future self.",
  "futureIdentity": "A concise description of who the user is becoming.",
  "nextMoves": ["Action 1", "Action 2", "Action 3"],
  "habit": "One small daily habit they should start today.",
  "warning": "One mistake their future self warns them about.",
  "mantra": "A short memorable line they can repeat daily."
}

Make it specific. Avoid generic motivation. Avoid clichés. Make it emotional but practical.`;

    // Query Gemini 3.5 Flash (verified active model)
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const data = cleanAndParseJSON(text);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data
      })
    };

  } catch (error) {
    console.error("Netlify Function Generate Error:", error);
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
