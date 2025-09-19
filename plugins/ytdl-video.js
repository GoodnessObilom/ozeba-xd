const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

cmd({
  pattern: "ytv", 
  alias: ["video2"],
  desc: "Download video from YouTube",
  category: "download",
  use: "<YouTube URL or search term>",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    await conn.sendMessage(from, { react: { text: "🎥", key: m.key } });

    if (!q) return reply("❌ Please provide a YouTube URL or search term.");

    let ytUrl = q.trim();

    // If input is not a direct YouTube link, search and get the first video URL
    if (!/(youtube\.com|youtu\.be)/i.test(ytUrl)) {
      const search = await yts(ytUrl);
      if (!search.videos?.length) return reply("❌ No results found on YouTube.");
      ytUrl = search.videos[0].url;
    }

    const apiUrl = `https://api.siputzx.my.id/api/d/savefrom?url=${encodeURIComponent(ytUrl)}&type=video`;
    const res = await axios.get(apiUrl);
    const data = res.data;

    if (!data.status || !data.data || !data.data.length) {
      return reply("❌ Could not fetch video data. Try another link or search.");
    }

    // Pick first video result
    const videoInfo = data.data[0];
    const { title, url: downloadUrl, quality } = videoInfo;

    await reply(`📥 Downloading: *${title}* (${quality}p)`);

    // Send video as URL stream (WhatsApp supports URLs)
    await conn.sendMessage(from, {
      video: { url: downloadUrl },
      mimetype: "video/mp4",
      caption: `🎬 ${title} (${quality}p)`
    }, { quoted: mek });

  } catch (error) {
    console.error("[video command error]", error);
    reply("❌ An error occurred: " + (error.message || error));
  }
});
