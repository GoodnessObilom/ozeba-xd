const axios = require("axios");
const { cmd } = require('../command');
const fetch = require("node-fetch");

cmd({
  pattern: "ss",
  alias: ["ssweb"],
  react: "🚀",
  desc: "Download screenshot of a given link or send direct image URL.",
  category: "other",
  use: ".ss <link or image url>",
  filename: __filename,
},
async (conn, mek, m, {
  from, reply, q
}) => {
  if (!q) return reply("Please provide a URL or image link.");

  // Regex to check if q is a direct image link
  const isImageUrl = /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(q);

  const sendScreenshot = async (buffer) => {
    return await conn.sendMessage(from, {
      image: buffer,
      caption: `*📸 Screenshot Tool*\n\n🌐 *URL:* ${q}\n\n_*© 𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡* 🚹_*`,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363421812440006@newsletter',
                        newsletterName: "𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡",
                        serverMessageId: 143
        },
      },
    }, { quoted: m });
  };

  try {
    if (isImageUrl) {
      // Direct image URL: fetch buffer and send
      const imageResponse = await fetch(q);
      if (!imageResponse.ok) throw new Error("Failed to fetch image from provided URL");
      const imageBuffer = await imageResponse.buffer();
      return await sendScreenshot(imageBuffer);
    }

    // Otherwise treat q as a website URL to screenshot
    if (!/^https?:\/\//.test(q)) return reply("❗ Please provide a valid URL starting with http:// or https://");

    const apiUrl = `https://delirius-apiofc.vercel.app/tools/ssweb?url=${encodeURIComponent(q)}`;
    const res = await axios.get(apiUrl);
    const json = res.data;

    if (!json.status || !json.data || !json.data.download) {
      throw new Error("Failed to get screenshot URL");
    }

    const imageUrl = json.data.download;
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.buffer();

    return await sendScreenshot(imageBuffer);

  } catch (error) {
    console.error(error);
    reply("❌ Failed to capture the screenshot. Please try again later.");
  }
});
