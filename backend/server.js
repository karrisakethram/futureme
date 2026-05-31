import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Resolve paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS and JSON parsing middlewares
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Initialize Google Generative AI SDK
const apiKey = process.env.GEMINI_API_KEY;
const hasApiKey = apiKey && apiKey !== 'replace_with_your_gemini_api_key' && apiKey !== 'your_api_key_here';
const genAI = new GoogleGenerativeAI(hasApiKey ? apiKey : 'placeholder_key');

// Helper to clean Markdown wrappers and parse JSON safely
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

/**
 * POST /api/generate-futureme
 * Payload: { name, age, goal, struggle, oneYearVision, tone }
 */
app.post('/api/generate-futureme', async (req, res) => {
  try {
    const { name, age, goal, struggle, oneYearVision, tone } = req.body;

    // Payload validation
    if (!name || !age || !goal || !struggle || !oneYearVision || !tone) {
      return res.status(400).json({
        success: false,
        error: "All details must be filled in order to synchronize your future self."
      });
    }

    if (!hasApiKey) {
      return res.status(500).json({
        success: false,
        error: "FutureMe could not respond right now. (API Key not configured on the backend server. Please add your GEMINI_API_KEY to your .env file.)"
      });
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

    // Query Gemini
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const data = cleanAndParseJSON(text);

    return res.json({
      success: true,
      data
    });

  } catch (error) {
    console.error("Error in /api/generate-futureme:", error);
    return res.status(500).json({
      success: false,
      error: "FutureMe could not respond right now. Try again."
    });
  }
});

/**
 * POST /api/chat-futureme
 * Payload: { userProfile, chatHistory, question }
 */
app.post('/api/chat-futureme', async (req, res) => {
  try {
    const { userProfile, chatHistory, question } = req.body;

    if (!userProfile || !question) {
      return res.status(400).json({
        success: false,
        error: "User profile and question are required for continuous dialogue."
      });
    }

    if (!hasApiKey) {
      return res.status(500).json({
        success: false,
        error: "FutureMe could not respond right now. (API Key not configured on the backend server.)"
      });
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

    // Query Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return res.json({
      success: true,
      reply: reply.trim()
    });

  } catch (error) {
    console.error("Error in /api/chat-futureme:", error);
    return res.status(500).json({
      success: false,
      error: "FutureMe could not respond right now. Try again."
    });
  }
});

// Start listening
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`⚡ FutureMe Server Running on http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
