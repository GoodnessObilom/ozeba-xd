const { cmd } = require("../command");
const { sleep } = require("../lib/functions");
const { exec } = require("child_process");

cmd({
    pattern: "restart",
    desc: "Restart OZEBA XD",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { reply, isPatron }) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "🔄",
            key: m.key
        }
    });

    if (!isPatron) {
        return reply("❌ Only group admins can use this command.");
    }

    reply("*♻️ OZEBA XD IS NOW RESTARTING , PLEASE WAIT...*");
    await sleep(1500); // give time for reply to send

    // Delay restart to allow time for session save
    setTimeout(() => {
        exec("pm2 restart OZEBA-XD", (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return reply(`❌ Restart error: ${error.message}`);
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return reply(`⚠️ stderr: ${stderr}`);
            }
            console.log(`stdout: ${stdout}`);
            // Do not reply here — the bot will be restarting.
        });
    }, 2000); // delay gives session time to save
});
