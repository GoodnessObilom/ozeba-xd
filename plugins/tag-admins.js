const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions')

cmd({
    pattern: "tagadmins",
    alias: ["tagadmin"],
    desc: "To Tag all Admins of the Group",
    category: "group",
    use: '.tagadmins [message]',
    filename: __filename
},
async (conn, mek, m, { from, participants, reply, isGroup, senderNumber, groupAdmins, prefix, command, args, body, isPatron, isBotAdmins, text }) => {

    // 👑 React to the command message
    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "👑",
            key: m.key
        }
    });

    try {
        // ✅ Must be used in group
        if (!isGroup) return reply("❌ This command can only be used *in a group chat*.");

        // ✅ Only group admins allowed
        if (!isPatron) return reply("❌ Only *bot owners* can use this command.");

        const botOwner = conn.user.id.split(":")[0];
        const senderJid = senderNumber + "@s.whatsapp.net";

        // ✅ Get group metadata
        let groupInfo = await conn.groupMetadata(from).catch(() => null);
        if (!groupInfo) return reply("❌ Failed to fetch group information.");

        let groupName = groupInfo.subject || "Unknown Group";
        let admins = await getGroupAdmins(participants);
        let totalAdmins = admins ? admins.length : 0;
        if (totalAdmins === 0) return reply("❌ No admins found in this group.");

        // Random emoji for mentions
        let emojis = ['👑', '⚡', '🌟', '✨', '🎖️', '💎', '🔱', '🛡️', '🚀', '🏆'];
        let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        // Get custom message or use default
        let message = body.slice(body.indexOf(command) + command.length).trim();
        if (!message) message = "Attention Admins";

        // Prepare message
        let teks = `▢ Group : *${groupName}*\n▢ Admins : *${totalAdmins}*\n▢ Message: *${message}*\n\n┌───⊷ *ADMIN MENTIONS*\n`;

        for (let admin of admins) {
            if (!admin) continue;
            teks += `${randomEmoji} @${admin.split('@')[0]}\n`;
        }

        teks += "└── OZEBA XD OFFICIAL ──";

        // Send message with mentions
        conn.sendMessage(from, { text: teks, mentions: admins }, { quoted: mek });

    } catch (e) {
        console.error("TagAdmins Error:", e);
        reply(`❌ *Error Occurred !!*\n\n${e.message || e}`);
    }
});
