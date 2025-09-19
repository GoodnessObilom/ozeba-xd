const { cmd } = require('../command');

cmd({
    pattern: "out",
    alias: ["ck", "🦶"],
    desc: "Removes all members with specific country code from the group",
    category: "admin",
    filename: __filename
},
async (conn, mek, m, {
    from, q, isGroup, isBotAdmins, reply, groupMetadata, senderNumber
}) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "❌",
            key: m.key
        }
    });

    if (!isGroup) return reply("❌ This command can only be used in groups.");

    const botOwner1 = conn.user.id.split(":")[0];
    const botOwner2 = conn.user.lid ? conn.user.lid.split(":")[0] : null;

    if (senderNumber !== botOwner1 && senderNumber !== botOwner2) {
        return reply("❌ Only group admins can use this command.");
    }

    if (!isBotAdmins) return reply("❌ I need to be an admin to use this command.");
    if (!q) return reply("❌ Please provide a country code. Example: .out 234");

    const countryCode = q.trim();
    if (!/^\d+$/.test(countryCode)) {
        return reply("❌ Invalid country code. Please provide only numbers (e.g., 234 for +234 numbers)");
    }

    try {
        const participants = groupMetadata?.participants;
        if (!participants) return reply("❌ Couldn't fetch group participants.");

        const targets = participants.filter(p => 
            p.id && p.id.split('@')[0].startsWith(countryCode) && 
            !p.admin
        );

        if (targets.length === 0) {
            return reply(`❌ No members found with country code +${countryCode}`);
        }

        for (const target of targets) {
            await conn.groupParticipantsUpdate(from, [target.id], "remove");
            await new Promise(res => setTimeout(res, 1500)); // Delay to prevent rate-limiting
        }

        reply(`✅ Successfully removed ${targets.length} member(s) with country code +${countryCode}`);
    } catch (error) {
        console.error("Out command error:", error);
        reply("❌ Failed to remove members. Error: " + error.message);
    }
});
