const { fetchJson } = require("../lib/functions");
const { downloadTiktok } = require("@mrnima/tiktok-downloader");
const { facebook } = require("@mrnima/facebook-downloader");
const cheerio = require("cheerio");
const { igdl } = require("ruhend-scraper");
const axios = require("axios");
const { cmd, commands } = require('../command');
const fetch = require('node-fetch');
const fs = require("fs");
const path = require("path");

cmd({
  pattern: "ig",
  alias: ["insta", "Instagram"],
  desc: "To download Instagram videos.",
  category: "download",
  filename: __filename,
  use: "<Instagram video link>"
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q || !q.startsWith("http")) {
      return reply("❌ Please provide a valid Instagram link.");
    }

    await conn.sendMessage(from, {
      react: { text: "⏳", key: m.key }
    });

    const response = await axios.get(`https://delirius-apiofc.vercel.app/download/instagram?url=${encodeURIComponent(q)}`);
    const json = response.data;

    if (!json || json.status !== true || !json.data?.length || !json.data[0]?.url) {
      return reply("⚠️ Failed to fetch Instagram video. Please check the link and try again.");
    }

    await conn.sendMessage(from, {
      video: { url: json.data[0].url },
      mimetype: "video/mp4",
      caption: "📥 *Instagram Video Downloaded Successfully!*\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ*"
    }, { quoted: m });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while processing your request. Please try again.");
  }
});




cmd({
  pattern: "twitter",
  alias: ["tweet", "twdl", "x"],
  desc: "Download Twitter videos",
  category: "download",
  filename: __filename,
  use: "<Twitter video link>"
}, async (conn, m, store, {
  from,
  quoted,
  q,
  reply
}) => {
  try {
    if (!q || !q.startsWith("https://")) {
      return conn.sendMessage(from, { text: "❌ Please provide a valid Twitter URL." }, { quoted: m });
    }

    await conn.sendMessage(from, {
      react: { text: '⏳', key: m.key }
    });

    const response = await axios.get(`https://www.dark-yasiya-api.site/download/twitter?url=${encodeURIComponent(q)}`);
    const data = response.data;

    if (!data || !data.status || !data.result) {
      return reply("⚠️ Failed to retrieve Twitter video. Please check the link and try again.");
    }

    const { desc, thumb, video_hd, video_sd, audio } = data.result;
    const videoUrl = video_hd || video_sd;
    const audioUrl = audio;
    const thumbUrl = thumb || 'https://telegra.ph/file/6b4a85b6e4e9650e6a0c6.jpg';

    if (!videoUrl) {
      return reply("⚠️ No video found in the Twitter link. It might be text-only or protected.");
    }

    const caption = `╭━━━〔 *TWITTER DOWNLOADER* 〕━━━⊷\n`
      + `┃▸ *Description:* ${desc || "No description"}\n`
      + `┃▸ *Quality:* ${video_hd ? 'HD' : video_sd ? 'SD' : 'N/A'}\n`
      + `╰━━━⪼\n\n`
      + `📹 *Download Options:*\n`
      + `1️⃣  *Video Download*\n`
      + `🎵 *Audio Options:*\n`
      + `2️⃣  *Audio*\n`
      + `3️⃣  *Document*\n`
      + `4️⃣  *Voice*\n\n`
      + `📌 *Reply with the number to download your choice.*\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘᴀᴛʀᴏɴTᴇᴄʜＸ* 🚹`;

    const sentMsg = await conn.sendMessage(from, {
      image: { url: thumbUrl },
      caption: caption
    }, { quoted: m });

    const messageID = sentMsg.key.id;
    store[messageID] = { videoUrl, audioUrl };

    conn.ev.on("messages.upsert", async (msgData) => {
      const receivedMsg = msgData.messages[0];
      if (!receivedMsg.message) return;

      const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
      const senderID = receivedMsg.key.remoteJid;
      const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

      if (isReplyToBot && store[messageID]) {
        await conn.sendMessage(senderID, {
          react: { text: '⬇️', key: receivedMsg.key }
        });

        const { videoUrl, audioUrl } = store[messageID];

        try {
          switch (receivedText) {
            case "1":
              await conn.sendMessage(senderID, {
                video: { url: videoUrl },
                caption: "📥 *Downloaded Twitter Video*"
              }, { quoted: receivedMsg });
              break;

            case "2":
              await conn.sendMessage(senderID, {
                audio: { url: audioUrl || videoUrl },
                mimetype: "audio/mp4"
              }, { quoted: receivedMsg });
              break;

            case "3":
              await conn.sendMessage(senderID, {
                document: { url: audioUrl || videoUrl },
                mimetype: "audio/mp4",
                fileName: "Twitter_Audio.mp4",
                caption: "📥 *Audio Downloaded as Document*"
              }, { quoted: receivedMsg });
              break;

            case "4":
              await conn.sendMessage(senderID, {
                audio: { url: audioUrl || videoUrl },
                mimetype: "audio/mp4",
                ptt: true
              }, { quoted: receivedMsg });
              break;

            default:
              reply("❌ Invalid option! Please reply with 1, 2, 3, or 4.");
          }
        } catch (error) {
          console.error("Download error:", error);
          reply("❌ Failed to send media. The file might be too large or corrupted.");
        } finally {
          delete store[messageID];
        }
      }
    });

  } catch (error) {
    console.error("Error:", error);
    reply(`❌ An error occurred: ${error.message || "Please try again later."}`);
  }
});


// MediaFire-dl

