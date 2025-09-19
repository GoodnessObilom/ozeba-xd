const axios = require('axios');
const { cmd } = require('../command');

cmd({
  pattern: "lyrics",
  alias: ["lyric"],
  desc: "Get song lyrics from new API",
  category: "music",
  use: "<song title>",
}, async (conn, mek, m, { text, prefix, command, reply }) => {
  if (!text) return reply(`❌ Please provide a song title.\nExample: *${prefix + command} robbery*`);

  // React with 📜 emoji
  await conn.sendMessage(m.key.remoteJid, {
    react: {
      text: "📜",
      key: m.key
    }
  });

  const query = encodeURIComponent(text);
  const url = `https://delirius-apiofc.vercel.app/search/lyrics?query=${query}`;

  try {
    const res = await axios.get(url);
    const json = res.data;

    if (!json.status || !json.data || !json.data.lyrics) {
      return reply("❌ Lyrics not found.");
    }

    const { title, artists, url: songUrl, lyrics, image } = json.data;

    let message = 
      `🎵 *${title}*\n` +
      `👤 Artist: ${artists}\n` +
      `🔗 [Musixmatch Link](${songUrl})\n` +
      `🖼️ Album Art: ${image}\n\n` +
      `📄 *Lyrics:*\n${lyrics.trim()}\n\n` +
      `*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ*`;

    await reply(message);

  } catch (err) {
    console.error(err);
    reply("❌ Failed to fetch lyrics. Try again later.");
  }
});
