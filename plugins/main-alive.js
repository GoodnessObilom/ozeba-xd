const { cmd } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "alive",
    alias: ["status", "online", "a"],
    desc: "Check bot is alive or not",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "⚡",
            key: m.key
        }
    });
    try {
        const status = `
╭───〔 *𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 STATUS* 〕───◉
│✨ *Bot is Active & Online!*
│
│    *use .setalive to customize*
│
│🧠 *Owner:* ${config.OWNER_NAME}
│⚡ *Version:* 1.0.0 Beta
│📝 *Prefix:* [${config.PREFIX}]
│📳 *Mode:* [${config.MODE}]
│⌛ *Uptime:* ${runtime(process.uptime())}
╰────────────────────◉
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ* `;

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/3m1vb1.png' },
            caption: status,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 2,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363421812440006@newsletter',
                    newsletterName: '𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Alive Error:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
