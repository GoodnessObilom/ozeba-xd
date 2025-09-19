const { cmd } = require('../command');
const crypto = require('crypto');
const webp = require('node-webpmux');
const axios = require('axios');
const fs = require('fs-extra');
const { exec } = require('child_process');
const { Sticker, createSticker, StickerTypes } = require("wa-sticker-formatter");
const Config = require('../config')

// .take command
cmd({
    pattern: 'take',
    alias: ['rename', 'stake'],
    desc: 'Create a sticker with a custom pack name.',
    category: 'sticker',
    use: '.take <packname>',
    filename: __filename,
},
async (conn, mek, m, { quoted, args, q, reply, isPatron }) => {
    if (!isPatron) return reply("❌ Only bot owner can use this command.");
    if (!mek.quoted) return reply(`*Reply to any sticker.*`);

    let pack = q || "OZEBA-XD";
    let mime = mek.quoted.mtype;

    if (mime === "imageMessage" || mime === "stickerMessage") {
        let media = await mek.quoted.download();
        let sticker = new Sticker(media, {
            pack: pack,
            type: StickerTypes.FULL,
            categories: ["🤩", "🎉"],
            id: "12345",
            quality: 75,
            background: 'transparent',
        });
        const buffer = await sticker.toBuffer();
        return conn.sendMessage(mek.chat, { sticker: buffer }, { quoted: mek });
    } else {
        return reply("*Uhh, Please reply to an image.*");
    }
});

// .sticker command
cmd({
    pattern: 'sticker',
    alias: ['tosticker', 'stickergif', "s"],
    desc: 'Create a sticker from image or short video (<=10s)',
    category: 'sticker',
    use: '<reply media>',
    filename: __filename,
},
async (conn, mek, m, { quoted, reply, isPatron }) => {
    if (!isPatron) return reply("❌ Only bot owner can use this command.");
    if (!mek.quoted) return reply("❌ *Reply to an image or short video (max 10s)*");

    let mime = mek.quoted.mtype;
    let pack = Config.STICKER_NAME || "OZEBA-XD";
    let author = "By Goodness Tech";

    try {
        if (mime === 'imageMessage' || mime === 'stickerMessage' || mime === 'videoMessage') {
            const media = await mek.quoted.download();

            const sticker = new Sticker(media, {
                pack,
                author,
                type: StickerTypes.FULL,
                categories: ['🔥', '🌟'],
                id: 'OZEBA-XD-sticker',
                quality: 75,
                background: 'transparent',
            });

            const buffer = await sticker.toBuffer();
            return await conn.sendMessage(mek.chat, { sticker: buffer }, { quoted: mek });

        } else {
            return reply("⚠️ *Only image or video reply is supported.*");
        }
    } catch (e) {
        console.error(e);
        return reply("❌ *Failed to create sticker.* Make sure the video is below 10 seconds.\nOr try sticker2 commands");
    }
});

 

// 𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡
