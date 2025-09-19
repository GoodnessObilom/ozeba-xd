const config = require('../config')
const { cmd, commands } = require('../command');
const os = require("os")
const {runtime} = require('../lib/functions')
const axios = require('axios')

cmd({
    pattern: "menu",
    alias: ["allmenu","fullmenu"],
    use: 'menu',
    desc: "Show all bot commands",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "🚹",
            key: m.key
        }
    });
    try {
        let dec = `
┌───「 💙 𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 」───┐
│ • Owner : ${config.OWNER_NAME}
│ • Prefix : [${config.PREFIX}]
│ • Version : 1.0.0 Beta
│ • Runtime : ${runtime(process.uptime())}
└───────────────────────┘
───「 Settings Menu 」───
 • 🛠️ allvar [view all settings]
 • 🔤 setprefix [prefix]
 • 🔒 mode [private/public]
 • ⌨️ auto-typing [on/off]
 • 📢 mention-reply [on/off]
 • 🌐 always-online [on/off]
 • 🎥 auto-recording [on/off]
 • 👀 auto-seen [on/off]
 • ❤️ status-react [on/off]
 • 📖 read-message [on/off]
 • 🚫 anti-bad [on/off]
 • 👀 antidel-path [same/log]
 • 💬 auto-reply [on/off]
 • 😍 auto-react [on/off]
 • 🔄 status-reply [on/off]
 • 🏷️ sticker-name [name]
 • ✨ custom-react [on/off]
 • 📦 status-msg [message]
 • 😎 setcustomemojis [emojis]
 • 📞 owner-number [number]
 • 🧑 owner-name [name]
 • 🚫 anti-call [on/off]

───「 📥 DOWNLOAD MENU 」───
 • 🟦 facebook
 • 🟦 facebook2
 • 📁 mediafire
 • 🎵 tiktok
 • 🎵 tiktok2
 • 🐦 twitter
 • 📷 insta
 • 📷 insta2
 • 📦 apk
 • 🖼️ img
 • ▶️ tt2
 • 📌 pins
 • 🔄 modapk
 • 🔵 fb2
 • 📍 pinterest
 • 🎶 spotify
 • 🎶 lyrics
 • 🌐 ttsearch
 • 🎧 play
 • 🎧 play2
 • 🎧 play3
 • 🔉 audio
 • 🎬 video
 • 📹 video2
 • 🎵 ytmp3
 • 📹 ytmp4
 • 🎶 song
 • 🎬 darama
 • ☁️ gdrive
 • 🌐 ssweb
 • 🎵 tiks

───「 👥 GROUP MENU 」───
 • 🔗 grouplink
 • 🔗 anti-tag
 • 🚪 kickall
 • ➕ add
 • ➖ remove
 • 👢 kick
 • 👤 out
 • 👤 savecontact
 • ⬆️ promote
 • ⬇️ demote
 • 🚮 dismiss
 • 🔄 revoke
 • 👋 goodbye
 • 🎉 welcome
 • 🗑️ delete
 • 🖼️ getpic
 • ℹ️ ginfo
 • 📝 requestlist
 • 📜 pdm
 • ✏️ updategname
 • 📝 updategdesc
 • 📩 acceptall
 • 📩 rejectall
 • 📨 senddm
 • 🏃 broadcast
 • 🏃 broadcast2
 • 🔇 mute
 • 🔊 unmute
 • 🔒 lockgc
 • 🔓 unlockgc
 • 📩 invite
 • 📩 sendinvite
 • #️⃣ tag
 • 🏷️ hidetag
 • @️⃣ tagall
 • 👔 tagadmins

───「 🎭 REACTIONS MENU 」───
 • 👊 bully @tag
 • 🤗 cuddle @tag
 • 😢 cry @tag
 • 🤗 hug @tag
 • 🐺 awoo @tag
 • 💋 kiss @tag
 • 👅 lick @tag
 • 🖐️ pat @tag
 • 😏 smug @tag
 • 🔨 bonk @tag
 • 🚀 yeet @tag
 • 😊 blush @tag
 • 😄 smile @tag
 • 👋 wave @tag
 • ✋ highfive @tag
 • 🤝 handhold @tag
 • 🍜 nom @tag
 • 🦷 bite @tag
 • 🤗 glomp @tag
 • 👋 slap @tag
 • 💀 kill @tag
 • 😊 happy @tag
 • 😉 wink @tag
 • 👉 poke @tag
 • 💃 dance @tag
 • 😬 cringe @tag

───「 🎨 LOGO MAKER 」───
 • 💡 neonlight
 • 🎀 blackpink
 • 🐉 dragonball
 • 🎭 3dcomic
 • 🇺🇸 america
 • 🍥 naruto
 • 😢 sadgirl
 • ☁️ clouds
 • 🚀 futuristic
 • 📜 3dpaper
 • ✏️ eraser
 • 🌇 sunset
 • 🍃 leaf
 • 🌌 galaxy
 • 💀 sans
 • 💥 boom
 • 💻 hacker
 • 😈 devilwings
 • 🇳🇬 nigeria
 • 💡 bulb
 • 👼 angelwings
 • ♈ zodiac
 • 💎 luxury
 • 🎨 paint
 • ❄️ frozen
 • 🏰 castle
 • 🖋️ tatoo
 • 🔫 valorant
 • 🐻 bear
 • 🔠 typography
 • 🎂 birthday

───「 👑 OWNER MENU 」───
 • 👑 owner
 • 📜 menu
 • 📜 menu2
 • 📜 menu3
 • 🔄 repost
 • 📊 vv
 • 📊 vv2 / nice
 • 📋 listcmd
 • 📚 allmenu
 • 👑 install
 • 📦 repo
 • 📦 creact
 • 🚫 block
 • ✅ unblock
 • 🚫 anti-delete on/off/status
 • 🖼️ getpp
 • 🏷️ setcmd
 • 🗑️ delcmd
 • 📜 listcmd
 • 📜 listsudo
 • 👑 setsudo
 • 🗑️ delsudo
 • 🖼️ setpp
 • 🖼️ getpp
 • 🖼️ getgpp
 • 🔄 restart
 • ⏹️ shutdown
 • 🔄 update
 • 📦 checkupdate
 • 🔢setaza
 • 🔢 aza
 • 💚 alive
 • 💚 alive2
 • 🏓 ping
 • 🆔 gjid
 • 🆔 jid
 • 🛠️ pfilter
 • 🛠️ gfilter
 • 🛠️ listfilter
 • 🛠️ pstop
 • 🛠️ gstop

───「 🎉 FUN MENU 」───
 • 🤪 shapar
 • ⭐ rate
 • 🤬 insult
 • 💻 hack
 • 💘 ship
 • 🎭 character
 • 💌 pickup
 • 😆 joke
 • ❤️ hrt
 • 😊 hpy
 • 😔 syd
 • 😠 anger
 • 😳 shy
 • 💋 kiss
 • 🧐 mon
 • 😕 cunfuzed
 • 🖼️ setpp
 • ✋ hand
 • 🏃 nikal
 • 🤲 hold
 • 🤗 hug
 • 🏃 nikal
 • 🎵 hifi
 • 👉 poke

───「 🔄 CONVERT MENU 」───
 • 🏷️ sticker
 • 🏷️ sticker2
 • 🏷️ quoted
 • 😀 emojimix
 • ✨ fancy
 • 🖼️ take
 • 🖼️ tohd
 • 🎵 toaudio
 • 🎵 toptt
 • 🖼️ toimg
 • 🎬 text2video
 • 🎬 veo3fast
 • 🗣️ tts
 • 🗣️ tts2
 • 🗣️ tts3
 • 🗣️ aivoice
 • 🖼️ topdf
 • 🖼️ getimage
 • 🌐 trt
 • 🔢 base64
 • 🔠 unbase64
 • 010 binary
 • 🔤 dbinary
 • 🔗 shorturl
 • 🌐 urldecode
 • 🌐 urlencode
 • 🌐 url
 • 🔁 repeat
 • ❓ ask
 • 📖 readmore

───「 🤖 AI MENU 」───
 • 🤖 ozebaai
 • 🤖 gpt
 • 🤖 openai
 • 🤖 chatbot [on/off]
 • 📖 nowai
 • 🖼️ nowart
 • 🔵 gemini
 • 🔵 grok
 • 🧠 meta
 • 📦 deepseek
 • 🎬 text2video
 • 🎬 veo3fast
 • 🖼️ text2image
 • 🎨 imagine
 • 🖼️ imagine2
 • 🖼️ imagine3

───「 ⚡ MAIN MENU 」───
 • 🛠️ *Games*
   • 🦑 squidgame
   • 🎲 wrg
   • 🧠 ttt
   • 🧠 tttstop
 • 🏓 ping
 • 🏓 ping2
 • 🚀 speed
 • 💚 alive
 • 💚 alive2
 • ⏱️ runtime
 • ⏳ uptime
 • 🛠️ removebg
 • 🛠️ imgscan
 • 📊 ytstalk
 • 📊 wstalk
 • 📊 tiktokstalk
 • 📊 xstalk
 • 📦 repo
 • 👑 owner
 • 👑 cinfo
 • 📜 menu
 • 📜 menu2
 • 📜 menu3
 • 🔄 restart

───「 🎎 ANIME MENU 」───
 • 🤬 fack
 • ✅ truth
 • 😨 dare
 • 🐶 dog
 • 🐺 awoo
 • 👧 garl
 • 👰 waifu
 • 🐱 neko
 • 🧙 megnumin
 • 🐱 neko
 • 👗 maid
 • 👧 loli
 • 🎎 animegirl
 • 🎎 animegirl1
 • 🎎 animegirl2
 • 🎎 animegirl3
 • 🎎 animegirl4
 • 🎎 animegirl5
 • 🎬 anime1
 • 🎬 anime2
 • 🎬 anime3
 • 🎬 anime4
 • 🎬 anime5
 • 📰 animenews
 • 🦊 foxgirl
 • 🍥 naruto

───「 ℹ️ OTHER MENU 」───
 • 🕒 timenow
 • 📅 date
 • 🔢 count
 • 🧮 calculate
 • 🔢 countx
 • 🎲 flip
 • 🪙 coinflip
 • 🎨 rcolor
 • 🎲 roll
 • ℹ️ fact
 • 📨 otpbox
 • 📞 tempnum
 • 📋 templist
 • 📧 tempmail
 • 📩 inbox
 • 💻 cpp
 • 🎲 rw
 • 💑 pair
 • ✨ fancy
 • 🎨 logo <text>
 • 📖 define
 • 📖 bible
 • 📰 news
 • 🎬 movie
 • ☀️ weather
 • 📦 srepo
 • 🤬 insult
 • 💾 save
 • 🌐 wikipedia
 • 🔑 gpass
 • 👤 githubstalk
 • 🔍 yts
 • 📹 ytv
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

        // Send audio
        await conn.sendMessage(from, {
            audio: { url: 'https://github.com/GoodnessObilom/ozeba-files/blob/main/ozeba.mp3' },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });
        
    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e}`);
    }
});
