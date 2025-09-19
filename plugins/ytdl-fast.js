const config = require('../config');
const { cmd } = require('../command');
const yts = require('yt-search');
const fetch = require("node-fetch");
const axios = require("axios");
const path = require("path");

// === VIDEO DOWNLOADER ===

cmd({
  pattern: "video",
  alias: ["searchvideo", "ytdlvideo", "ytmp4", "mp4"],
  desc: "Download YouTube video",
  category: "main",
  use: "<YouTube URL or search term>",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    await conn.sendMessage(from, { react: { text: "🎥", key: m.key } });

    if (!q) return reply("❌ Please provide a YouTube URL or search term.");

    let ytUrl = q;

    // Search YouTube if input is not a direct link
    if (!/(youtube\.com|youtu\.be)/i.test(q)) {
      const search = await yts(q);
      if (!search.videos?.length) return reply("❌ No results found on YouTube.");
      ytUrl = search.videos[0].url;
    }

    // Use the new David Cyril Tech API
    const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp4?url=${encodeURIComponent(ytUrl)}`;
    const res = await axios.get(apiUrl);
    const data = res.data;

    if (!data.status || !data.result || !data.result.url) {
      return reply("❌ Could not fetch video. Try again with a different query.");
    }

    const { title, url: videoUrl } = data.result;

    await reply(`📥 Downloading: *${title}*`);

    await conn.sendMessage(from, {
      video: { url: videoUrl },
      mimetype: "video/mp4",
      caption: `🎬 ${title}`
    }, { quoted: mek });

  } catch (e) {
    console.error("[video command error]", e);
    reply("❌ An error occurred: " + (e.message || e));
  }
});

// === MP3 DOWNLOADER ===

cmd({
  pattern: "play2",
  alias: ["music"],
  desc: "Download YouTube song",
  category: "main",
  use: "<YouTube URL or search term>",
  filename: __filename
}, async (conn, mek, m, { from, sender, reply, q }) => {
  try {
    if (!q) return reply("❌ Please provide a YouTube link or search term.");

    await conn.sendMessage(from, {
      react: { text: "🎶", key: m.key }
    });

    let ytUrl = q;

    // If not a direct YouTube link, search first
    if (!q.includes("youtube.com") && !q.includes("youtu.be")) {
      const search = await yts(q);
      if (!search.videos || search.videos.length === 0) {
        return reply("❌ No results found on YouTube.");
      }
      ytUrl = search.videos[0].url;
    }

    // Use new API with the YouTube URL
    const apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(ytUrl)}`;
    const res = await axios.get(apiUrl);
    const data = res.data;

    if (data.status !== 200 || !data.success || !data.result?.download_url) {
      return reply("❌ Unable to download audio. Make sure the link is correct.");
    }

    const { title, download_url: media, quality } = data.result;

    await reply(`✅ Found: *${title}* `);

    await conn.sendMessage(from, {
      audio: { url: media },
      mimetype: "audio/mpeg",
      fileName: `${title}.mp3`,
      ptt: false
    }, { quoted: mek });

  } catch (err) {
    console.error("[song error]", err);
    return reply("*USE COMMAND PLAY3 INSTEAD*\n❌ An error occurred. Please try again later.\n" + (err.message || err));
  }
});
