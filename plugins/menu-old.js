const config = require('../config');
const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const os = require("os");
const axios = require('axios');

cmd({
    pattern: "menu3",
    desc: "menu the bot",
    category: "menu",
    filename: __filename
},
    async (conn, mek, m, { from, sender, pushname, reply }) => {
        await conn.sendMessage(m.key.remoteJid, {
            react: {
                text: "⚡",
                key: m.key
            }
        });
        try {
            const dec = `┌───「 🚀 OZEBA XD Main Menu 」───┐
│ 💙 Owner: ${config.OWNER_NAME}
│ ⚙️ Mode: ${config.MODE}
│ 🧠 Type: NodeJs (Multi Device)
│ ⌨️ Prefix: ${config.PREFIX}
│ 🧾 Version: 2.0.0 Beta
└───────────────────────┘

───「 💙 INFO 」───
 • ᴜsᴇ ${config.PREFIX}ozeba ᴛᴏ sᴇᴇ ᴍᴏʀᴇ ᴅᴇᴛᴀɪʟs ᴀʙᴏᴜᴛ ᴛʜᴇ ʙᴏᴛ

───「 🧩 Command Categories 」───
 • 🤖 Aimenu
 • 🎭 Animemenu
 • 😹 Reactions
 • 🔁 Convertmenu
 • 🎉 Funmenu
 • ⬇️ Dlmenu
 • ⚒️ List
 • 🏠 Mainmenu
 • 👥 Groupmenu
 • 📜 Allmenu
 • 👑 Ownermenu
 • 🧩 Othermenu
 • 🖌️ Logo
 • 📦 Repo
 • ⚙️ Settingmenu

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ
`;

            await conn.sendMessage(
                from,
                {
                    image: { url: 'https://files.catbox.moe/3m1vb1.png' },
                    caption: dec,
                    contextInfo: {
                        mentionedJid: [m.sender],
                        forwardingScore: 2,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363421812440006@newsletter',
                            newsletterName: '𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡',
                            serverMessageId: 143
                        }
                    }
                },
                { quoted: mek }
            );

            // Send cool voice note with context
            await conn.sendMessage(from, {
                audio: { url: 'https://github.com/Itzpatron/PATRON-DATA/raw/refs/heads/main/autovoice/lost-astro.mp3' },
                mimetype: 'audio/mp4',
                ptt: true,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 2,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363421812440006@newsletter',
                        newsletterName: '𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡',
                        serverMessageId: 143
                    }
                }
            }, { quoted: mek });

        } catch (e) {
            console.error(e);
            reply(`❌ Error:\n${e}`);
        }
    });

cmd({
    pattern: "logo",
    alias: ["logomenu"],
    desc: "menu the bot",
    category: "menu",
    filename: __filename
},
    async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
        await conn.sendMessage(m.key.remoteJid, {
            react: {
                text: "🧃",
                key: m.key
            }
        });
        try {
            let dec = `───「 🎨 LOGO LIST 」───
 • ᴜsᴇ ${config.PREFIX}ozeba ᴛᴏ sᴇᴇ ᴍᴏʀᴇ ᴅᴇᴛᴀɪʟs ᴀʙᴏᴜᴛ ᴛʜᴇ ʙᴏᴛ

 • neonlight
 • blackpink
 • dragonball
 • 3dcomic
 • america
 • naruto
 • sadgirl
 • clouds
 • futuristic
 • 3dpaper
 • eraser
 • sunset
 • leaf
 • galaxy
 • sans
 • boom
 • hacker
 • devilwings
 • nigeria
 • bulb
 • angelwings
 • zodiac
 • luxury
 • paint
 • frozen
 • castle
 • tatoo
 • valorant
 • bear
 • typography
 • birthday
`;

            await conn.sendMessage(
                from,
                {
                    image: { url: `https://files.catbox.moe/3m1vb1.png` },
                    caption: dec,
                    contextInfo: {
                        mentionedJid: [m.sender],
                        forwardingScore: 2,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363421812440006@newsletter',
                            newsletterName: "𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡",
                            serverMessageId: 143
                        }
                    }
                },
                { quoted: mek }
            );

        } catch (e) {
            console.log(e);
            reply(`${e}`);
        }
    });
