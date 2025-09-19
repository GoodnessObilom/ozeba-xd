const config = require('../config');
const { cmd } = require('../command');
const axios = require('axios');

cmd({
  on: "body"
}, async (conn, m, { isGroup }) => {
  try {
    if (config.MENTION_REPLY !== 'true' || !isGroup) return;
    if (!m.mentionedJid || m.mentionedJid.length === 0) return;

    const voiceClips = [
      "https://github.com/GoodnessObilom/ozeba-files/blob/main/ozeba.mp3",
      "https://github.com/GoodnessObilom/ozeba-files/blob/main/ozeba.mp3",
      "https://github.com/GoodnessObilom/ozeba-files/blob/main/ozeba.mp3",
      "https://github.com/GoodnessObilom/ozeba-files/blob/main/ozeba.mp3",
      "https://github.com/GoodnessObilom/ozeba-files/blob/main/ozeba.mp3",
      "https://github.com/GoodnessObilom/ozeba-files/blob/main/ozeba.mp3",
      "https://github.com/GoodnessObilom/ozeba-files/blob/main/ozeba.mp3",
      "https://github.com/GoodnessObilom/ozeba-files/blob/main/ozeba.mp3",
      "https://github.com/GoodnessObilom/ozeba-files/blob/main/ozeba.mp3",
      "https://cdn.ironman.my.id/i/gg5jct.mp4"
    ];

    const randomClip = voiceClips[Math.floor(Math.random() * voiceClips.length)];
    const botNumber = conn.user.id.split(":")[0] + '@s.whatsapp.net';

    if (m.mentionedJid.includes(botNumber)) {
      const thumbnailRes = await axios.get('https://files.catbox.moe/3m1vb1.png', {
        responseType: 'arraybuffer'
      });
      const thumbnailBuffer = Buffer.from(thumbnailRes.data, 'binary');

      await conn.sendMessage(m.chat, {
        audio: { url: randomClip },
        mimetype: 'audio/mp4',
        ptt: true,
        waveform: [99, 0, 99, 0, 99],
        contextInfo: {
          forwardingScore: 2,
          isForwarded: true,
          externalAdReply: {
            title: config.BOT_NAME || "𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡 🥀",
            body: config.DESCRIPTION || "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ",
            mediaType: 1,
            renderLargerThumbnail: true,
            thumbnail: thumbnailBuffer,
            mediaUrl: "https://files.catbox.moe/3m1vb1.png", // Static image URL
            sourceUrl: "https://wa.me/2348065623101",
            showAdAttribution: true
          }
        }
      }, { quoted: m });
    }
  } catch (e) {
    console.error(e);
    const ownerJid = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    await conn.sendMessage(ownerJid, {
      text: `*Bot Error in Mention Handler:*\n${e.message}`
    });
  }
});
