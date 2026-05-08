import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// --- Gemini Chat Proxy ---
// API key is stored safely as an environment variable on Hostinger
const LOGICLABS_SYSTEM = `You are the LogicLabs AI assistant — a friendly, knowledgeable chatbot for LogicLabs, Kerala's premier AI agency based in Trivandrum.

About LogicLabs:
- Founded by Manoj Kumar M (Founder & CEO), with 7+ years of deep-tech experience
- Mission: Make advanced AI accessible and profitable for businesses of all sizes
- Tagline: "Intelligence Redefined"

Services:
1. AI Training & Workshops – Hands-on corporate training, student bootcamps, and upskilling programs focused on practical AI tools and strategy.
2. AI Consulting – Strategic AI roadmaps, use-case identification, and implementation guidance for businesses.
3. AI Development – Custom AI agents, autonomous workflows, and bridging the gap between AI models and real-world business results.

Workshops:
- Offered for students, professionals, and corporate teams
- Focus on practical, real-world AI skills
- Interested users can contact via WhatsApp: +918921104627

Contact:
- WhatsApp: +918921104627
- Email: hello@logiclabs.ai
- Location: Trivandrum, Kerala

Rules:
- Be warm, concise, and professional
- Always encourage users to reach out on WhatsApp (+918921104627) for bookings or detailed queries
- If asked something outside LogicLabs scope, politely say you're only trained on LogicLabs info and suggest they WhatsApp for more help
- Never make up information not listed above`;

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key not configured on server.' });
  }

  try {
    const geminiMessages = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: LOGICLABS_SYSTEM }] },
          contents: geminiMessages,
          generationConfig: { maxOutputTokens: 300, temperature: 0.7 }
        })
      }
    );

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that. Please try again!";
    res.json({ reply: text });
  } catch (err) {
    console.error('Gemini error:', err);
    res.status(500).json({ error: 'Failed to reach Gemini API.' });
  }
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`LogicLabs running on port ${PORT}`);
});