cmd({
  pattern: "mediafire",
  alias: ["mfire"],
  desc: "To download MediaFire files.",
  category: "download",
  filename: __filename,
  use: "<MediaFire file link>"
}, async (conn, m, store, {
  from,
  quoted,
  q,
  reply
}) => {
  await conn.sendMessage(m.key.remoteJid, {
    react: {
        text: "🎥",
        key: m.key
    }
});
  try {
    if (!q) {
      return reply("❌ Please provide a valid MediaFire link.");
    }

    await conn.sendMessage(from, {
      react: { text: "⏳", key: m.key }
    });

    const response = await axios.get(`https://www.dark-yasiya-api.site/download/mfire?url=${q}`);
    const data = response.data;

    if (!data || !data.status || !data.result || !data.result.dl_link) {
      return reply("⚠️ Failed to fetch MediaFire download link. Ensure the link is valid and public.");
    }

    const { dl_link, fileName, fileType } = data.result;
    const file_name = fileName || "mediafire_download";
    const mime_type = fileType || "application/octet-stream";

    await conn.sendMessage(from, {
      react: { text: "⬆️", key: m.key }
    });

    const caption = `╭━━━〔 *MEDIAFIRE DOWNLOADER* 〕━━━⊷\n`
      + `┃▸ *File Name:* ${file_name}\n`
      + `┃▸ *File Type:* ${mime_type}\n`
      + `╰━━━⪼\n\n`
      + `📥 *Downloading your file...*\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘᴀᴛʀᴏɴTᴇᴄʜＸ* 🚹`;

    await conn.sendMessage(from, {
      document: { url: dl_link },
      mimetype: mime_type,
      fileName: file_name,
      caption: caption
    }, { quoted: m });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while processing your request. Please try again.");
  }
});

// apk-dl

cmd({
  pattern: "apk",
  desc: "Search APK info",
  category: "download",
  filename: __filename,
  use: "<app name>"
}, async (conn, m, store, { from, quoted, q, reply }) => {
  try {
    if (!q) {
      return reply("❌ Please provide an app name to search.");
    }

    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    const apiUrl = `https://api.nekorinn.my.id/search/apkcombo?q=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.result || !data.result.length) {
      return reply(`⚠️ No results found for "${q}".`);
    }

    const app = data.result[0]; // Get first result

    const caption = `╭━━━〔 *APK Downloader* 〕━━━┈⊷
┃ 📦 *Name:* ${app.name}
┃ 👨‍💻 *Author:* ${app.author}
┃ 🌟 *Rating:* ${app.rating}
┃ 📥 *Downloads:* ${app.downloaded}
┃ 🏋 *Size:* ${app.size}
╰━━━━━━━━━━━━━━━┈⊷
🔗 *Download:* ${app.url}
🔗 *Powered by Patron-AI 🚹*`;

    await conn.sendMessage(from, {
      text: caption
    }, { quoted: m });

    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("APK Downloader Error:", error);
    reply("❌ An error occurred while fetching the APK info.");
  }
});

// mod apk dl
cmd({
  pattern: "apk2",
  alias: ["modapk"],
  desc: "Search MOD APKs",
  category: "download",
  filename: __filename,
  use: "<app name>"
}, async (conn, m, store, { from, quoted, q, reply }) => {
  try {
    if (!q) {
      return reply("❌ Please provide an app name to search.");
    }

    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    const apiUrl = `https://api.nekorinn.my.id/search/apk4free?q=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.result || !data.result.length) {
      return reply(`⚠️ No MOD APKs found for "${q}".`);
    }

    const app = data.result[0]; // First search result

    const caption = `╭━━━〔 *MOD APK Downloader* 〕━━━┈⊷
┃ 📦 *Title:* ${app.title}
┃ 👨‍💻 *Developer:* ${app.developer || "Unknown"}
┃ 🆚 *Version:* ${app.version || "N/A"}
┃ 🌟 *Rating:* ${app.rating || "N/A"}
╰━━━━━━━━━━━━━━━┈⊷
🔗 *Download:* ${app.url}
🔗 *Powered by Patron-AI 🚹*`;

    await conn.sendMessage(from, {
      image: { url: app.icon },
      caption
    }, { quoted: m });

    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("MOD APK Downloader Error:", error);
    reply("❌ An error occurred while fetching the MOD APK info.");
  }
});


// G-Drive-DL

cmd({
  pattern: "gdrive",
  alias: ["gdrive-dl", "googledrive"],
  desc: "Download Google Drive files.",
  react: "🌐",
  category: "download",
  filename: __filename,
  use: "<Google Drive file link>"
}, async (conn, m, store, {
  from,
  quoted,
  q,
  reply
}) => {
  try {
    if (!q) {
      return reply("❌ Please provide a valid Google Drive link.");
    }

    await conn.sendMessage(from, { react: { text: "⬇️", key: m.key } });

    const apiUrl = `https://api.fgmods.xyz/api/downloader/gdrive?url=${q}&apikey=mnp3grlZ`;
    const response = await axios.get(apiUrl);
    const downloadUrl = response.data.result.downloadUrl;

    if (downloadUrl) {
      await conn.sendMessage(from, { react: { text: "⬆️", key: m.key } });

      await conn.sendMessage(from, {
        document: { url: downloadUrl },
        mimetype: response.data.result.mimetype,
        fileName: response.data.result.fileName,
        caption: "*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘᴀᴛʀᴏɴTᴇᴄʜＸ* 🚹"
      }, { quoted: m });

      await conn.sendMessage(from, { react: { text: "✅", key: m.key } });
    } else {
      return reply("⚠️ No download URL found. Please check the link and try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while fetching the Google Drive file. Please try again.");
  }
});
