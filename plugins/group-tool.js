const { cmd } = require('../command');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// remove only member

cmd({
    pattern: "removemembers",
    alias: ["kickall", "endgc", "endgroup"],
    desc: "Remove all non-admin members from the group.",
    category: "group",
    filename: __filename,
},
async (conn, mek, m, {
    from, groupMetadata, groupAdmins, isBotAdmins, senderNumber, reply, isGroup
}) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "👋",
            key: m.key
        }
    });

    try {
        if (!isGroup) return reply("This command can only be used in groups.");

        const botOwner1 = conn.user.id.split(":")[0];
        const botOwner2 = conn.user.lid ? conn.user.lid.split(":")[0] : null;
        const botJID = conn.user.id;

        if (senderNumber !== botOwner1 && senderNumber !== botOwner2) {
            return reply("❌ Only group admins can use this command.");
        }

        if (!isBotAdmins) return reply("I need to be an admin to execute this command.");

        const allParticipants = groupMetadata.participants;
        // Filter out bot and owner from removal list
        const participantsToRemove = allParticipants.filter(member => 
            member.id !== botJID && 
            member.id !== `${botOwner1}@s.whatsapp.net` &&
            member.id !== `${botOwner2}@lid`
        );

        if (participantsToRemove.length === 0) {
            return reply("There are no members to remove.");
        }

        reply(`🔄 Starting mass removal: ${participantsToRemove.length} members`);
        
        let successCount = 0;
        let failCount = 0;

        // Remove participants with delay
        for (let i = 0; i < participantsToRemove.length; i++) {
            try {
                // Random delay between 2-4 seconds to avoid detection
                const delay = Math.floor(Math.random() * 2000) + 2000;
                await new Promise(resolve => setTimeout(resolve, delay));
                
                await conn.groupParticipantsUpdate(from, [participantsToRemove[i].id], "remove");
                successCount++;

                // Update progress every 5 members
                if (successCount % 5 === 0) {
                    await reply(`Progress: ${successCount}/${participantsToRemove.length} members removed...`);
                }
            } catch (e) {
                console.error(`❌ Failed to remove ${participantsToRemove[i].id}:`, e);
                failCount++;
                // Extra delay after failure
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }

        // Send final report
        await reply(`✅ Operation Complete!\n• Successfully removed: ${successCount}\n• Failed: ${failCount}`);
        
        // Wait 3 seconds before leaving
        await new Promise(resolve => setTimeout(resolve, 3000));
        await conn.groupLeave(from);

    } catch (e) {
        console.error("❌ Error during mass removal:", e);
        reply("❌ An error occurred during the operation.");
    }
});


// remove only admins
 
cmd({
    pattern: "removeadmins",
    alias: ["kickadmins", "kickall3", "deladmins"],
    desc: "Remove all admin members from the group, excluding the bot and bot owner.",
    category: "group",
    filename: __filename,
}, 
async (conn, mek, m, {
    from, isGroup, senderNumber, groupMetadata, groupAdmins, isBotAdmins, reply
}) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "🎉",
            key: m.key
        }
    });

    try {
        if (!isGroup) return reply("This command can only be used in groups.");

        const botOwner1 = conn.user.id.split(":")[0];
        const botOwner2 = conn.user.lid ? conn.user.lid.split(":")[0] : null;
        const botJID = conn.user.id;

        if (senderNumber !== botOwner1 && senderNumber !== botOwner2) {
            return reply("❌ Only group admins can use this command.");
        }

        if (!isBotAdmins) return reply("I need to be an admin to execute this command.");

        const allParticipants = groupMetadata.participants;
        const adminJIDs = groupAdmins.map(a => a.id);

        const adminParticipants = allParticipants.filter(member =>
            adminJIDs.includes(member.id) &&
            member.id !== botJID &&
            member.id !== `${botOwner1}@s.whatsapp.net` &&
            member.id !== `${botOwner2}@s.whatsapp.net`
        );

        if (adminParticipants.length === 0) {
            return reply("There are no admin members to remove (excluding bot and bot owner).");
        }

        reply(`🔄 Starting to remove ${adminParticipants.length} admin members (excluding the bot and bot owner)...`);

        for (let participant of adminParticipants) {
            try {
                await conn.groupParticipantsUpdate(from, [participant.id], "remove");
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (e) {
                console.error(`❌ Failed to remove ${participant.id}:`, e);
            }
        }

        reply("✅ Successfully removed all admin members (excluding bot and bot owner).");
    } catch (e) {
        console.error("❌ Error removing admins:", e);
        reply("❌ An error occurred while trying to remove admins.");
    }
});



