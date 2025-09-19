const fetch = require('node-fetch');
const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Fetch GitHub repository information",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "📂",
            key: m.key
        }
    });

    const githubRepoURL = 'https://github.com/GoodnessObilom/ozeba';

    try {
        const [, username, repoName] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
        
        if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
        const repoData = await response.json();

        // Format 1: Classic Box
        const style1 = `╭───『 𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡 REPO 』───⳹
│ 🌐 Use this link to get session id:\n│ 👉 https://ozeba-xd-pairing.goodnesstechhost.xyz/
│ 🚀 Or use this bot .getpair 234xxxxxx
│ 📦 *Repository*: ${repoData.name}
│ 👑 *Owner*: ${repoData.owner.login}
│ ⭐ *Stars*: ${repoData.stargazers_count}
│ ⑂ *Forks*: ${repoData.forks_count}
│ 🔗 *URL*: ${repoData.html_url}/fork
│
│ 📝 *Description*:
│ ${repoData.description || 'No description'}
│
╰────────────────⳹
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ* `;

        // Format 2: Minimalist
        const style2 = `•——[ *GITHUB INFO* ]——•
  ├─ 🌐 *Use this link to get session id:*\n├─ 👉 https://ozeba-xd-pairing.goodnesstechhost.xyz/
  ├─ 🚀 *Or use this bot .getpair 234xxxxxx*     
  │
  ├─ 🏷️ ${repoData.name}
  ├─ 👤 ${repoData.owner.login}
  ├─ ✨ ${repoData.stargazers_count} Stars
  ├─ ⑂ ${repoData.forks_count} Forks
  ├─ 🔗 ${repoData.html_url}/fork
  │
  •——[ *𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡* ]——•
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ* `;

        // Format 3: Fancy Borders
        const style3 = `▄▀▄▀▄ *REPOSITORY INFO* ▄▀▄▀▄
  ♢ *Use this link to get session id:*\n♢ https://ozeba-xd-pairing.goodnesstechhost.xyz/
  ♢ *Or use this bot .getpair 234xxxxxx*
  ♢  
  ♢ *Project*: ${repoData.name}
  ♢ *Author*: ${repoData.owner.login}
  ♢ *Stars*: ${repoData.stargazers_count} ✨
  ♢ *Forks*: ${repoData.forks_count} ⑂
  ♢ *Updated*: ${new Date(repoData.updated_at).toLocaleDateString()}
  
  🔗 ${repoData.html_url}/fork
  
>  > *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ* `;

        // Format 4: Code Style
        const style4 = `┌──────────────────────┐
│  ⚡ *𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡 REPO*  ⚡  │
├─ 🌐 *Use this link to get session id:*\n├─ 👉 https://ozeba-xd-pairing.goodnesstechhost.xyz/
├─ 🚀 *Or use this bot .getpair 234xxxxxx* 
├──────────────────────┤
│ • Name: ${repoData.name}
│ • Owner: ${repoData.owner.login}
│ • Stars: ${repoData.stargazers_count}
│ • Forks: ${repoData.forks_count}
│ • URL: ${repoData.html_url}/fork
│ • Desc: ${repoData.description || 'None'}
└──────────────────────┘
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ* `;

        // Format 5: Modern Blocks
        const style5 = `▰▰▰▰▰ *REPO INFO* ▰▰▰▰▰
  🌐 *Use this link to get session id:*\n👉 https://ozeba-xd-pairing.goodnesstechhost.xyz/
  🚀 *Or use this bot .getpair 234xxxxxx* 

  🏷️  *${repoData.name}*
  👨‍💻  ${repoData.owner.login}
  
  ⭐ ${repoData.stargazers_count}  ⑂ ${repoData.forks_count}
  🔗 ${repoData.html_url}/fork
  
  📜 ${repoData.description || 'No description'}
  
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ* `;

        // Format 6: Retro Terminal
        const style6 = `╔══════════════════════╗
║   *𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡 REPO*    ║
║ *Use this link to get session id:*\n║ https://ozeba-xd-pairing.goodnesstechhost.xyz/
║ *Or use this bot .getpair 234xxxxxx* 
╠══════════════════════╣
║ > NAME: ${repoData.name}
║ > OWNER: ${repoData.owner.login}
║ > STARS: ${repoData.stargazers_count}
║ > FORKS: ${repoData.forks_count}
║ > URL: ${repoData.html_url}/fork
║ > DESC: ${repoData.description || 'None'}
╚══════════════════════╝
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ* `;

        // Format 7: Elegant
        const style7 = `┌───────────────┐
│  📂 𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡 *REPO*  │
🌐 *Use this link to get session id:*\n👉 https://ozeba-xd-pairing.goodnesstechhost.xyz/
🚀 *Or use this bot .getpair 234xxxxxx* 
└───────────────┘
│
│ *Project*: ${repoData.name}
│ *Author*: ${repoData.owner.login}
│
│ ✨ ${repoData.stargazers_count} Stars
│ ⑂ ${repoData.forks_count} Forks
│   
│ 🔗 ${repoData.html_url}/fork
│
┌───────────────┐
│  📝  *DESC*  │
└───────────────┘
${repoData.description || 'No description'}

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ* `;

        // Format 8: Social Media Style
        const style8 = `✦ *𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡 Repository* ✦

🌐 *Use this link to get session id:*\n👉 https://ozeba-xd-pairing.goodnesstechhost.xyz/
🚀 *Or use this bot .getpair 234xxxxxx* 

📌 *${repoData.name}*
👤 @${repoData.owner.login}

⭐ ${repoData.stargazers_count} Stars | ⑂ ${repoData.forks_count} Forks
🔄 Last updated: ${new Date(repoData.updated_at).toLocaleDateString()}

🔗 GitHub: ${repoData.html_url}/fork

${repoData.description || 'No description available'}

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ* `;

        // Format 9: Fancy List
        const style9 = `╔♫═🎧═♫══════════╗
   *𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡 REPO*
  ╚♫═🎧═♫══════════╝

*Use this link to get session id:*\nhttps://ozeba-xd-pairing.goodnesstechhost.xyz/
*Or use this bot .getpair 234xxxxxx* 

•・゜゜・* ✧  *・゜゜・•
 ✧ *Name*: ${repoData.name}
 ✧ *Owner*: ${repoData.owner.login}
 ✧ *Stars*: ${repoData.stargazers_count}
 ✧ *Forks*: ${repoData.forks_count}
•・゜゜・* ✧  *・゜゜・•

🔗 ${repoData.html_url}/fork

${repoData.description || 'No description'}

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ* `;

        // Format 10: Professional
        const style10 = `┏━━━━━━━━━━━━━━━━━━┓
┃  *REPOSITORY REPORT*  ┃
┗━━━━━━━━━━━━━━━━━━┛

◈  🌐 *Use this link to get session id:*\n◈ https://ozeba-xd-pairing.goodnesstechhost.xyz/
◈  🚀 *Or use this bot .getpair 234xxxxxx* 

◈ Project: ${repoData.name}
◈ Maintainer: ${repoData.owner.login}
◈ Popularity: ★ ${repoData.stargazers_count} | ⑂ ${repoData.forks_count}
◈ Last Update: ${new Date(repoData.updated_at).toLocaleDateString()}
◈ URL: ${repoData.html_url}/fork

Description:
${repoData.description || 'No description provided'}

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ* `;

        const styles = [style1, style2, style3, style4, style5, style6, style7, style8, style9, style10];
        const selectedStyle = styles[Math.floor(Math.random() * styles.length)];

        // Send image with repo info
        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/3m1vb1.png' },
            caption: selectedStyle,
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
        }, { quoted: mek });

        // Send audio
        await conn.sendMessage(from, {
            audio: { url: 'https://github.com/GoodnessObilom/ozeba-files/blob/main/ozeba.mp3' },
            mimetype: 'audio/mp4',
            ptt: true,
            contextInfo: { 
                mentionedJid: [m.sender],
                forwardingScore: 2,
                isForwarded: true
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("Repo command error:", error);
        reply(`❌ Error: ${error.message}`);
    }
});
