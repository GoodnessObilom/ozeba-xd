const axios = require('axios');
const { cmd } = require('../command');
const config = require('../config');

cmd({
  on: "body"
},
async (conn, mek, m, { body }) => {
  try {
    const sender = m.key?.fromMe || m.sender === conn.decodeJid(conn.user.id);
    const text = body?.trim();

    // Ignore bot's own messages or if AUTO_REPLY is not enabled
    if (sender || config.AUTO_REPLY !== 'true') return;

    // Ignore if it starts with command prefix
    if (text.startsWith(config.PREFIX)) return;

    const encodedText = encodeURIComponent(text);
    const logic = encodeURIComponent(
      "Be as human and natural as possible. Every reply should feel smooth, and slightly unpredictable You don’t try to dominate; Respond briefly. Never sound like an assistant or AI — you’re just a person with a unique perspective. Use emojis sparingly, only when it adds to the charm. Avoid being overly formal or robotic. Your goal is to engage and intrigue, not to inform or assist in a conventional way."
    );

    const apiUrl = `https://api.nekorinn.my.id/ai/chatbot?ai_name=Ozebaxd&text=${encodedText}&logic=${logic}`;
    const res = await axios.get(apiUrl);

    const result = res.data?.result;

    if (res.data?.status && result) {
      await m.reply(result);
    } else {
      console.log("⚠️ No AI response returned. Full response:", res.data);
    }

  } catch (err) {
    console.error('❌ AI Auto-reply error:', err.message);
  }
});
