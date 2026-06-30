const OpenAI = require("openai");

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array required" });
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "OpenAI API 호출 실패: " + err.message });
  }
};
