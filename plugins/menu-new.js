const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');

cmd({
    pattern: "menu2",
    desc: "Show interactive menu system",
    category: "menu2",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "🚹",
            key: m.key
        }
    });
    try {
        const menuCaption = `
┌───「 🚀 𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 」───┐
│ 👤 Owner    : ${config.OWNER_NAME}
│ 📦 Library  : Baileys MD
│ 🚦 Mode      : [ ${config.MODE} ]
│ 🔖 Prefix   : [ ${config.PREFIX} ]
│ 📌 Version  : 1.0.0 Beta
└───────────────────────┘

───「 ℹ️ INFO 」───
 • Tip: Use ${config.PREFIX}patron to view full bot info.
 • Reply this message with a number to access a menu.
 • Some commands might not be in this menu so use ${config.PREFIX}allmenu or ${config.PREFIX}menu3 command.

───「 ✨ MENU CATEGORIES 」───
 • 1️⃣ ⬇️  Download Tools
 • 2️⃣ 💬  Group Features
 • 3️⃣ 🎉  Fun & Games
 • 4️⃣ 🛠️  Owner Commands
 • 5️⃣ 🧠  AI & ChatGPT
 • 6️⃣ 🌸  Anime Tools
 • 7️⃣ 🔧  File Conversion
 • 8️⃣ 🧰  Utilities & Extras
 • 9️⃣ 💬  Reactions
 • 🔟 🏠  Main Menu
 • 1️⃣1️⃣ ⚙️  Settings

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ*
 `;

        const contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 2,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363421812440006@newsletter',
                newsletterName: "𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡",
                serverMessageId: 143
            }
        };

        // Function to send menu image with timeout
        const sendMenuImage = async () => {
            try {
                return await conn.sendMessage(
                    from,
                    {
                        image: { url: 'https://files.catbox.moe/3m1vb1.png' },
                        caption: menuCaption,
                        contextInfo: contextInfo
                    },
                    { quoted: mek }
                );
            } catch (e) {
                console.log('Image send failed, falling back to text');
                return await conn.sendMessage(
                    from,
                    { text: menuCaption, contextInfo: contextInfo },
                    { quoted: mek }
                );
            }
        };

        // Function to send menu audio with timeout
        const sendMenuAudio = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay after image
                await conn.sendMessage(from, {
                    audio: { url: 'https://github.com/GoodnessObilom/ozeba-files/blob/main/ozeba.mp3' },
                    mimetype: 'audio/mp4',
                    ptt: true,
                }, { quoted: mek });
            } catch (e) {
                console.log('Audio send failed, continuing without it');
            }
        };

        // Send image first, then audio sequentially
        let sentMsg;
        try {
            // Send image with 10s timeout
            sentMsg = await Promise.race([
                sendMenuImage(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Image send timeout')), 10000))
            ]);

            // Then send audio with 1s delay and 8s timeout
            await Promise.race([
                sendMenuAudio(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Audio send timeout')), 8000))
            ]);
        } catch (e) {
            console.log('Menu send error:', e);
            if (!sentMsg) {
                sentMsg = await conn.sendMessage(
                    from,
                    { text: menuCaption, contextInfo: contextInfo },
                    { quoted: mek }
                );
            }
        }

        const messageID = sentMsg.key.id;

        // Menu data (complete version)
        const menuData = {
            '1': {
                title: "📥 *Download Menu* 📥",
                content: `───「 📥 DOWNLOAD MENU 」───
 • ᴜsᴇ ${config.PREFIX}ozeba ᴛᴏ sᴇᴇ ᴍᴏʀᴇ ᴅᴇᴛᴀɪʟs ᴀʙᴏᴜᴛ ᴛʜᴇ ʙᴏᴛ

───「 🌐 Social Media 」───
 • facebook [url]
 • facebook2 [url]
 • mediafire [url]
 • tiktok [url]
 • tiktok2 [url]
 • twitter [url]
 • Insta [url]
 • Insta2 [url]
 • apk [app]
 • img [query]
 • ttsearch [query]
 • tt2 [url]
 • pins [url]
 • modapk [app]
 • fb2 [url]
 • ssweb [url]
 • pinterest [url]

───「 🎵 Music/Video 」───
 • spotify [query]
 • lyrics [song]
 • play [song]
 • play2 [song]
 • play3 [song]
 • audio [url]
 • video [url]
 • video2 [url]
 • ytmp3 [url]
 • ytmp4 [url]
 • song [name]
 • darama [name]
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ* `,
                image: true
            },
            '2': {
                title: "👥 *Group Menu* 👥",
                content: `
───「 👥 GROUP MENU 」───
 • ᴜsᴇ ${config.PREFIX}ozeba ᴛᴏ sᴇᴇ ᴍᴏʀᴇ ᴅᴇᴛᴀɪʟs ᴀʙᴏᴜᴛ ᴛʜᴇ ʙᴏᴛ

───「 🛠️ Management 」───
 • grouplink
 • kickall
 • add @user
 • remove @user
 • kick @user
 • out (*234)
 • pdm
 • savecontact

───「 ⚡ Admin Tools 」───
 • promote @user
 • demote @user
 • dismiss
 • anti-tag
 • revoke
 • mute
 • unmute
 • lockgc
 • unlockgc

───「 🏷️ Tagging 」───
 • tag @user
 • hidetag [msg]
 • tagall
 • tagadmins
 • broadcast
 • broadcast2
 • invite
 • sendinvite
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ* `,
                image: true
            },
            '3': {
                title: "😄 *Fun Menu* 😄",
                content: `
───「 🎉 FUN MENU 」───
 • ᴜsᴇ ${config.PREFIX}ozeba ᴛᴏ sᴇᴇ ᴍᴏʀᴇ ᴅᴇᴛᴀɪʟs ᴀʙᴏᴜᴛ ᴛʜᴇ ʙᴏᴛ

───「 🎭 Interactive 」───
 • shapar
 • rate @user
 • insult @user
 • hack @user
 • ship @user1 @user2
 • character
 • pickup
 • joke

───「 🎲 Games 」───
 • squidgame
 • wrg
 • ttt
 • tttstop
 • truth
 • dare
 • flirt
 • fact

───「 😂 Reactions 」───
 • hrt
 • hpy
 • syd
 • anger
 • shy
 • kiss
 • mon
 • cunfuzed
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ* `,
                image: true
            },
            '4': {
                title: "👑 *Owner Menu* 👑",
                content: `───「 👑 OWNER MENU 」───
 • ᴜsᴇ ${config.PREFIX}ozeba ᴛᴏ sᴇᴇ ᴍᴏʀᴇ ᴅᴇᴛᴀɪʟs ᴀʙᴏᴜᴛ ᴛʜᴇ ʙᴏᴛ 

───「 ⚠️ Restricted 」───
 • block @user
 • unblock @user
 • anti-delete on/off/status
 • repost
 • getpp
 • getgpp
 • setpp [img]
 • setcmd [command]
 • delcmd [command]
 • listcmd
 • listsudo
 • setsudo @user
 • delsudo @user
 • restart
 • shutdown
 • update
 • checkupdate
 • setaza
 • creact
 • install
 • aza
 • vv
 • vv2 / nice
 • pfilter
 • gfilter
 • listfilter
 • pstop
 • gstop

───「 ℹ️ Info Tools 」───
 • gjid
 • jid @user
 • listcmd
 • allmenu

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ`,
                image: true
            },
            '5': {
                title: "🤖 *AI Menu* 🤖",
                content: `───「 🤖 AI MENU 」───
 • ᴜsᴇ ${config.PREFIX}ozeba ᴛᴏ sᴇᴇ ᴍᴏʀᴇ ᴅᴇᴛᴀɪs ᴀʙᴏᴜᴛ ᴛʜᴇ ʙᴏᴛ 

───「 💬 Chat AI 」───
 • patronai [query]
 • openai [query]
 • gpt [query]
 • nowai [query]
 • gemini [query]
 • meta [query]
 • grok [query]
 • deepseek [query]
 • chatbot [on/off]

───「 🖼️ Generator AI 」───
 • veo3fast [prompt]
 • text2video [prompt]
 • text2image [prompt]
 • nowart [prompt]
 • imagine [prompt]
 • imagine2 [prompt]
 • imagine3 [prompt]

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ`,
                image: true
            },
            '6': {
                title: "🎎 *Anime Menu* 🎎",
                content: `───「 🎎 ANIME MENU 」───
 • ᴜsᴇ ${config.PREFIX}ozeba ᴛᴏ sᴇᴇ ᴍᴏʀᴇ ᴅᴇᴛᴀɪʟs ᴀʙᴏᴜᴛ ᴛʜᴇ ʙᴏᴛ 

───「 🖼️ Images 」───
 • fack
 • dog
 • awoo
 • garl
 • waifu
 • neko
 • megnumin
 • maid
 • loli

───「 🎭 Characters 」───
 • animegirl
 • animegirl1-5
 • anime1-5
 • foxgirl
 • naruto

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ`,
                image: true
            },
            '7': {
                title: "🔄 *Convert Menu* 🔄",
                content: `───「 🔄 CONVERT MENU 」───
 • ᴜsᴇ ${config.PREFIX}ozeba ᴛᴏ sᴇᴇ ᴍᴏʀᴇ ᴅᴇᴛᴀɪʟs ᴀʙᴏᴜᴛ ᴛʜᴇ ʙᴏᴛ 

───「 🖼️ Media 」───
 • sticker [img]
 • sticker2 [img]
 • quoted [reply/text]
 • emojimix 😎+😂
 • take [name,text]
 • toimg [sticker]
 • topdf 
 • toptt
 • tourl
 • getimage
 • shorturl [url]
 • tohd
 • toaudio [video]
 • veo3fast [text]
 • text2video [text]

───「 📝 Text 」───
 • fancy [text]
 • tts [text]
 • tts2 [text]
 • tts3 [text]
 • trt [text]
 • base64 [text]
 • unbase64 [text]

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ`,
                image: true
            },
            '8': {
                title: "📌 *Other Menu* 📌",
                content: `───「 📌 OTHER MENU 」───
 • ᴜsᴇ ${config.PREFIX}ozeba ᴛᴏ sᴇᴇ ᴍᴏʀᴇ ᴅᴇᴛᴀɪʟs ᴀʙᴏᴜᴛ ᴛʜᴇ ʙᴏᴛ 

───「 🕒 Utilities 」───
 • timenow
 • date
 • removebg
 • imgscan
 • count [num]
 • calculate [expr]
 • otpbox [full-number]
 • tempnum [country]
 • templist [country]
 • ytstalk
 • wstalk
 • tiktokstalk
 • xstalk
 • countx

───「 🎲 Random 」───
 • flip
 • coinflip
 • rcolor
 • roll
 • fact

───「 🔍 Search 」───
 • define [word]
 • news [query]
 • bible
 • cinfo
 • movie [name]
 • weather [loc]

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ`,
                image: true
            },
            '9': {
                title: "💞 *Reactions Menu* 💞",
                content: `───「 💞 REACTIONS MENU 」───
 • ᴜsᴇ ${config.PREFIX}ozeba ᴛᴏ sᴇᴇ ᴍᴏʀᴇ ᴅᴇᴛᴀɪʟs ᴀʙᴏᴜᴛ ᴛʜᴇ ʙᴏᴛ 

───「 ❤️ Affection 」───
 • cuddle @user
 • hug @user
 • kiss @user
 • lick @user
 • pat @user

───「 😂 Funny 」───
 • bully @user
 • bonk @user
 • yeet @user
 • slap @user
 • kill @user

───「 😊 Expressions 」───
 • blush @user
 • smile @user
 • happy @user
 • wink @user
 • poke @user

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ`,
                image: true
            },
            '10': {
                title: "🏠 *Main Menu* 🏠",
                content: `───「 🏠 MAIN MENU 」───
 • ᴜsᴇ ${config.PREFIX}ozeba ᴛᴏ sᴇᴇ ᴍᴏʀᴇ ᴅᴇᴛᴀɪʟs ᴀʙᴏᴜᴛ ᴛʜᴇ ʙᴏᴛ 

───「 ℹ️ Bot Info 」───
 • ping
 • ping2
 • version
 • alive
 • alive2
 • runtime
 • uptime
 • repo
 • owner

───「 🛠️ Games 」───
 • squidgame
 • wrg
 • ttt
 • truth
 • dare
 • flirt
 • fact
 • *More soon*

───「 🛠️ Controls 」───
 • menu
 • menu2
 • menu3
 • restart

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ`,
                image: true
            },
            '11': {
                title: "⚙️ *Settings Menu* ⚙️",
                content: `───「 ⚙️ SETTINGS MENU 」───
 • ᴜsᴇ ${config.PREFIX}ozeba ᴛᴏ sᴇᴇ ᴍᴏʀᴇ ᴅᴇᴛᴀɪʟs ᴀʙᴏᴜᴛ ᴛʜᴇ ʙᴏᴛ 

───「 🔧 Bot Settings 」───
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

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ`,
                image: true
            }
        };

        // Message handler with improved error handling
        const handler = async (msgData) => {
            try {
                const receivedMsg = msgData.messages[0];
                if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;

                const isReplyToMenu = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

                if (isReplyToMenu) {
                    const receivedText = receivedMsg.message.conversation ||
                        receivedMsg.message.extendedTextMessage?.text;
                    const senderID = receivedMsg.key.remoteJid;

                    if (menuData[receivedText]) {
                        const selectedMenu = menuData[receivedText];

                        try {
                            if (selectedMenu.image) {
                                await conn.sendMessage(
                                    senderID,
                                    {
                                        image: { url: 'https://files.catbox.moe/3m1vb1.png' },
                                        caption: selectedMenu.content,
                                        contextInfo: contextInfo
                                    },
                                    { quoted: receivedMsg }
                                );
                            } else {
                                await conn.sendMessage(
                                    senderID,
                                    { text: selectedMenu.content, contextInfo: contextInfo },
                                    { quoted: receivedMsg }
                                );
                            }

                            await conn.sendMessage(senderID, {
                                react: { text: '✅', key: receivedMsg.key }
                            });

                        } catch (e) {
                            console.log('Menu reply error:', e);
                            await conn.sendMessage(
                                senderID,
                                { text: selectedMenu.content, contextInfo: contextInfo },
                                { quoted: receivedMsg }
                            );
                        }

                    } else {
                        await conn.sendMessage(
                            senderID,
                            {
                                text: `❌ *Invalid Option!* ❌\n\nPlease reply with a number between 1-11 to select a menu.\n\n*Example:* Reply with "1" for Download Menu\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ* `,
                                contextInfo: contextInfo
                            },
                            { quoted: receivedMsg }
                        );
                    }
                }
            } catch (e) {
                console.log('Handler error:', e);
            }
        };

        // Add listener
        conn.ev.on("messages.upsert", handler);

        // Remove listener after 5 minutes
        setTimeout(() => {
            conn.ev.off("messages.upsert", handler);
        }, 300000);

    } catch (e) {
        console.error('Menu Error:', e);
        try {
            await conn.sendMessage(
                from,
                { text: `❌ Menu system is currently busy. Please try again later.\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ* ` },
                { quoted: mek }
            );
        } catch (finalError) {
            console.log('Final error handling failed:', finalError);
        }
    }
});
