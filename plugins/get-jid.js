const { cmd } = require('../command');

cmd({
    pattern: "jid",
    alias: ["id", "chatid"],  
    desc: "Get full JID of current chat/user (Creator Only)",
    category: "utility",
    filename: __filename,
}, async (conn, mek, m, { 
    from, isGroup, isPatron, reply, sender 
}) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "🆔",
            key: m.key
        }
    });
    try {
        if (!isPatron) {
            return reply("❌ *Command Restricted* - Only my owners can use this.");
        }

        if (isGroup) {
            // Ensure group JID ends with @g.us
            const groupJID = from.includes('@g.us') ? from : `${from}@g.us`;
            return reply(`👥 *Group JID:*\n\`\`\`${groupJID}\`\`\``);
        } else {
            // Ensure user JID ends with @s.whatsapp.net
            const userJID = sender.includes('@s.whatsapp.net') ? sender : `${sender}@s.whatsapp.net`;
            return reply(`👤 *User JID:*\n\`\`\`${userJID}\`\`\``);
        }

    } catch (e) {
        console.error("JID Error:", e);
        reply(`⚠️ Error fetching JID:\n${e.message}`);
    }
});
