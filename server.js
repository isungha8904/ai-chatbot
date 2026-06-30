require("dotenv").config();
const express = require("express");
const OpenAI = require("openai");

const app = express();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());
app.use(express.static("public"));

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array required" });
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });
    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "OpenAI API 호출 실패: " + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`서버 실행 중 → http://localhost:${PORT}`));
