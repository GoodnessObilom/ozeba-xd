const { cmd, commands } = require('../command');
const config = require('../config');
const prefix = config.PREFIX;
const fs = require('fs');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');
const { writeFileSync } = require('fs');
const path = require('path');

cmd({
    pattern: "invite",
    alias: ["glink", "grouplink"],
    desc: "Get group invite link.",
    category: "group", // Already group
    filename: __filename,
}, async (conn, mek, m, { from, quoted, body, senderNumber, args, q, isGroup, sender, reply, isBotAdmins, isAdmins }) => {
    try {
        // Ensure this is being used in a group
        if (!isGroup) return reply("𝐓𝐡𝐢𝐬 𝐅𝐞𝐚𝐭𝐮𝐫𝐞 𝐈𝐬 𝐎𝐧𝐥𝐲 𝐅𝐨𝐫 𝐆𝐫𝐨𝐮𝐩❗");

        // Get the sender's number
            const botOwner1 = conn.user.id.split(":")[0];
const botOwner2 = conn.user.lid ? conn.user.lid.split(":")[0] : null;

if (senderNumber !== botOwner1 && senderNumber !== botOwner2) {
    return reply("❌ Only group admins can use this command.");
}
        
        // Check if the bot is an admin

        if (!isBotAdmins) return reply("*Please Promote the bot to admin ❗*");

        // Check if the sender is an admin
        if (!isAdmins) return reply("❌ Only group admins can use this command.");

        // Get the invite code and generate the link
        const inviteCode = await conn.groupInviteCode(from);
        if (!inviteCode) return reply("Failed to retrieve the invite code.");

        const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;

        // Reply with the invite link
        return reply(`*Here is your group invite link:*\n${inviteLink}\n\nUse .sendinvite to send the group link to the users dm`);
        
    } catch (error) {
        console.error("Error in invite command:", error);
        reply(`An error occurred: ${error.message || "Unknown error"}`);
    }
});

