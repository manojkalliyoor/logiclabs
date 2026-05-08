# LogicLabs — Hostinger Node.js Deployment Guide

## Hostinger Setup (Git Deployment)

### In Hostinger Panel:
- **Entry point:** `server.js`
- **Node.js version:** 20 or above
- **Build command:** `npm install && npm run build`

### ⚠️ Required: Set Gemini API Key on Hostinger
The chatbot needs your Gemini API key. **Never put it in code or GitHub.**

In Hostinger Node.js panel → **Environment Variables**, add:
```
GEMINI_API_KEY = your_gemini_api_key_here
```

Get a free Gemini API key at: https://aistudio.google.com/app/apikey

### After connecting GitHub repo, run via SSH:
```bash
npm install
npm run build
```
Then click **Restart** in the panel.

## Local Development
Create a `.env` file (never commit this!):
```
GEMINI_API_KEY=your_key_here
```
Then run:
```bash
npm install
npm run dev
```

## Project Structure
```
logiclabs/
├── src/
│   ├── App.tsx        # Main React app + Chatbot component
│   ├── main.tsx       # Entry point
│   └── index.css      # Styles
├── index.html
├── server.js          # Express server + Gemini API proxy
├── vite.config.ts     # Build config
└── package.json
```
