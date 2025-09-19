const { cmd } = require('../command');

cmd({
    pattern: "remove",
    alias: ["kick", "k", "fling"],
    desc: "Removes a member from the group",
    category: "admin",
    react: "❌",
    use: " <@user or reply>",
    filename: __filename
},
async (conn, mek, m, {
    from, q, isGroup, isBotAdmins, reply, quoted, isAdmins, senderNumber
}) => {
    if (!isGroup) return reply("❌ This command can only be used in groups.");

    const botOwner1 = conn.user.id.split(":")[0];
    const botOwner2 = conn.user.lid ? conn.user.lid.split(":")[0] : null;

    if (senderNumber !== botOwner1 && senderNumber !== botOwner2) {
        return reply("❌ Only the group admins can use this command.");
    }
   
    // Check if the user is an admin
    if (!isAdmins) return reply("❌ You cannot kick an admin from the group.");

    if (!isBotAdmins) return reply("❌ I need to be an admin to use this command.");

    // New simple method for kicking
    let users = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0]
        : m.quoted?.sender
        || (q ? q.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

    if (!users) {
        return reply("❌ Please tag, reply, or provide a number to kick.");
    }

    try {
        await conn.groupParticipantsUpdate(from, [users], 'remove');
        reply("✅ Successfully kicked the user from the group.");
    } catch (e) {
        reply("❌ Failed to kick user. Maybe I'm not allowed or user is an admin");
    }
});