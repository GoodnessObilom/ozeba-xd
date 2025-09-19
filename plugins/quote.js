const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "quote",
  desc: "Get a random inspiring quote.",
  category: "fun",
  filename: __filename
}, async (conn, m, store, { from, reply }) => {
  await conn.sendMessage(m.key.remoteJid, {
    react: {
      text: "💬",
      key: m.key
    }
  });

  try {
    const response = await axios.get("https://zenquotes.io/api/random");
    const { q: content, a: author } = response.data[0];

    const message = `💬 *"${content}"*\n- ${author}\n\n> *QUOTES BY PATRON-MD*`;
    reply(message);
  } catch (error) {
    console.error("Error fetching quote:", error);
    reply("⚠️ Couldn't fetch quote. Check your internet or logs.");
  }
});
