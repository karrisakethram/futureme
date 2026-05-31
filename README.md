# FutureMe — Meet the Version of You Who Already Made It

An elegant, premium Apple-style AI-powered personal reflection and dialogue application. FutureMe allows users to input their present operational metrics, long-term visions, struggles, and desired conversational tones, then intercepts their trajectory to output a deeply emotional, highly personalized, and actionable identity blueprint from their future self using the Google Gemini API.

---

## 🎨 Theme Update (Premium Off-White Light Mode)
The application features a beautifully polished, clean, **high-contrast off-white light Apple-style design system**:
* **Base Color**: `#f5f5f7` (Apple's signature off-white).
* **Glassmorphism**: Translucent `#ffffff` cards with subtle dark shadows (`rgba(0, 0, 0, 0.04)`) and micro-thin borders.
* **Ambient Glows**: Extremely fine blue and purple glowing backdrops.
* **Vibrant Details**: Clean Royal Blue highlights with bold dark charcoal text primary values.

---

## Folder Structure

```text
futureme/
├── backend/                  # Local Express Server
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/                 # Static Web Frontend Assets
│   ├── index.html
│   ├── style.css
│   └── script.js
├── netlify/                  # Serverless Deployment Configs
│   └── functions/
│       ├── generate-futureme.js
│       └── chat-futureme.js
├── netlify.toml              # Netlify Build and Routing Rules
├── package.json              # Root Netlify Node Config
└── README.md
```

---

## Installation and Quick Start

Follow these simple steps to set up and run the application locally.

### Step 1: Install Dependencies
Open your terminal, navigate to the `backend/` directory, and run:
```bash
cd backend
npm install
```

### Step 2: Configure the API Key
1. In the `backend/` directory, duplicate `.env.example` and name it `.env`:
   ```bash
   copy .env.example .env
   ```
2. Open `.env` and replace the placeholder with your actual Google Gemini API Key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   PORT=5000
   ```

### Step 3: Run the Server
Launch the local Express development server:
```bash
npm run dev
```
The server will boot up and start listening on:
**[http://localhost:5000](http://localhost:5000)**

### Step 4: Open the Frontend
Once the server is running, the frontend is served statically directly on the same port!
Simply open your web browser and navigate to:
👉 **[http://localhost:5000](http://localhost:5000)**

---

## 🚀 Hosting on Netlify (Serverless Mode)

FutureMe is fully configured for seamless production deployment on **Netlify** using serverless Node.js functions.

### Step 1: Connect Your Repository to Netlify
1. Create a new site on Netlify and link it to your GitHub/GitLab repository.
2. Netlify will automatically detect the `netlify.toml` file at the root folder.
3. It will configure:
   * **Publish Directory**: `frontend` (serves the index.html, style.css, script.js statically).
   * **Functions Directory**: `netlify/functions` (packages and deploys backend endpoints as AWS lambdas).

### Step 2: Configure Environment Credentials in Netlify
1. In the Netlify dashboard, navigate to **Site configuration** > **Environment variables**.
2. Click **Add a variable** and configure:
   * **Key**: `GEMINI_API_KEY`
   * **Value**: *Your actual Google Gemini API Key*

### Step 3: Deploy!
Netlify will automatically build the site and deploy the API routes. In production, when the frontend calls `/api/generate-futureme` or `/api/chat-futureme`, Netlify will automatically redirect those requests to the serverless lambdas seamlessly!

---

## API Routes Documentation

### 1. `POST /api/generate-futureme`
Synchronizes present metrics and generates the structured personal reflection matrix.

* **Request Body:**
  ```json
  {
    "name": "Saketh",
    "age": "19",
    "goal": "Build a successful AI startup",
    "struggle": "Lack of consistency",
    "oneYearVision": "Running a profitable AI company",
    "tone": "Brutally Honest"
  }
  ```

* **Response Payload (JSON):**
  ```json
  {
    "success": true,
    "data": {
      "message": "A powerful 120-180 word message from the future self.",
      "futureIdentity": "A concise description of who the user is becoming.",
      "nextMoves": ["Action 1", "Action 2", "Action 3"],
      "habit": "One small daily habit they should start today.",
      "warning": "One mistake their future self warns them about.",
      "mantra": "A short memorable line they can repeat daily."
    }
  }
  ```

### 2. `POST /api/chat-futureme`
Executes real-time responsive dialogues with the simulated future self.

* **Request Body:**
  ```json
  {
    "userProfile": {
      "name": "Saketh",
      "age": "19",
      "goal": "Build a successful AI startup",
      "struggle": "Lack of consistency",
      "oneYearVision": "Running a profitable AI company",
      "tone": "Brutally Honest"
    },
    "chatHistory": [
      { "role": "futureme", "message": "..." }
    ],
    "question": "What should I focus on this week?"
  }
  ```

* **Response Payload (JSON):**
  ```json
  {
    "success": true,
    "reply": "..."
  }
  ```

---

## Core Technologies
- **Frontend**: Pure HTML5, CSS3 Custom Properties (CSS variables), Vanilla JavaScript (modules, intersection observers, fetch API).
- **Backend**: Node.js, Express framework, CORS, Dotenv, Netlify Functions.
- **AI Core**: Google Gemini 3.5 Flash (`@google/generative-ai` SDK) utilizing strict JSON response MIME types.
# futureme