cmd({
    pattern: "reactions",
    desc: "Shows the reaction commands",
    category: "menu",
    filename: __filename
},
    async (conn, mek, m, { from, quoted, reply }) => {
        await conn.sendMessage(m.key.remoteJid, {
            react: {
                text: "💫",
                key: m.key
            }
        });
        try {
            let dec = `───「 😹 REACTIONS MENU 」───
 • ᴜsᴇ ${config.PREFIX}ozeba ᴛᴏ sᴇᴇ ᴍᴏʀᴇ ᴅᴇᴛᴀɪʟs ᴀʙᴏᴜᴛ ᴛʜᴇ ʙᴏᴛ 

 • bully @tag
 • cuddle @tag
 • cry @tag
 • hug @tag
 • awoo @tag
 • kiss @tag
 • lick @tag
 • pat @tag
 • smug @tag
 • bonk @tag
 • yeet @tag
 • blush @tag
 • smile @tag
 • wave @tag
 • highfive @tag
 • handhold @tag
 • nom @tag
 • bite @tag
 • glomp @tag
 • slap @tag
 • kill @tag
 • happy @tag
 • wink @tag
 • poke @tag
 • dance @tag
 • cringe @tag

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ`;

            await conn.sendMessage(
                from,
                {
                    image: { url: `https://files.catbox.moe/3m1vb1.png` },
                    caption: dec,
                    contextInfo: {
                        mentionedJid: [m.sender],
                        forwardingScore: 2,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363421812440006@newsletter',
                            newsletterName: '𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡',
                            serverMessageId: 144
                        }
                    }
                },
                { quoted: mek }
            );

        } catch (e) {
            console.log(e);
            reply(`${e}`);
        }
    });

// dlmenu

cmd({
    pattern: "dlmenu",
    desc: "menu the bot",
    category: "menu",
    filename: __filename
},
    async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
        await conn.sendMessage(m.key.remoteJid, {
            react: {
                text: "⤵️",
                key: m.key
            }
        });
        try {
            let dec = `───「 ⬇️ DOWNLOAD MENU 」───
 • ᴜsᴇ ${config.PREFIX}ozeba ᴛᴏ sᴇᴇ ᴍᴏʀᴇ ᴅᴇᴛᴀɪʟs ᴀʙᴏᴜᴛ ᴛʜᴇ ʙᴏᴛ 

 • facebook
 • facebook2
 • mediafire
 • tiktok
 • tiktok2
 • twitter
 • Insta
 • Insta2
 • apk
 • img
 • tt2
 • pins
 • modapk
 • fb2
 • pinterest 
 • ttsearch
 • spotify
 • lyrics
 • play
 • play2
 • play3
 • audio
 • video
 • video2
 • ytmp3
 • ytmp4
 • song
 • darama
 • gdrive
 • ssweb
 • tiks

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ`;

            await conn.sendMessage(
                from,
                {
                    image: { url: `https://files.catbox.moe/3m1vb1.png` },
                    caption: dec,
                    contextInfo: {
                        mentionedJid: [m.sender],
                        forwardingScore: 2,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363421812440006@newsletter',
                            newsletterName: '𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡',
                            serverMessageId: 143
                        }
                    }
                },
                { quoted: mek }
            );

        } catch (e) {
            console.log(e);
            reply(`${e}`);
        }
    });
// group menu

cmd({
    pattern: "groupmenu",
    desc: "menu the bot",
    category: "menu",
    filename: __filename
},
    async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
        await conn.sendMessage(m.key.remoteJid, {
            react: {
                text: "⤵️",
                key: m.key
            }
        });
        try {
            let dec = `───「 👥 GROUP MENU 」───
 • ᴜsᴇ ${config.PREFIX}ozeba ᴛᴏ sᴇᴇ ᴍᴏʀᴇ ᴅᴇᴛᴀɪʟs ᴀʙᴏᴜᴛ ᴛʜᴇ ʙᴏᴛ 

 • grouplink
 • anti-tag
 • kickall
 • add
 • remove
 • kick
 • out
 • promote 
 • demote
 • dismiss 
 • revoke
 • savecontact
 • goodbye
 • welcome
 • delete 
 • getpic
 • ginfo
 • pdm
 • delete 
 • requestlist
 • updategname
 • updategdesc
 • acceptall
 • rejectall
 • senddm
 • broadcast
 • broadcast2
 • mute
 • unmute
 • lockgc
 • unlockgc
 • invite
 • sendinvite
 • tag
 • hidetag
 • tagall
 • tagadmins

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ`;

            await conn.sendMessage(
                from,
                {
                    image: { url: `https://files.catbox.moe/3m1vb1.png` },
                    caption: dec,
                    contextInfo: {
                        mentionedJid: [m.sender],
                        forwardingScore: 2,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363421812440006@newsletter',
                            newsletterName: '𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡',
                            serverMessageId: 143
                        }
                    }
                },
                { quoted: mek }
            );

        } catch (e) {
            console.log(e);
            reply(`${e}`);
        }
    });

