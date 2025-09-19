const { sleep } = require('../lib/functions');
const config = require('../config')
const { cmd, commands } = require('../command')


// PatronTechX

cmd({
    pattern: "leave",
    alias: ["left", "leftgc", "leavegc"],
    desc: "Leave the group",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply
}) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "🎉",
            key: m.key
        }
    });
    try {

        if (!isGroup) {
            return reply("This command can only be used in groups.");
        }
        

            const botOwner1 = conn.user.id.split(":")[0];
const botOwner2 = conn.user.lid ? conn.user.lid.split(":")[0] : null;

if (senderNumber !== botOwner1 && senderNumber !== botOwner2) {
    return reply("❌ Only group admins can use this command.");
}

        const leaveMessage = "It has been a great time with your all guys👋 Leaving group...";
        await reply(leaveMessage);
        
        // Send leave message and wait a moment
        await sleep(1500);
            
        // Leave the group and ignore expected errors
        await conn.groupLeave(from).catch(e => {
            // Ignore common post-leave errors (item-not-found, forbidden)
            if (e.message === 'item-not-found' || 
                e.message === 'forbidden' || 
                e.data === 403 || 
                e.data === 404) {
                return;
            }
            console.error("Leave error:", e);
            throw e; // Re-throw unexpected errors
        });
    } catch (e) {
        console.error("Leave error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});


