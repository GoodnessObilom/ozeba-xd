const { cmd, commands } = require('../command');
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "get",
    alias: ["source", "getplugin"],
    desc: "Fetch the full source code of a command",
    category: "owner",
    filename: __filename,
    use: "<command_name>"
},
async (conn, mek, m, { from, args, reply }) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "📜",
            key: m.key
        }
    });
    try {
        const allowedUsers = ["2348065623101@s.whatsapp.net", "2349126793637@s.whatsapp.net"];
        if (!allowedUsers.includes(m.sender)) {
            return reply("❌ You are not authorized to use this command!");
        }

        if (!args[0]) return reply("❌ Please provide a command name. Example: `.get alive`");

        const commandName = args[0].toLowerCase();
        const commandData = commands.find(cmd => cmd.pattern === commandName || (cmd.alias && cmd.alias.includes(commandName)));

        if (!commandData) return reply("❌ Command not found!");

        // Get the command file path
        const commandPath = commandData.filename;

        // Read the full source code
        const fullCode = fs.readFileSync(commandPath, 'utf-8');

        // Truncate long messages for WhatsApp
        let truncatedCode = fullCode;
        if (truncatedCode.length > 4000) {
            truncatedCode = fullCode.substring(0, 4000) + "\n\n// Code too long, sending full file 📂";
        }

        // Formatted caption with truncated code
        const formattedCode = `⬤───〔 *📜 Command Source* 〕───⬤
\`\`\`js
${truncatedCode}
\`\`\`
╰──────────⊷  
⚡ Full file sent below 📂  
*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ*`;

        // Send image with truncated source code
        await conn.sendMessage(from, { 
            image: { url: `https://files.catbox.moe/3m1vb1.png` },
            caption: formattedCode,
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

        // Send full source file from a safe temporary file
        const tempFileName = `temp-${commandName}-${Date.now()}.js`;
        const tempFilePath = path.join(__dirname, "temp", tempFileName);

        // Ensure temp directory exists
        if (!fs.existsSync(path.join(__dirname, "temp"))) {
            fs.mkdirSync(path.join(__dirname, "temp"));
        }

        fs.writeFileSync(tempFilePath, fullCode);

        await conn.sendMessage(from, { 
            document: fs.readFileSync(tempFilePath),
            mimetype: 'text/javascript',
            fileName: `${commandName}.js`
        }, { quoted: mek });

        // Optional: delete the temp file after sending (comment this if you want to keep it)
        // fs.unlinkSync(tempFilePath);

    } catch (e) {
        console.error("Error in .get command:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
