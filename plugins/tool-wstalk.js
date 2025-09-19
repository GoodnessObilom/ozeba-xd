const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "wstalk",
    alias: ["channelstalk", "chinfo"],
    desc: "Get WhatsApp channel information",
    category: "utility",
    filename: __filename,
    use: ".wstalk <WhatsApp channel URL>"
},
async (conn, mek, m, { from, reply, args }) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "🔍",
            key: m.key
        }
    });
    try {
        // Check if URL is provided
        if (!args) return reply("❌ Please provide a WhatsApp channel URL\nExample: .wstalk https://whatsapp.com/channel/0029Val0s0rIt5rsIDPCoD2q");

        // Extract channel ID from URL
        const channelId = args.match(/channel\/([0-9A-Za-z]+)/i)?.[1];
        if (!channelId) return reply("❌ Invalid WhatsApp channel URL");

        // API endpoint
        const apiUrl = `https://itzpire.com/stalk/whatsapp-channel?url=https://whatsapp.com/channel/${channelId}`;

        // Fetch channel info
        const response = await axios.get(apiUrl);
        const data = response.data.data;

        // Format the information
        const channelInfo = `╭━━〔 *CHANNEL INFO* 〕━━┈⊷
┃◈╭─────────────·๏
┃◈┃• *📢 Title*: ${data.title}
┃◈┃• *👥 Followers*: ${data.followers}
┃◈┃• *📝 Description*: ${data.description.replace(/\n/g, '\n┃◈┃• ')}
┃◈└───────────┈⊷
╰──────────────┈⊷
> *POWERED BY GOODNESS TECH*`;

        // Send message with channel image
        await conn.sendMessage(from, {
            image: { url: data.img },
            caption: channelInfo,
            contextInfo: {
                forwardingScore: 2,
                isForwarded: true
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in wstalk command:", e);
        reply(`❌ Error: ${e.response?.data?.message || e.message}`);
    }
});
