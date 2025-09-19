const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

// Path to session files
const sessionPath = path.join(__dirname, '../session');
// Sleep function for pauses
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

cmd({
    pattern: "clearsession",
    desc: "Clear session data to fix decryption/waiting for message errors",
    category: "owner",
    filename: __filename
}, async (conn, mek, m, { from, reply, isPatron }) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "🧹",
            key: m.key
        }
    });

    try {
        // Ensure only the creator can run this
        if (!isPatron) return reply("❌ This command is only for the bot creator!");

        // Ensure the sessions directory exists
        if (!fs.existsSync("./sessions")) {
            fs.mkdirSync("./sessions");
        }

        // Read the sessions folder
        fs.readdir("./sessions", async function (err, files) {
            if (err) {
                console.log('Unable to scan directory: ' + err);
                return reply("❌ Unable to scan directory: " + err);
            }

            if (files.length === 0) {
                return reply("✅ The sessions folder is empty. No files to delete.");
            }

            let filteredArray = files.filter(item => item.startsWith("pre-key") ||
                item.startsWith("sender-key") || item.startsWith("session-") || item.startsWith("app-state"));

            let teks = `Detected ${filteredArray.length} memory files <3\n\n`;

            if (filteredArray.length === 0) return reply(`${teks}`);

            filteredArray.map(function (e, i) {
                teks += (i + 1) + `. ${e}\n`;
            });

            reply(teks);

            // Wait for 2 seconds before proceeding
            await sleep(2000);

            reply("❌ Deleting memory files...");

            // Delete the session files (excluding 'creds.json')
            for (const file of filteredArray) {
                if (file !== 'creds.json') { // Skip 'creds.json'
                    fs.unlinkSync(`./sessions/${file}`);
                }
            }

            // Wait for 2 seconds before confirming
            await sleep(2000);

            return reply("✅ Successfully deleted all memory files in the sessions folder (except 'creds.json').");
        });
    } catch (e) {
        console.error('Clear session error:', e);
        return reply("❌ An error occurred while clearing session data.");
    }
});
