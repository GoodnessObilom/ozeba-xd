const axios = require("axios");
const { cmd } = require("../command");
const yts = require("yt-search");

cmd({
  pattern: "song",
  alias: ["play", "mp3", "ytmp3"],
  desc: "Download YouTube audio by search or URL",
  category: "main",
  use: "<song name or YouTube URL>",
  filename: __filename
}, async (conn, mek, m, { text, command }) => {
  
  const chat = mek.key.remoteJid;

  if (!text) {
    return await conn.sendMessage(chat, {
      text: `❗ Please provide a search query or YouTube URL.\nExample: .${command} Rema - OZEBA`
    }, { quoted: mek });
  }

  try {
    // React with 🎧 emoji
    await conn.sendMessage(chat, {
      react: { text: "🎧", key: m.key }
    });

    let videoUrl = text;
    let title = null;

    // If not a YouTube URL, search with yts to get URL & title
    if (!/(youtube\.com|youtu\.be)/i.test(text)) {
      const search = await yts(text);
      if (!search.videos.length) {
        return await conn.sendMessage(chat, {
          text: "❌ No matching videos found on YouTube."
        }, { quoted: mek });
      }
      const video = search.videos[0];
      videoUrl = video.url;
      title = video.title;

      // Send found title message and "getting audio" note
      await conn.sendMessage(chat, {
        text: `✅ Found: *${title}*\n🎧 Getting audio, please wait...`
      }, { quoted: mek });
    }

    // If input is a URL, skip sending any "getting audio" message and proceed silently

    // Call the new API with the video URL
    const apiUrl = `https://api.nekoo.qzz.io/downloader/savetube?url=${encodeURIComponent(videoUrl)}&format=mp3`;
    const res = await axios.get(apiUrl);
    const json = res.data;

    if (!json.status || !json.result?.download) {
      return await conn.sendMessage(chat, {
        text: `❌ Failed to retrieve audio.`
      }, { quoted: mek });
    }

    const { title: apiTitle, download: audioUrl } = json.result;

    // Use title from API if we didn't get it earlier
    if (!title) title = apiTitle;

    // Send audio file only
    await conn.sendMessage(chat, {
      audio: { url: audioUrl },
      mimetype: "audio/mpeg",
      fileName: `${title}.mp3`,
      ptt: false
    }, { quoted: mek });

  } catch (err) {
    console.error("Fatal .song error:", err);
    await conn.sendMessage(chat, {
      text: `*USE COMMAND PLAY2 INSTEAD*\n❌ Error: ${err.message || err}`
    }, { quoted: mek });
  }
});