// fun menu

cmd({
    pattern: "funmenu",
    desc: "menu the bot",
    category: "menu",
    filename: __filename
},
    async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
        await conn.sendMessage(m.key.remoteJid, {
            react: {
                text: "⤵️",
                key: m.key
            }
        });
        try {

            let dec = `───「 🎉 FUN MENU 」───
 • ᴜsᴇ ${config.PREFIX}ozeba ᴛᴏ sᴇᴇ ᴍᴏʀᴇ ᴅᴇᴛᴀɪʟs ᴀʙᴏᴜᴛ ᴛʜᴇ ʙᴏᴛ 

 • shapar
 • rate
 • insult
 • hack
 • ship
 • character
 • pickup 
 • joke
 • hrt
 • hpy
 • syd
 • anger
 • shy
 • kiss
 • mon
 • cunfuzed
 • setpp
 • hand
 • nikal
 • hold
 • • hug
 • nikal
 • hifi
 • poke

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ`;

            await conn.sendMessage(
                from,
                {
                    image: { url: `https://files.catbox.moe/3m1vb1.png` },
                    caption: dec,
                    contextInfo: {
                        mentionedJid: [m.sender],
                        forwardingScore: 2,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363421812440006@newsletter',
                            newsletterName: '𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖l',
                            serverMessageId: 143
                        }
                    }
                },
                { quoted: mek }
            );

        } catch (e) {
            console.log(e);
            reply(`${e}`);
        }
    });

// other menu

cmd({
    pattern: "othermenu",
    desc: "menu the bot",
    category: "menu",
    filename: __filename
},
    async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
        await conn.sendMessage(m.key.remoteJid, {
            react: {
                text: "🤖",
                key: m.key
            }
        });
        try {
            let dec = `───「 📌 OTHER MENU 」───
 • ᴜsᴇ ${config.PREFIX}ozeba ᴛᴏ sᴇᴇ ᴍᴏʀᴇ ᴅᴇᴛᴀɪʟs ᴀʙᴏᴜᴛ ᴛʜᴇ ʙᴏᴛ 

 • timenow
 • date
 • count
 • removebg
 • imgscan
 • calculate
 • countx
 • flip
 • coinflip
 • rcolor
 • roll
 • fact
 • cpp
 • otpbox
 • tempnum
 • templist 
 • inbox
 • tempmail
 • bible
 • rw
 • fancy
 • logo <text>
 • define
 • news
 • movie
 • weather
 • srepo
 • insult
 • save
 • wikipedia
 • gpass
 • githubstalk
 • ytstalk
 • wstalk
 • tiktokstalk
 • xstalk
 • yts
 • ytv

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ`;

            await conn.sendMessage(
                from,
                {
                    image: { url: `https://files.catbox.moe/3m1vb1.png` },
                    caption: dec,
                    contextInfo: {
                        mentionedJid: [m.sender],
                        forwardingScore: 2,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363421812440006@newsletter',
                            newsletterName: '𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡',
                            serverMessageId: 143
                        }
                    }
                },
                { quoted: mek }
            );

        } catch (e) {
            console.log(e);
            reply(`${e}`);
        }
    });
// main menu

cmd({
    pattern: "mainmenu",
    desc: "menu the bot",
    category: "menu",
    filename: __filename
},
    async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
        await conn.sendMessage(m.key.remoteJid, {
            react: {
                text: "💙",
                key: m.key
            }
        });

        try {
            let dec = `───「 🏠 MAIN MENU 」───
 • ᴜsᴇ ${config.PREFIX}ozeba ᴛᴏ sᴇᴇ ᴍᴏʀᴇ ᴅᴇᴛᴀɪʟs ᴀʙᴏᴜᴛ ᴛʜᴇ ʙᴏᴛ

───「 🛠️ Games 」───
 • squidgame
 • wrg
 • ttt
 • tttstop
 • *More soon*

───「 ℹ️ Bot Info / Controls 」───
 • ping
 • ping2
 • alive
 • alive2
 • cinfo
 • runtime
 • uptime 
 • repo
 • owner
 • menu
 • menu2
 • menu3
 • restart

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ`;

            await conn.sendMessage(
                from,
                {
                    image: { url: `https://files.catbox.moe/3m1vb1.png` },
                    caption: dec,
                    contextInfo: {
                        mentionedJid: [m.sender],
                        forwardingScore: 2,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363421812440006@newsletter',
                            newsletterName: '𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡',
                            serverMessageId: 143
                        }
                    }
                },
                { quoted: mek }
            );

        } catch (e) {
            console.log(e);
            reply(`${e}`);
        }
    });

