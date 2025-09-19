const { cmd } = require("../command");
const { enableLinkDetection, disableLinkDetection, getLinkDetectionMode } = require("../lib/linkDetection");
const { handleLinkDetection } = require("../lib/linkDetectionHandler");
const { getWarnings, addWarning, resetWarnings } = require("../lib/warnings");
const config = require('../config');

// Existing antilink command
cmd({
    pattern: "antilink",
    desc: "Manage anti-link settings in a group.",
    category: "group",
    filename: __filename,
    use: "[kick/delete/warn/off]"
}, async (conn, mek, m, { from, args, isGroup, reply, isAdmins, isBotAdmins }) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "🔒",
            key: m.key
        }
    });
    if (!isGroup) return reply("*{ᴀᴄᴄᴇss ᴅᴇɴɪᴇᴅ}*\nᴛʜɪs ғᴇᴀᴛᴜʀᴇ ᴄᴀɴ ᴏɴʟʏ ʙᴇ ᴜsᴇᴅ ɪɴ ɢʀᴏᴜᴘ!!");
    if (!isAdmins) return reply("*{ᴀᴄᴄᴇss ᴅᴇɴɪᴇᴅ}*\nᴛʜɪs ғᴇᴀᴛᴜʀᴇ ɪs ғᴏʀ bot owner ᴏɴʟʏ!!");
    if (!isBotAdmins) return reply("❌ I need to be an admin to perform this action.");

    const mode = args.length > 0 ? args[0].toLowerCase() : null;
    if (!mode || !["kick", "delete", "warn", "off"].includes(mode)) {
        return reply("*Usage: antilink [kick/delete/warn/off]*");
    }

    try {
        if (mode === "off") {
            const { message } = disableLinkDetection(from);
            return reply(`*${message}*`);
        }

        const { message } = enableLinkDetection(from, mode);
        return reply(`*${message}*`);
    } catch (error) {
        return reply(`*Error: ${error.message}*`);
    }
});

// New command: warn a user by replying to their message
cmd({
    pattern: "warn",
    desc: "Warn a specific user. After 3 warnings, the user will be kicked.",
    category: "group",
    filename: __filename,
    use: "<reply to user>"
}, async (conn, mek, m, { from, isGroup, isPatron, isAdmins, isBotAdmins, reply }) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "🔒",
            key: m.key
        }
    });
    if (!isGroup) return reply("❌ *Access Denied!*\n> This command can only be used in groups.");
    
    if (!isAdmins && !isPatron) return reply("❌ *Access Denied!*\n> Only *owners* can issue warnings.");
    if (!isBotAdmins) return reply("❌ I need to be an admin to use this command.");

    if (!m.quoted) return reply("⚠️ *Please reply to a user's message to warn them.*");

    const participant = m.quoted.sender;
    if (!participant) return reply("❌ *Unable to identify the user to warn.*");

    if (participant.split('@')[0] === "2348065623101") {
        return reply("🚫 *Action Blocked!*\n> You cannot warn the bot creator.");
    }

    try {
        // Attempt to delete the warned message
        if (m.quoted.key) {
            await conn.sendMessage(from, { delete: m.quoted.key });
        }
    } catch (error) {
        console.error("Error deleting message:", error);
        await reply(`⚠️ *Failed to delete the message.*\n> ${error.message}`);
    }

    const username = "@" + participant.split("@")[0];
    const count = addWarning(from, participant);

    if (count >= 3 && isBotAdmins) {
        try {
            await conn.groupParticipantsUpdate(from, [participant], "remove");
            resetWarnings(from, participant);
            return reply(`⚠️ *${username} has received 3 warnings and has been removed from the group.*`);
        } catch (err) {
            return reply(`❌ *Failed to remove ${username}.*\n> ${err.message}`);
        }
    } else if (count >= 3) {
        return reply(`⚠️ *${username} has received 3 warnings but I'm not an admin to remove them.*`);
    }

    return reply(`⚠️ *${username} has been warned.*\n> Total warnings: *${count}/3*`);
});

cmd({
    pattern: "resetwarn",
    desc: "Reset warnings for a specific user.",
    category: "group",
    filename: __filename,
    use: "<reply to user>"
}, async (conn, mek, m, { from, isGroup, isPatron, isAdmins, isBotAdmins, reply }) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "🔒",
            key: m.key
        }
    });
    if (!isGroup) return reply("❌ *Access Denied!*\n> This command can only be used in groups.");
    
 
    if (!isAdmins && !isPatron) return reply("❌ *Access Denied!*\n> Only *owners* can reset warnings.");
        if (!isBotAdmins) return reply("❌ I need to be an admin to use this command.");
    if (!m.quoted) return reply("⚠️ *Please reply to the user whose warnings you want to reset.*");

    const participant = m.quoted.sender;
    if (!participant) return reply("❌ *Unable to identify the user to reset.*");

    if (participant.split('@')[0] === "2348065623101") {
        return reply("🚫 *Action Blocked!*\n> You cannot reset warnings for the bot creator.");
    }

    const username = "@" + participant.split("@")[0];
    resetWarnings(from, participant);

    return reply(`✅ *Warnings reset for ${username}.*`);
});
