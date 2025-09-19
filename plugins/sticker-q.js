const axios = require("axios");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const { getBuffer } = require("../lib/functions"); // or your correct path
const config = require("../config");
const { cmd } = require('../command');

cmd({
  pattern: "quoted",
  desc: "Makes a sticker from quoted text or inline text.",
  alias: ["q", "qc"],
  category: "tools",
  use: "<reply to any message or write text>",
  filename: __filename
}, async (conn, mek, m, { from, isPatron, q, quoted, body, reply }) => {
  try {
    if (!isPatron) return reply("*❌ Only the bot owner can use this command.*");

    const textToQuote = m.quoted?.text || m.quoted?.body || q;
    if (!textToQuote) return reply("_❌ Provide or reply to a message with text._");

    const senderId = m.quoted?.sender || m.sender;
    const profilePic = await conn.profilePictureUrl(senderId, "image")
      .catch(() => "https://files.catbox.moe/wpi099.png");

    const username = m.pushName || (await conn.getName(senderId));

    const payload = {
      type: "quote",
      format: "png",
      backgroundColor: "#FFFFFF",
      width: 512,
      height: 512,
      scale: 3,
      messages: [
        {
          avatar: true,
          from: {
            first_name: username,
            language_code: "en",
            name: username,
            photo: { url: profilePic },
          },
          text: textToQuote,
          replyMessage: {},
        },
      ],
    };

    const res = await axios.post("https://bot.lyo.su/quote/generate", payload);
    const imageBuffer = await getBuffer("data:image/png;base64," + res.data.result.image);

    const sticker = new Sticker(imageBuffer, {
      pack: config.STICKER_NAME || "OZEBA-XD",
      author: username,
      type: StickerTypes.FULL,
      quality: 75,
    });

    const buffer = await sticker.toBuffer();
    await conn.sendMessage(m.chat, { sticker: buffer }, { quoted: mek });

  } catch (e) {
    console.error("Quotely error:", e);
    return reply(`❌ *Quotely Error:* ${e.message}`);
  }
});