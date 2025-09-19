const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');

function isEnabled(value) {
    // Function to check if a value represents a "true" boolean state
    return value && value.toString().toLowerCase() === "true";
}

cmd({
    pattern: "settings",
    alias: ["setting", "allvar"],
    desc: "Settings of bot",
    category: "menu",
    filename: __filename,
}, 
async (conn, mek, m, { from, quoted, reply }) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "⤵️",
            key: m.key
        }
    });
    try {
        // Define the settings message with the correct boolean checks
        let envSettings = `╭━〔 *𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡* 〕┈⊷
┃▸╭───────────
┃▸┃๏ *ENV SETTINGS 🗿*
┃▸└───────────···๏
┃▸┃๏ *Check settingmenu for commands to change them*
╰────────────────┈⊷
╭━━〔 *Enabled Disabled* 〕━┈⊷
┇๏ *Status View:* ${isEnabled(config.AUTO_STATUS_SEEN) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Status Reply:* ${isEnabled(config.AUTO_STATUS_REPLY) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Status Reacts:* ${isEnabled(config.AUTO_STATUS_REACT) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Auto Reply:* ${isEnabled(config.AUTO_REPLY) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Auto Sticker:* ${isEnabled(config.AUTO_STICKER) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Auto Voice:* ${isEnabled(config.AUTO_VOICE) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Custom Reacts:* ${isEnabled(config.CUSTOM_REACT) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Auto React:* ${isEnabled(config.AUTO_REACT) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Anti-Link:* ${isEnabled(config.ANTI_LINK) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Anti-Bad Words:* ${isEnabled(config.ANTI_BAD) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Anti Call:* ${isEnabled(config.ANTI_CALL) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Auto Typing:* ${isEnabled(config.AUTO_TYPING) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Auto Recording:* ${isEnabled(config.AUTO_RECORDING) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Always Online:* ${isEnabled(config.ALWAYS_ONLINE) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Public Mode:* ${isEnabled(config.PUBLIC_MODE) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Read Message:* ${isEnabled(config.READ_MESSAGE) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Custom React:* ${isEnabled(config.CUSTOM_REACT) ? "Enabled ✅" : "Disabled ❌"}
╭━━〔 *Custom Settings* 〕━━┈⊷
┇๏ *Sticker Name:* ${config.STICKER_NAME || "Not Set ❌"}
┇๏ *Status Auto-Reply Msg:* ${config.AUTO_STATUS_MSG || "Not Set ❌"}
┇๏ *Custom React Emojis:* ${config.CUSTOM_REACT_EMOJIS || "Not Set ❌"}
┇๏ *Owner Number:* ${config.OWNER_NUMBER || "Not Set ❌"}
┇๏ *Owner Name:* ${config.OWNER_NAME || "Not Set ❌"}
┇๏ *Antidel Path:* ${config.ANTI_DEL_PATH || "Not Set ❌"}
╰━━━━━━━━━━━━──┈⊷
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ* `;

        // Send message with an image
        await conn.sendMessage(
            from,
            {
                image: { url: 'https://files.catbox.moe/3m1vb1.png' }, // Image URL
                caption: envSettings,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 2,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363421812440006@newsletter',
                        newsletterName: "𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡",
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

        // Send an audio file
        await conn.sendMessage(from, {
            audio: { url: 'https://github.com/GoodnessObilom/ozeba-files/raw/refs/heads/main/ozeba.mp3' }, // Audio URL
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });

    } catch (error) {
        console.log(error);
        reply(`Error: ${error.message}`);
    }
});
