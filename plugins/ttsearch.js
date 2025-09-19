const {cmd , commands} = require('../command')
const fetch = require('node-fetch');

cmd({
    pattern: "ttsearch",
    alias: ["tiktoksearch"],
    desc: "Search and download TikTok video",
    category: "main",
    use: "<query>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    if (!q) return reply("Please provide a search keyword.\nExample: .ttsearch Chaewoon");

    await conn.sendMessage(from, {
        react: {
            text: "🎥",
            key: m.key
        }
    });

    try {
        const api = `https://delirius-apiofc.vercel.app/search/tiktoksearch?query=${encodeURIComponent(q)}`;
        const res = await fetch(api);
        const json = await res.json();

        if (!json.meta || !json.meta.length) {
            return reply("No TikTok videos found for your query.");
        }

        const video = json.meta[0];

        const caption = `🎬 *${video.title}*\n👤 Author: @${video.author.username} (${video.author.nickname})\n❤️ Likes: ${video.like}\n▶️ Views: ${video.play}\n\n© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘᴀᴛʀᴏɴTᴇᴄʜＸ`;

        await conn.sendMessage(from, {
            video: { url: video.hd },
            caption,
            mimetype: "video/mp4"
        }, { quoted: mek });

    } catch (err) {
        console.error(err);
        reply("Failed to fetch TikTok video. Please try again.");
    }
});
