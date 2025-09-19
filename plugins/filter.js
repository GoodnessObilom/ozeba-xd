const fs = require('fs');
const path = require('path');
const { cmd } = require('../command');

// Paths
const pfilterPath = path.join(__dirname, '../lib/pfilter.json');
const gfilterPath = path.join(__dirname, '../lib/gfilter.json');

// Load filters
const pfilter = fs.existsSync(pfilterPath) ? JSON.parse(fs.readFileSync(pfilterPath)) : {};
const gfilter = fs.existsSync(gfilterPath) ? JSON.parse(fs.readFileSync(gfilterPath)) : {};

// Save functions
function savePFilter() {
    fs.writeFileSync(pfilterPath, JSON.stringify(pfilter, null, 2));
}

function saveGFilter() {
    fs.writeFileSync(gfilterPath, JSON.stringify(gfilter, null, 2));
}

const { exec } = require('child_process');

// PFILTER - Set Private Filter
cmd({
    pattern: "pfilter",
    desc: "Set private chat auto reply.",
    category: "owner",
    filename: __filename,
    use: "<trigger> | <response>"
}, async (conn, mek, m, { args, reply, isPatron, isGroup }) => {
    if (!isPatron) return reply('*📛 This command is restricted to owners only.*');
    if (isGroup) return reply('❌ This command is for private chat only.');

    if (!args[0]) return reply('Example: .pfilter hi | hello');

    let [word, response] = args.join(" ").split("|").map(v => v.trim());

    if (!word || !response) return reply('❌ Invalid format. Example: .pfilter hi | hello');

    let existed = pfilter[word.toLowerCase()] ? true : false;

    pfilter[word.toLowerCase()] = response;
    savePFilter();

    await reply(`✅ ${existed ? "Updated" : "Added"} private filter:\n\nWhen someone says *${word}*, bot will reply with *${response}*`);

    // Restart the bot using pm2
    exec('pm2 restart PATRON-MD', (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error restarting bot: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`❌ Error: ${stderr}`);
            return;
        }
        console.log(`✅ Bot restarted successfully: ${stdout}`);
    });
});

// GFILTER - Set Group Filter
cmd({
    pattern: "gfilter",
    desc: "Set group chat auto reply.",
    category: "owner",
    filename: __filename,
    use: "<trigger> | <response>"
}, async (conn, mek, m, { args, reply, isPatron, isGroup }) => {
    if (!isPatron) return reply('*📛 This command is restricted to owners only.*');
    if (!isGroup) return reply('❌ This command is for group chats only.');

    if (!args[0]) return reply('Example: .gfilter welcome | hey there');

    let [word, response] = args.join(" ").split("|").map(v => v.trim());

    if (!word || !response) return reply('❌ Invalid format. Example: .gfilter welcome | hey there');

    let existed = gfilter[word.toLowerCase()] ? true : false;

    gfilter[word.toLowerCase()] = response;
    saveGFilter();

    await reply(`✅ ${existed ? "Updated" : "Added"} group filter:\n\nWhen someone says *${word}*, bot will reply with *${response}*`);

    // Restart the bot using pm2
    exec('pm2 restart OZEBA-XD', (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error restarting bot: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`❌ Error: ${stderr}`);
            return;
        }
        console.log(`✅ Bot restarted successfully: ${stdout}`);
    });
});

// LIST ALL FILTERS (Private & Group)
cmd({
    pattern: "listfilters",
    alias: ["listf", "filters", "listfilter"],
    desc: "List all private and group chat filters.",
    category: "owner",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    let text = "📋 *Filters List:*\n\n";

    let privateCount = 0;
    for (let key in pfilter) {
        text += `*Private:* ➤ *${key}* → _${pfilter[key]}_\n`;
        privateCount++;
    }

    let groupCount = 0;
    for (let key in gfilter) {
        text += `*Group:* ➤ *${key}* → _${gfilter[key]}_\n`;
        groupCount++;
    }

    if (privateCount === 0 && groupCount === 0) {
        text = "❌ No filters found.";
    }

    reply(text);
});

// DELETE PFILTER
cmd({
    pattern: "pstop",
    alias: ["delpfilter", "delpf"],
    desc: "Delete a private chat filter.",
    category: "owner",
    filename: __filename,
    use: "<trigger>"
}, async (conn, mek, m, { args, reply, isPatron, isGroup }) => {
    if (!isPatron) return reply('*📛 This command is restricted to owners only.*');
    if (isGroup) return reply('❌ This command is for private chat only.');

    if (!args[0]) return reply('Example: .delpfilter hi');

    const word = args.join(" ").toLowerCase();
    if (!(word in pfilter)) {
        return reply(`❌ Filter not found for word *${word}*.`);
    }

    // Delete filter before sending the response
    delete pfilter[word];
    savePFilter();

    await reply(`✅ Deleted private filter for *${word}*`);

    // Restart the bot using pm2
    exec('pm2 restart PATRON-MD', (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error restarting bot: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`❌ Error: ${stderr}`);
            return;
        }
        console.log(`✅ Bot restarted successfully: ${stdout}`);
    });
});

// DELETE GFILTER
cmd({
    pattern: "gstop",
    alias: ["delgfilter", "delgf"],
    desc: "Delete a group chat filter.",
    category: "owner",
    filename: __filename,
    use: "<trigger>"
}, async (conn, mek, m, { args, reply, isPatron, isGroup }) => {
    if (!isPatron) return reply('*📛 This command is restricted to owners only.*');
    if (!isGroup) return reply('❌ This command is for group chats only.');

    if (!args[0]) return reply('Example: .delgfilter welcome');

    const word = args.join(" ").toLowerCase();
    if (!(word in gfilter)) {
        return reply(`❌ Filter not found for word *${word}*.`);
    }

    // Delete filter before sending the response
    delete gfilter[word];
    saveGFilter();

    await reply(`✅ Deleted group filter for *${word}*`);

    // Restart the bot using pm2
    exec('pm2 restart PATRON-MD', (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error restarting bot: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`❌ Error: ${stderr}`);
            return;
        }
        console.log(`✅ Bot restarted successfully: ${stdout}`);
    });
});
