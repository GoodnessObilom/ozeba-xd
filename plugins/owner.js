const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "owner",
    desc: "Get owner number",
    category: "main",
    filename: __filename
},
    async (conn, mek, m, { from }) => {
        await conn.sendMessage(m.key.remoteJid, {
            react: {
                text: "✅",
                key: m.key
            }
        });
        try {
            const ownerNumber = config.OWNER_NUMBER; // Fetch owner number from config
            const ownerName = config.OWNER_NAME;     // Fetch owner name from config

            const vcard = 'BEGIN:VCARD\n' +
                'VERSION:3.0\n' +
                `FN:${ownerName}\n` +
                `TEL;type=CELL;type=VOICE;waid=${ownerNumber.replace('+', '')}:${ownerNumber}\n` +
                'END:VCARD';

            // Send the vCard
            const sentVCard = await conn.sendMessage(from, {
                contacts: {
                    displayName: ownerName,
                    contacts: [{ vcard }]
                }
            });

            // Send the owner contact message with image and audio
            await conn.sendMessage(from, {
                image: { url: 'https://files.catbox.moe/3m1vb1.png' }, // Image URL
                caption: `╭━━〔 *PATRON-MD* 〕━━┈⊷
┃◈╭─────────────·๏
┃◈┃• *Here is the owner details*
┃◈┃• *Name* - ${ownerName}
┃◈┃• *Number* ${ownerNumber}
┃◈┃• *Version*: 2.0.0 Beta
┃◈└───────────┈⊷
╰──────────────┈⊷
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ*`, // Display the owner's details
                contextInfo: {
                    mentionedJid: [`${ownerNumber.replace('+', '')}@s.whatsapp.net`],
                    forwardingScore: 2,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363421812440006@newsletter',
                        newsletterName: "𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡",
                        serverMessageId: 143
                    }
                }
            }, { quoted: mek });

            // Send audio as per your request
            await conn.sendMessage(from, {
                audio: { url: 'https://files.catbox.moe/1ekzy0.mp3' }, // Audio URL
                mimetype: 'audio/mp4',
                ptt: true
            }, { quoted: mek });

        } catch (error) {
            console.error(error);
            reply(`An error occurred: ${error.message}`);
        }
    });
