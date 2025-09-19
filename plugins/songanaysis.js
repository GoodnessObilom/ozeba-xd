const { cmd } = require('../command');
const fetch = require('node-fetch');
const axios = require('axios');
const FormData = require('form-data');

/**
 * Uploads file to Catbox and returns direct link
 */
async function uploadToCatbox(form) {
    const maxRetries = 3;
    const timeout = 30000; // 30 seconds

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await axios.post("https://catbox.moe/user/api.php", form, {
                headers: form.getHeaders(),
                timeout: timeout,
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            });

            if (!response.data) throw new Error("Empty response from Catbox");
            if (attempt > 1) console.log(`✅ Uploaded on attempt ${attempt}`);
            return response.data;
        } catch (error) {
            console.log(`❌ Upload attempt ${attempt} failed: ${error.message}`);
            if (attempt === maxRetries) throw new Error(`Failed to upload after ${maxRetries} attempts: ${error.message}`);
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }
}

cmd({
    pattern: "songscan",
    alias: ["songid", "scansong", "songidentify"],
    desc: "Identify song from TikTok, Instagram, YouTube, Facebook link, or from replied audio/video.",
    category: "tools",
    use: "<link or reply to media>",
    filename: __filename
}, async (conn, mek, m, { q, reply }) => {
    try {
        let mediaUrl = q;

        // If user replied to audio/video, upload to Catbox
        if (!mediaUrl && m.quoted && (m.quoted.mtype === 'audioMessage' || m.quoted.mtype === 'videoMessage')) {
            reply("⏳ Uploading media to Catbox...");
            const mediaBuffer = await m.quoted.download();
            const form = new FormData();
            form.append("reqtype", "fileupload");
            form.append("fileToUpload", mediaBuffer, {
                filename: m.quoted.mtype === 'audioMessage' ? "audio.mp3" : "video.mp4"
            });
            mediaUrl = await uploadToCatbox(form);
        }

        if (!mediaUrl) return reply(`🎧 *Usage:*\n.songscan <media_url>\n\nSend a TikTok, Instagram, YouTube, or Facebook link, or reply to an audio/video to identify the song 🎵`);

        reply("⏳ Identifying song...");

        // Call JerryCoder Song Identifier API
        const api = `https://jerrycoderr.onrender.com/identify?url=${encodeURIComponent(mediaUrl)}`;
        const res = await fetch(api);
        const json = await res.json();

        if (json.status !== 'success') throw json.msg || 'Song not found';

        const { title, artist, image, shazam_url } = json.result;
        const caption = `✅ *Song Identified!*\n\n🎵 *Title:* ${title}\n👤 *Artist:* ${artist}\n🔗 [Shazam Link](${shazam_url})\n\n🧠 POWERED BY GOODNESS TECH`;

        await conn.sendMessage(m.chat, {
            image: { url: image },
            caption
        }, { quoted: m });

    } catch (e) {
        reply(`❌ Failed to identify song:\n${e.message || e}`);
    }
});
