const fetch = require('node-fetch');
const FormData = require('form-data');
const { cmd } = require("../command");

cmd({
    pattern: "hd",
    alias: ["remini", "tohd"],
    desc: "Enhance photo quality using AI",
    category: "tools",
    filename: __filename,
    use: "(reply to an image)"
},
async (conn, m, msg, { reply }) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: { text: "⏳", key: m.key }
    });

    try {
        let q = m.quoted || m;
        let mime = (q.msg || q).mimetype || q.mimetype || q.mediaType || '';

        if (!mime) throw '📷 Please send or reply to an image first.';
        if (!/image\/(jpe?g|png)/.test(mime)) throw `❌ The format *${mime}* is not supported.`;

        let img = await q.download?.();
        if (!img) throw '❌ Failed to download the image.';

        const imageUrl = await uploadToCatbox(img);
        const api = `https://www.apis-anomaki.zone.id/ai/ai-upscale?imageUrl=${encodeURIComponent(imageUrl)}`;
        const res = await fetch(api);
        if (!res.ok) throw '❌ Error accessing the upscale API.';

        const json = await res.json();

        if (!json.status || !json.result?.success || !json.result.result?.result_url) 
            throw '❌ Invalid response from API.';

        const buffer = await fetch(json.result.result.result_url).then(v => v.buffer());
        if (!buffer || buffer.length === 0) throw '❌ Failed to fetch enhanced image.';

        await conn.sendMessage(m.chat, {
            image: buffer,
            caption: '✅ *Image enhanced successfully!*',
        }, { quoted: m });

    } catch (e) {
        await conn.sendMessage(m.chat, {
            react: { text: "❌", key: m.key }
        });
        console.error(e);
        reply(typeof e === 'string' ? e : '❌ An error occurred. Please try again later.');
    }
});

async function uploadToCatbox(buffer) {
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', buffer, 'image.jpg');

    const res = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: form
    });

    const url = await res.text();
    if (!url.startsWith('https://')) throw '❌ Error while uploading image to Catbox.';
    return url.trim();
}
