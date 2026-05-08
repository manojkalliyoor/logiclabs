# LogicLabs — Hostinger Node.js Deployment Guide

## Hostinger Setup (Git Deployment)

### In Hostinger Panel:
- **Entry point:** `server.js`
- **Node.js version:** 18 or above
- **Build command:** `npm install && npm run build`

### After connecting GitHub repo, run via SSH:
```bash
npm install
npm run build
```
Then click **Restart** in the panel.

## Local Development
```bash
npm install
npm run dev
```

## Project Structure
```
logiclabs/
├── src/
│   ├── App.tsx        # Main React app
│   ├── main.tsx       # Entry point
│   └── index.css      # Styles
├── index.html
├── server.js          # Express server (entry point for Hostinger)
├── vite.config.ts     # Build config
└── package.json
```
