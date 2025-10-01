import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY; // We'll set this in Vercel

const gsm7Chars = `@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞ¡§¿abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!"#¤%&'()*+,-./:;<=>?¡ÄÖÑÜ§¿äöñüà`;

function isGSM7(msg) {
  for (let c of msg) {
    if (!gsm7Chars.includes(c)) return false;
  }
  return true;
}

function calculateSegments(msg, unicode=false) {
  const len = msg.length;
  if (!unicode) return len <= 160 ? 1 : Math.ceil(len/153);
  else return len <= 70 ? 1 : Math.ceil(len/67);
}

app.post('/optimize-sms', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  const unicode = !isGSM7(message);
  const originalSegments = calculateSegments(message, unicode);

  try {
    const response = await fetch(
      "https://api.generativeai.googleapis.com/v1beta2/models/gemini-2.5-pro:generateText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          prompt: `Optimize this SMS to reduce length without changing meaning: "${message}"`,
          maxOutputTokens: 200
        })
      }
    );

    const data = await response.json();
    const optimizedMsg = data.output_text || message;
    const optimizedSegments = calculateSegments(optimizedMsg, unicode);

    res.json({
      original: {
        message,
        length: message.length,
        segments: originalSegments,
        encoding: unicode ? "Unicode" : "GSM-7"
      },
      optimized: {
        message: optimizedMsg,
        length: optimizedMsg.length,
        segments: optimizedSegments,
        encoding: unicode ? "Unicode" : "GSM-7"
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
