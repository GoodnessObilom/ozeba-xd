const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "ping",
    alias: ["speed", "pong"], use: '.ping',
    desc: "Check bot's response time.",
    category: "main",
    filename: __filename
},
    async (conn, mek, m, { from, quoted, sender, reply }) => {
        try {
            const start = new Date().getTime();

            const reactionEmojis = ['🔥', '⚡', '🚀', '💨', '🎯', '🎉', '🌟', '💥', '🕐', '🔹'];
            const textEmojis = ['💎', '🏆', '⚡️', '🚀', '🎶', '🌠', '🌀', '🔱', '🛡️', '✨'];

            const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
            let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

            // Ensure reaction and text emojis are different
            while (textEmoji === reactionEmoji) {
                textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
            }

            // Send reaction using conn.sendMessage()
            await conn.sendMessage(from, {
                react: { text: textEmoji, key: mek.key }
            });

            const end = new Date().getTime();
            const responseTime = (end - start) / 1000;

            const text = `> *OZEBA -MD SPEED: ${responseTime.toFixed(2)}ms ${reactionEmoji}*`;

            await conn.sendMessage(from, {
                text,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 2,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363421812440006@newsletter',
                        newsletterName: "𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡",
                        serverMessageId: 143
                    }
                }
            }, { quoted: mek });

        } catch (e) {
            console.error("Error in ping command:", e);
            reply(`An error occurred: ${e.message}`);
        }
    });

// ping2 

cmd({
    pattern: "ping2",
    desc: "Check bot's response time.",
    category: "main",
    filename: __filename
},
    async (conn, mek, m, {
        from, reply
    }) => {
        try {
            const reactionEmoji = "🍂";
            const loadingMsg = '*PINGING...*';

            // React to the command
            await conn.sendMessage(from, {
                react: {
                    text: reactionEmoji,
                    key: m.key
                }
            });

            // Record start time
            const start = Date.now();

            // Send temporary message
            const tempMsg = await conn.sendMessage(from, {
                text: loadingMsg
            });

            // Simulate delay
            const end = Date.now();
            const ping = end - start;

            // Delete the temporary message
            await conn.sendMessage(from, {
                delete: tempMsg.key
            });

            // Send final ping result
            const finalText = `> *🔥OZEBE PING : ${ping}ms*`;
            await conn.sendMessage(from, {
                text: finalText
            }, { quoted: mek });

        } catch (e) {
            console.error("Error in ping2 command:", e);
            reply(`❌ Error: ${e.message}`);
        }
    });
