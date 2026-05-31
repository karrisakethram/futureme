import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log("Using API Key:", apiKey ? apiKey.substring(0, 8) + "..." : "undefined");

async function run() {
  const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
  try {
    const res = await fetch(url);
    const text = await res.text();
    console.log("Status Code:", res.status);
    console.log("Response Body:", text);
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}

run();
