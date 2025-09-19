const axios = require('axios');
const { cmd } = require('../command');

async function shorturl(target) {
    const payload = { url: target };
    const headers = {
        'Content-Type': 'application/json',
        'Origin': 'https://shorturl.zenzxz.my.id',
        'Referer': 'https://shorturl.zenzxz.my.id/',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36'
    };
    const { data } = await axios.post('https://shorturl.zenzxz.my.id/shorten', payload, { headers });
    return data;
}

cmd({
    pattern: "shorturl",
    alias: ["shortlink", "tinyurl"],
    desc: "Create a short link from a long URL",
    category: "tools",
    use: "<link>",
    filename: __filename
}, async (conn, mek, m, { args, q, reply, prefix, command }) => {
    try {
        let url = q?.trim() || args.join(" ").trim();
        if (!url) return reply(`❌ Please provide a URL.\nExample:\n${command} https://example.com`);

        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }

        await reply('⏳ Creating short link...');
        let result = await shorturl(url);

        if (!result || !result.short) return reply('❌ Failed to create short link.');

        await reply(`✅ Short link created successfully!\n🔗 ${result.short}`);
    } catch (err) {
        reply(`⚠️ Error: ${err.message}`);
    }
});
