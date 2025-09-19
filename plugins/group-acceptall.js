const { cmd } = require('../command');

// Command to list all pending group join requests
cmd({
    pattern: "requestlist",
    desc: "Shows pending group join requests",
    category: "group",
    filename: __filename,
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        await conn.sendMessage(from, {
            react: { text: '⏳', key: m.key }
        });

        if (!isGroup) {
            await conn.sendMessage(from, {
                react: { text: '❌', key: m.key }
            });
            return reply("❌ This command can only be used in groups.");
        }
        if (!isAdmins) {
            await conn.sendMessage(from, {
                react: { text: '❌', key: m.key }
            });
            return reply("❌ Only group admins can use this command.");
        }
        if (!isBotAdmins) {
            await conn.sendMessage(from, {
                react: { text: '❌', key: m.key }
            });
            return reply("❌ I need to be an admin to view join requests.");
        }

        const requests = await conn.groupRequestParticipantsList(from);
        
        if (requests.length === 0) {
            await conn.sendMessage(from, {
                react: { text: '💙', key: m.key }
            });
            return reply("💙 No pending join requests.");
        }

        let text = `📋 *Pending Join Requests (${requests.length})*\n\n`;
        requests.forEach((user, i) => {
            text += `${i+1}. @${user.jid.split('@')[0]}\n`;
        });

        await conn.sendMessage(from, {
            react: { text: '✅', key: m.key }
        });
        return reply(text, { mentions: requests.map(u => u.jid) });
    } catch (error) {
        console.error("Request list error:", error);
        await conn.sendMessage(from, {
            react: { text: '❌', key: m.key }
        });
        return reply("❌ Failed to fetch join requests.");
    }
});

// ✅ Accept All Join Requests
cmd({
    pattern: "acceptall",
    alias: ["approve"],
    desc: "Accepts all pending group join requests",
    category: "group",
    filename: __filename,
    use: ".acceptall"
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        if (!isGroup) return reply("❌ This command can only be used in groups.");
        if (!isAdmins) return reply("❌ Only group admins can use this command.");
        if (!isBotAdmins) return reply("❌ I need to be an admin to accept join requests.");

        if (typeof conn.groupRequestParticipantsList !== "function") {
            return reply("❌ Your Baileys version does not support join request listing. Please update the bot.");
        }

        const requests = await conn.groupRequestParticipantsList(from);
        if (!requests || requests.length === 0) {
            return reply("💙 No pending join requests to approve.");
        }

        const jids = requests.map(u => u.jid).filter(jid => typeof jid === 'string' && jid.includes('@'));

        for (const jid of jids) {
            try {
                await conn.groupRequestParticipantsUpdate(from, [jid], "approve");
                await new Promise(r => setTimeout(r, 500)); // Prevent rate limit
            } catch (e) {
                console.error(`[❌ ERROR] Failed to approve ${jid}:`, e.message);
            }
        }

        await conn.sendMessage(from, { react: { text: '👍', key: m.key } });
        return reply(`✅ Approved ${jids.length} join request(s):\n\n${jids.join("\n")}`);

    } catch (error) {
        console.error("[❌ ERROR] AcceptAll failed:", error);
        return reply("❌ Failed to accept join requests.\n\nError: ```" + (error?.message || error.stack) + "```");
    }
});


// ❌ Reject All Join Requests
cmd({
    pattern: "rejectall",
    alias: ["reject", "unapprove"],
    desc: "Rejects all pending group join requests",
    category: "group",
    filename: __filename,
    use: ".rejectall"
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        if (!isGroup) return reply("❌ This command can only be used in groups.");
        if (!isAdmins) return reply("❌ Only group admins can use this command.");
        if (!isBotAdmins) return reply("❌ I need to be an admin to reject join requests.");

        if (typeof conn.groupRequestParticipantsList !== "function") {
            return reply("❌ Your Baileys version does not support join request listing. Please update the bot.");
        }

        const requests = await conn.groupRequestParticipantsList(from);
        if (!requests || requests.length === 0) {
            return reply("💙 No pending join requests to reject.");
        }

        const jids = requests.map(u => u.jid).filter(jid => typeof jid === 'string' && jid.includes('@'));

        for (const jid of jids) {
            try {
                await conn.groupRequestParticipantsUpdate(from, [jid], "reject");
                await new Promise(r => setTimeout(r, 500)); // Prevent rate limit
            } catch (e) {
                console.error(`[❌ ERROR] Failed to reject ${jid}:`, e.message);
            }
        }

        await conn.sendMessage(from, { react: { text: '👎', key: m.key } });
        return reply(`✅ Rejected ${jids.length} join request(s):\n\n${jids.join("\n")}`);

    } catch (error) {
        console.error("[❌ ERROR] RejectAll failed:", error);
        return reply("❌ Failed to reject join requests.\n\nError: ```" + (error?.message || error.stack) + "```");
    }
});
