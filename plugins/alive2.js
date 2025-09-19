const fs = require('fs');
const path = require('path');
const config = require('../config');
const { cmd } = require('../command');

const ALIVE2_JSON = path.join(__dirname, '../lib/alive2.json');

function getAlive2Settings() {
    if (fs.existsSync(ALIVE2_JSON)) {
        try {
            return JSON.parse(fs.readFileSync(ALIVE2_JSON, 'utf8'));
        } catch {
            return null;
        }
    }
    return null;
}

function setAlive2Settings(img, msg) {
    fs.writeFileSync(ALIVE2_JSON, JSON.stringify({ img, msg }, null, 2));
}

// alive2 command
cmd({
    pattern: "alive2",
    desc: "Check bot online or no.",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    const settings = getAlive2Settings();
    if (!settings || !settings.img || !settings.msg) {
        return reply('Alive2 message/image not set yet! Use .setalive <image/video_url> | <caption> to set it.\nExample: .setalive https://example.com/image.jpg | Hello, I am alive! 🌟\nUse .tourl to turn your picture to url');
    }
    try {
        await conn.sendMessage(m.key.remoteJid, {
            react: {
                text: "🌐",
                key: m.key
            }
        });
        // Replace {runtime} with actual runtime string in the caption
        const runtimeStr = require('../lib/functions').runtime(process.uptime());
        const caption = settings.msg.replace(/\{runtime\}/gi, runtimeStr);
        const mediaUrl = settings.img;
        const isVideo = /\.(mp4|mov|webm|mkv)$/i.test(mediaUrl);
        const mediaMsg = isVideo
            ? { video: { url: mediaUrl }, caption }
            : { image: { url: mediaUrl }, caption };
        return await conn.sendMessage(from, mediaMsg, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

// setalive2 command (owner only)
cmd({
    pattern: "setalive",
    desc: "Set the alive2 image and message. Usage: .setalive <image/video_url> | <caption>",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, args, isOwner, reply }) => {
    if (!isOwner) return reply('Only the bot owner can use this command!');
    const input = args.join(' ');
    if (!input.includes('|')) {
        return reply('Usage: .setalive <image/video_url> | <caption>\nUse .tourl to turn your picture to url\n\nUse {runtime} to display runtime in the caption');
    }
    const [img, ...msgArr] = input.split('|');
    const msg = msgArr.join('|').trim();
    if (!img.trim() || !msg) {
        return reply('Usage: .setalive <image/video_url> | <caption>\nUse .tourl to turn your picture to url\n\nUse {runtime} to display runtime in the caption');
    }
    setAlive2Settings(img.trim(), msg);
    reply('Alive2 image and message updated!\nUse .alive2 to see it');
});

// How to use:
// .setalive2 <image_url> | <caption>
// Example:
// .setalive2 https://example.com/image.jpg | Hello, I am alive! 🌟
