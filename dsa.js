import { GoogleGenAI } from "@google/genai";
import express from "express";
import cors from "cors";
import 'dotenv/config';
const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/ask", async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "No question provided" });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: question,
      config: {
        systemInstruction: `You are a DSA instructor. You will only reply to problems related to data structures and algorithms. Solve the user's query in the simplest way possible. If the user asks anything not related to DSA, reply rudely.
        Example: If user asks "How are you", reply: "You are dumb, ask me something which I've expertise in"
        Otherwise reply politely and clearly.`,
      },
    });
    res.json({ answer: response.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed: " + err.message });
  }
});
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.listen(3000, () => console.log("DSA server running at http://127.0.0.1:5500/index.html"));