// owner menu

cmd({
    pattern: "ownermenu",
    desc: "menu the bot",
    category: "menu",
    filename: __filename
},
    async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
        await conn.sendMessage(m.key.remoteJid, {
            react: {
                text: "🔰",
                key: m.key
            }
        });
        try {
            let dec = `───「 👑 OWNER MENU 」───
 • ᴜsᴇ ${config.PREFIX}ozeba ᴛᴏ sᴇᴇ ᴍᴏʀᴇ ᴅᴇᴛᴀɪʟs ᴀʙᴏᴜᴛ ᴛʜᴇ ʙᴏᴛ

 • owner
 • menu
 • menu2
 • menu3
 • repost
 • allmenu
 • setaza
 • aza
 • repo
 • install
 • anti-delete on/off/status
 • creact
 • block
 • unblock
 • vv
 • vv2 / nice
 • setcmd
 • delcmd
 • listcmd
 • getpp
 • setgpp
 • setpp
 • restart
 • listsudo
 • setsudo
 • delsudo
 • shutdown
 • update
 • checkupdate
 • pfilter
 • gfilter
 • listfilter
 • pstop
 • gstop
 • alive
 • alive2
 • ping 
 • ping2
 • gjid
 • jid

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ`;

            await conn.sendMessage(
                from,
                {
                    image: { url: `https://files.catbox.moe/3m1vb1.png` },
                    caption: dec,
                    contextInfo: {
                        mentionedJid: [m.sender],
                        forwardingScore: 2,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363421812440006@newsletter',
                            newsletterName: '𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞c𝙞ᴀʟ',
                            serverMessageId: 143
                        }
                    }
                },
                { quoted: mek }
            );

        } catch (e) {
            console.log(e);
            reply(`${e}`);
        }
    });

// convert menu

cmd({
    pattern: "convertmenu",
    desc: "menu the bot",
    category: "menu",
    filename: __filename
},
    async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
        await conn.sendMessage(m.key.remoteJid, {
            react: {
                text: "🥀",
                key: m.key
            }
        });
        try {
            let dec = `───「 🔄 CONVERT MENU 」───
 • ᴜsᴇ ${config.PREFIX}ozeba ᴛᴏ sᴇᴇ ᴍᴏʀᴇ ᴅᴇᴛᴀɪʟs ᴀʙᴏᴜᴛ ᴛʜᴇ ʙᴏᴛ

 • sticker
 • sticker2
 • quoted
 • emojimix
 • fancy
 • take
 • toaudio
 • toptt
 • toimg
 • getimage
 • tts2
 • ts3
 • tohd
 • aivoice
 • topdf
 • tts
 • trt
 • base64
 • unbase64
 • binary
 • dbinary
 • shorturl
 • veo3fast
 • text2video
 • urldecode
 • urlencode
 • tourl
 • repeat 
 • ask
 • readmore

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ`;

            await conn.sendMessage(
                from,
                {
                    image: { url: `https://files.catbox.moe/3m1vb1.png` },
                    caption: dec,
                    contextInfo: {
                        mentionedJid: [m.sender],
                        forwardingScore: 2,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363421812440006@newsletter',
                            newsletterName: '𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞ᴄɪᴀʟ',
                            serverMessageId: 143
                        }
                    }
                },
                { quoted: mek }
            );

        } catch (e) {
            console.log(e);
            reply(`${e}`);
        }
    });

// anmie menu 

