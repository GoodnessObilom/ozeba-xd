const { cmd } = require('../command');

cmd({
    pattern: "demote",
    alias: ["d", "dismiss", "removeadmin"],
    desc: "Demotes a group admin to a normal member",
    category: "admin",
    filename: __filename,
    use: "<number>"
},
async (conn, mek, m, {
    from, quoted, q, isGroup, sender, botNumber, isBotAdmins, isAdmins, reply
}) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "💙",
            key: m.key
        }
    });

    if (!isGroup) return reply("❌ This command can only be used in groups.");
    if (!isAdmins) return reply("❌ Only group admins can use this command.");
    if (!isBotAdmins) return reply("❌ I need to be an admin to use this command.");

    // Determine the user to demote
    let user = m.mentionedJid?.[0]
        || m.quoted?.sender
        || (q ? (q.replace(/[^0-9]/g, '') + '@s.whatsapp.net') : null);

    if (!user) {
        return reply("❌ Please tag, reply, or provide a number to demote.");
    }

    if (user.split('@')[0] === botNumber.split('@')[0]) {
        return reply("❌ The bot cannot demote itself.");
    }

    try {
        await conn.groupParticipantsUpdate(from, [user], "demote");

        // Create proper mention message
        const mentionText = `✅ Successfully demoted @${user.split('@')[0]} to a normal member.`;
        await conn.sendMessage(from, {
            text: mentionText,
            mentions: [user]
        });
    } catch (error) {
        console.error("Demote command error:", error);
        let errorMessage = "❌ Failed to demote the member.";
        if (error?.data === 500) {
            errorMessage = "❌ Server error. This may be a LID user or WhatsApp limitation.";
        }
        reply(errorMessage);
    }
});