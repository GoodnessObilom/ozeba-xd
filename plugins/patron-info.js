const { cmd } = require('../command');
const config = require('../config');
const prefix = config.PREFIX

cmd({
    pattern: "patron",
    alias: ["patroninfo", "patron-info", "manual"],
    desc: "Information on how to use the bot.",
    category: "setting",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const ownerNumber = '+2348065623101'; // Owner's number
        const ownerName = 'ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ'; // Owner's name

        // vCard content with clickable message link
        const vCard = 'BEGIN:VCARD\n' +
                      'VERSION:3.0\n' +
                      `FN:${ownerName}\n` +  
                      `TEL;type=CELL;type=VOICE;waid=${ownerNumber.replace('+', '')}:${ownerNumber}\n` + // WhatsApp link to message
                      'END:VCARD';

const message = 
    `🔹 *Welcome to 𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡 Bot!* *(please read all)* 🔹\n\n` +
    `*Here’s how you can make the best use of the bot (please read all):*\n\n` +
    `1️⃣ Use *${prefix}list* to get a list of available commands and their descriptions.\n` +
    `2️⃣ Use *${prefix}help* to get information about a command.\n` +
    `3️⃣ Use *${prefix}report* if you encounter any issues or if a command isn't working.\n` +
    `4️⃣ Use *${prefix}request* to suggest a new command or feature you'd like added.\n` +
    `5️⃣ *Check for more plugins. And use ${prefix}install (link) to apply plugins*\n` +
    `6️⃣ For any other inquiries, just reach out to the bot owner.\n` +
    `7️⃣ Use *${prefix}getpair* to connect your number to my bot for session id.\n` +
    `8️⃣ *Note:* The bot is constantly being updated, so keep an eye out for new features and improvements!\n\n` +
    `9️⃣ Use *${prefix}update* to update bot and use *${prefix}checkupdate* to check for available updates.\n` +
    `💡 *Also* You should share the bot with your friends and join our support channel for updates.\n` +
    `*Visit our website for more information and to get session id:* \n` +
    `*Please if you encounter any issue in a command please use ${prefix}report (command). PLEASE*` +
    `\n\n` +
    `📰 *Join our Channel* for the latest updates on new features and announcements:\n` +
    `🔗 [Join Channel](https://whatsapp.com/channel/0029VbAo2QxGE56hRCccBs19)`;

        // Send the information message
        await conn.sendMessage(from, { text: message });

        // Send the vCard with clickable message link
        await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard: vCard }]  // Updated to vCard (capital 'C')
            }
        });

    } catch (err) {
        console.error("Error in patron command:", err);
        await conn.sendMessage(from, { text: "❌ Something went wrong while retrieving the information." });
    }
});
