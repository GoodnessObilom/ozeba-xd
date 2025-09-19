const { cmd } = require('../command');
const axios = require('axios');
const cheerio = require('cheerio');

cmd({
    pattern: "facebook",
    alias: ["instagram2", "ig2", "tiktok2", "tt2", "fb"],
    desc: "Download videos or photos from TikTok, Instagram, or Facebook",
    category: "download",
    filename: __filename,
    use: "<link>"
},
async (conn, mek, m, { from, args, reply, command }) => {
    try {
        const text = args[0];
        if (!text) {
            return reply(`❌ Please provide a link.\nExample:\n${command} https://vt.tiktok.com/ZSBKKk4HS/`);
        }

        // Detect platform
        const platform = command.includes('tt') || command.includes('tiktok') ? 'tiktok'
            : command.includes('ig') || command.includes('insta') ? 'instagram'
            : command.includes('facebook') || command.includes('fb') ? 'facebook'
            : null;

        if (!platform) return reply("❌ Unsupported platform.");

        // React to show processing
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const SITE_URL = 'https://instatiktok.com/';

        // Prepare form data
        const form = new URLSearchParams();
        form.append('url', text);
        form.append('platform', platform);
        form.append('siteurl', SITE_URL);

        // Send POST request to site
        const res = await axios.post(`${SITE_URL}api`, form.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Origin': SITE_URL,
                'Referer': SITE_URL,
                'User-Agent': 'Mozilla/5.0',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        const html = res?.data?.html;
        if (!html || res?.data?.status !== 'success') {
            return reply("❌ Failed to fetch data from server.");
        }

        // Parse HTML for download links
        const $ = cheerio.load(html);
        const links = [];
        $('a.btn[href^="http"]').each((_, el) => {
            const link = $(el).attr('href');
            if (link && !links.includes(link)) links.push(link);
        });

        if (links.length === 0) return reply("❌ No media links found.");

        // Pick the right download link(s)
        let download;
        if (platform === 'instagram') {
            download = links;
        } else if (platform === 'tiktok') {
            download = links.find(link => /hdplay/.test(link)) || links[0];
        } else if (platform === 'facebook') {
            download = links.at(-1);
        }

        if (!download) return reply("❌ Could not retrieve download link.");

        const footer = `\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ*`;

        // Send media
        if (Array.isArray(download)) {
            for (const media of download) {
                const buff = await axios.get(media, { responseType: 'arraybuffer' }).then(r => r.data);
                await conn.sendMessage(from, { image: buff, caption: `📥 Instagram Downloader${footer}` }, { quoted: mek });
            }
        } else {
            const buff = await axios.get(download, { responseType: 'arraybuffer' }).then(r => r.data);
            const isVideo = download.includes('.mp4');
            const caption = `📥 *${platform.toUpperCase()} Download Successful!*${footer}`;
            await conn.sendMessage(from, isVideo ? { video: buff, caption } : { image: buff, caption }, { quoted: mek });
        }

        // React success
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error(e);
        reply(`❌ An error occurred.\n\n${e.message || e}`);
    }
});
