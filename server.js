const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = require("node-fetch");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

app.post("/search", async (req, res) => {
  const { query } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.json({ result: "❌ Missing API key" });
  }

  try {
    const response = await fetch(
  `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `User describes a place: "${query}"

Return 3 possible real-world locations.

Format:
1. Name
- Why it matches
- What to look for`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    // 🔥 SHOW FULL RESPONSE
    console.log("FULL GEMINI RESPONSE:");
    console.log(JSON.stringify(data, null, 2));

    // 🚨 HANDLE ERRORS FROM GOOGLE
    if (data.error) {
      return res.json({ result: "❌ API Error: " + data.error.message });
    }

    let text = "❌ No result from AI";

    if (
      data.candidates &&
      data.candidates[0]?.content?.parts
    ) {
      text = data.candidates[0].content.parts
        .map(p => p.text)
        .join("\n");
    }

    res.json({ result: text });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.json({ result: "❌ Server crashed" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});