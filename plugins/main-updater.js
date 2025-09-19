const { cmd } = require("../command");
const axios = require('axios');
const fs = require('fs');
const path = require("path");
const AdmZip = require("adm-zip");
const { setCommitHash, getCommitHash } = require('../data/updateDB');

cmd({
    pattern: "update",
    alias: ["upgrade", "sync"],
    desc: "Update the bot to the latest version.",
    category: "misc",
    filename: __filename
}, async (client, message, args, { reply, isPatron }) => {
    if (!isPatron) return reply("*📛 This command is restricted to owners only.*");

    await client.sendMessage(message.key.remoteJid, {
        react: { text: "🔄", key: message.key }
    });

    const stylish = (text, emoji) => `*${emoji} 卄 ${text} 卄 ${emoji}*`;
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    try {
        await reply(stylish("Checking ", "🔍"));

        const { data: commitData } = await axios.get(
            "https://api.github.com/repos/GoodnessObilom/ozeba/commits/main"
        );

        if (await getCommitHash() === commitData.sha) {
            return reply(stylish("Already latest version", "✅"));
        }

        await reply(stylish("Updating 𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡", "⚡"));

        const zipPath = path.join(__dirname, "update_temp.zip");
        fs.writeFileSync(
            zipPath,
            (await axios.get("https://github.com/GoodnessObilom/ozeba/archive/main.zip", {
                responseType: "arraybuffer"
            })).data
        );

        new AdmZip(zipPath).extractAllTo(path.join(__dirname, 'temp_update'), true);

        copyFolderSync(
            path.join(__dirname, 'temp_update/ozeba-xd-main'),
            path.join(__dirname, '..')
        );

        await setCommitHash(commitData.sha);
        fs.unlinkSync(zipPath);
        fs.rmSync(path.join(__dirname, 'temp_update'), { recursive: true });

        await reply(stylish("✅ Updated! Restarting now...", "🔄"));

        // Delay for 1 second to ensure reply is sent before exit
        await sleep(1000);
        process.exit(0);

    } catch (error) {
        console.error("Update error:", error);
        reply(stylish("Update failed", "❌"));
    }
});

function copyFolderSync(source, target) {
    if (!fs.existsSync(source)) return;
    fs.existsSync(target) || fs.mkdirSync(target, { recursive: true });

    fs.readdirSync(source).forEach(item => {
        const src = path.join(source, item);
        const dest = path.join(target, item);

        const skipFiles = ['config.js', 'app.json', 'manage-env.js', '.env'];
        const isJsonFile = item.endsWith('.json');

        if (skipFiles.includes(item) || isJsonFile) return;

        fs.lstatSync(src).isDirectory()
            ? copyFolderSync(src, dest)
            : fs.copyFileSync(src, dest);
    });
}