cmd({
    pattern: "animemenu",
    desc: "menu the bot",
    category: "menu",
    filename: __filename
},
    async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
        await conn.sendMessage(m.key.remoteJid, {
            react: {
                text: "🧚",
                key: m.key
            }
        });
        try {
            let dec = `───「 🎭 ANIME MENU 」───
 • ᴜsᴇ ${config.PREFIX}ozeba ᴛᴏ sᴇᴇ ᴍᴏʀᴇ ᴅᴇᴛᴀɪʟs ᴀʙᴏᴜᴛ ᴛʜᴇ ʙᴏᴛ 
 
 • fack
 • dog
 • awoo
 • garl
 • waifu
 • neko
 • megnumin
 • neko
 • maid
 • loli
 • animegirl
 • animegirl
 • animegirl1
 • animegirl2
 • animegirl3
 • animegirl4
 • animegirl5
 • anime1
 • anime1
 • anime2
 • anime3
 • anime4
 • anime5
 • animenews
 • foxgirl
 • naruto

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ`;

            await conn.sendMessage(
                from,
                {
                    image: { url: `https://files.catbox.moe/3m1vb1.png` },
                    caption: dec,
                    contextInfo: {
                        mentionedJid: [m.sender],
                        forwardingScore: 2,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363421812440006@newsletter',
                            newsletterName: '𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞ᴄɪᴀʟ',
                            serverMessageId: 143
                        }
                    }
                },
                { quoted: mek }
            );

        } catch (e) {
            console.log(e);
            reply(`${e}`);
        }
    });


// ai menu 

cmd({
    pattern: "aimenu",
    desc: "menu the bot",
    category: "menu",
    filename: __filename
},
    async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
        await conn.sendMessage(m.key.remoteJid, {
            react: {
                text: "🤖",
                key: m.key
            }
        });
        try {
            let dec = `───「 🤖 AI MENU 」───
 • ᴜsᴇ ${config.PREFIX}ozeba ᴛᴏ sᴇᴇ ᴍᴏʀᴇ ᴅᴇᴛᴀɪʟs ᴀʙᴏᴜᴛ ᴛʜᴇ ʙᴏᴛ 
 
 • patronai
 • gpt
 • openai
 • gemini
 • meta
 • deepseek
 • grok
 • veo3fast
 • text2video
 • text2image
 • chatbot [on/off]
 • nowart
 • nowai
 • imagine 
 • imagine2
 • imagine3

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ`;

            await conn.sendMessage(
                from,
                {
                    image: { url: `https://files.catbox.moe/3m1vb1.png` },
                    caption: dec,
                    contextInfo: {
                        mentionedJid: [m.sender],
                        forwardingScore: 2,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363421812440006@newsletter',
                            newsletterName: '𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞ᴄɪᴀʟ',
                            serverMessageId: 143
                        }
                    }
                },
                { quoted: mek }
            );

        } catch (e) {
            console.log(e);
            reply(`${e}`);
        }
    });

// Add settings menu command
cmd({
    pattern: "settingmenu",
    desc: "Shows the settings commands",
    category: "menu",
    filename: __filename
},
    async (conn, mek, m, { from, quoted, reply }) => {
        await conn.sendMessage(m.key.remoteJid, {
            react: {
                text: "⚙️",
                key: m.key
            }
        });
        try {
            let dec = `───「 ⚙️ SETTINGS MENU 」───
 • ᴜsᴇ ${config.PREFIX}ozeba ᴛᴏ sᴇᴇ ᴍᴏʀᴇ ᴅᴇᴛᴀɪʟs ᴀʙᴏᴜᴛ ᴛʜᴇ ʙᴏᴛ

───「 🔧 BOT SETTINGS 」───
 • allvar [view all settings]
 • setprefix [prefix]
 • mode [private/public]
 • auto-typing [on/off]
 • mention-reply [on/off]
 • always-online [on/off]
 • auto-recording [on/off]
 • auto-seen [on/off]
 • status-react [on/off]
 • read-message [on/off]
 • anti-bad [on/off]
 • auto-reply [on/off]
 • auto-react [on/off]
 • status-reply [on/off]
 • sticker-name [name]
 • custom-react [on/off]
 • status-msg [message]
 • antidel-path [same/log]
 • setcustomemojis [emojis]
 • owner-number [number]
 • owner-name [name]
 • anti-call [on/off] 

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ`;

            await conn.sendMessage(
                from,
                {
                    image: { url: `https://files.catbox.moe/3m1vb1.png` },
                    caption: dec,
                    contextInfo: {
                        mentionedJid: [m.sender],
                        forwardingScore: 2,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363421812440006@newsletter',
                            newsletterName: '𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞ᴄɪᴀʟ',
                            serverMessageId: 144
                        }
                    }
                },
                { quoted: mek }
            );

        } catch (e) {
            console.log(e);
            reply(`${e}`);
        }
    });