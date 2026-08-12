import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, configured: Boolean(process.env.OPENAI_API_KEY) });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Aucun message à envoyer." });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OPENAI_API_KEY manquante. Ajoute ta clé dans le fichier .env."
      });
    }

    const safeMessages = messages
      .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-30);

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        instructions:
          "Tu es YanisGPT, un assistant IA sympathique, clair et utile. Réponds en français par défaut. " +
          "Tu peux être naturel et utiliser quelques emojis quand c'est approprié. " +
          "Ne prétends pas avoir fait une action que tu n'as pas réellement faite.",
        input: safeMessages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data?.error?.message || "Erreur lors de l'appel à l'API OpenAI.";
      return res.status(response.status).json({ error: message });
    }

    const text = data.output_text ||
      data.output?.flatMap(item => item.content || [])
        ?.filter(part => part.type === "output_text")
        ?.map(part => part.text)
        ?.join("") || "";

    res.json({ text: text || "Je n'ai pas reçu de réponse texte." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur. Vérifie la configuration de YanisGPT." });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`YanisGPT lancé sur http://localhost:${port}`);
});