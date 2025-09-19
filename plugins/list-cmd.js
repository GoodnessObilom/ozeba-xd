const config = require('../config')
const { cmd, commands } = require('../command')
const { runtime } = require('../lib/functions')

cmd({
    pattern: "list",
    alias: ["commands", "listcmds", "listcommands"],
    desc: "Show all available commands with descriptions",
    category: "menu",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    
    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "📜",
            key: m.key
        }
    });try {
        // Count total commands and aliases
        const totalCommands = Object.keys(commands).length
        let aliasCount = 0
        Object.values(commands).forEach(cmd => {
            if (cmd.alias) aliasCount += cmd.alias.length
        })

        // Get unique categories count
        const categories = [...new Set(Object.values(commands).map(c => c.category))]

        let menuText = `╭───『 *𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡 COMMANDS* 』───⳹
│
│ *🛠️ BOT INFORMATION*
│ • 🤖 Bot Name: 𝙊𝙯𝙚𝙗𝙖 𝙓𝘿
│ • 👑 Owner: ${config.OWNER_NAME}
│ • ⚙️ Prefix: [ ${config.PREFIX} ]
│ • 📦 Version: 2.0.0
│ • 🕒 Runtime: ${runtime(process.uptime())}
│
│ *📊 COMMAND STATS*
│ • 📜 Total Commands: ${totalCommands}
│ • 🔄 Total Aliases: ${aliasCount}
│ • 🗂️ Categories: ${categories.length}
│
╰────────────────⳹\n`

        // Organize commands by category
        const categorized = {}
        categories.forEach(cat => {
            categorized[cat] = Object.values(commands).filter(c => c.category === cat)
        })

        // Generate menu for each category
        for (const [category, cmds] of Object.entries(categorized)) {
            menuText += `╭───『 *${category.toUpperCase()}* 』───⳹
│ • 📂 Commands: ${cmds.length}
│ • 🔄 Aliases: ${cmds.reduce((a, c) => a + (c.alias ? c.alias.length : 0), 0)}
│
`

            cmds.forEach(c => {
                menuText += `┃▸📄 COMMAND: .${c.pattern}\n`
                menuText += `┃▸❕ ${c.desc || 'No description available'}\n`
                if (c.alias && c.alias.length > 0) {
                    menuText += `┃▸🔹 Aliases: ${c.alias.map(a => `.${a}`).join(', ')}\n`
                }
                if (c.use) {
                    menuText += `┃▸💡 Usage: ${c.use}\n`
                }
                menuText += `│\n`
            })
            
            menuText += `╰────────────────⳹\n`
        }

        menuText += `\n📝 *Note*: Use ${config.PREFIX}help <command> for detailed help\n`
        menuText += `> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ* `

        await conn.sendMessage(
            from,
            {
                image: { url: 'https://files.catbox.moe/3m1vb1.png' },
                caption: menuText,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 2,
                    isForwarded: true
                }
            },
            { quoted: mek }
        )

    } catch (e) {
        console.error('Command List Error:', e)
        reply(`❌ Error generating command list: ${e.message}`)
    }
})


cmd({
    pattern: "help",
    alias: ["h", "menuhelp"],
    desc: "Get detailed info about a specific command",
    category: "menu",
    filename: __filename,
    use: "<command name>"
}, async (conn, mek, m, { args, reply }) => {

    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "📖",
            key: m.key
        }
    });

    try {
        // If no command specified, prompt user
        if (!args[0]) {
            return reply(`❌ Please specify a command.\n\nExample: *${config.PREFIX}help list*`);
        }

        const name = args[0].toLowerCase();
        const cmd = Object.values(commands).find(c => 
            c.pattern === name || (c.alias && c.alias.includes(name))
        );

        if (!cmd) {
            return reply(`❌ Command *${name}* not found!\nUse *${config.PREFIX}list* to view all commands.`);
        }

        let helpText = `╭───『 *HELP FOR ${config.PREFIX}${cmd.pattern}* 』───⳹
│
┃▸📄 *COMMAND*: ${config.PREFIX}${cmd.pattern}
┃▸❕ *DESCRIPTION*: ${cmd.desc || 'No description available'}
┃▸📂 *CATEGORY*: ${cmd.category || 'Uncategorized'}
${cmd.alias && cmd.alias.length > 0 ? `┃▸🔹 *ALIASES*: ${cmd.alias.map(a => `${config.PREFIX}${a}`).join(', ')}` : ''}
┃▸💡 *USAGE*: ${config.PREFIX}${cmd.pattern}${cmd.use ? ` ${cmd.use}` : ''}
│
╰────────────────⳹

📝 *Note*: Don't include <> when using the command.
`;

        reply(helpText);

    } catch (e) {
        console.error(e);
        reply('❌ An error occurred while fetching help information.');
    }
});
