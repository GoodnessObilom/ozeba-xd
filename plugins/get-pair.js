const { cmd } = require("../command");
const fetch = require("node-fetch"); // ensure this is enabled
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions');

cmd({
    pattern: "pair",
    alias: ["getpair", "clonebot"],
    desc: "Pairing code",
    category: "download",
    use: "<phone_number>",
    filename: __filename
}, 
async (conn, mek, m, { from, prefix, quoted, q, reply }) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "✅",
            key: m.key
        }
    });

    try {
        if (!q) return await reply("*Example -* .pair 23475822XX");

        // Remove all non-digit characters
        const digitsOnly = q.replace(/\D/g, '');

        // Check if starts with 0
        if (digitsOnly.startsWith("0")) {
            return await reply("❗Please use your country code (e.g., 234) instead of starting with 0.");
        }

        // Format the number with +
        const phoneNumber = `+${digitsOnly}`;

        const response = await fetch(`https://ozeba-xd-pairing.goodnesstechhost.xyz/pair?phone=${phoneNumber}`);
        const pair = await response.json();

        if (!pair || !pair.code) {
            return await reply("❌ Failed to retrieve pairing code. Please check the phone number and try again.");
        }

        const pairingCode = pair.code;
        const doneMessage = "> *𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 PAIR COMPLETED*";

        await reply(`${doneMessage}\n\n*Your pairing code is:* ${pairingCode}`);

        await new Promise(res => setTimeout(res, 2000));
        await reply(`${pairingCode}`);
    } catch (error) {
        console.error(error);
        await reply("⚠️ An error occurred. Please try again later.");
    }
});