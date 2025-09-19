const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { cmd } = require('../command');

cmd({
    pattern: "install",
    alias: ["installplugin"],
    desc: "Install a plugin from a Gist (Creator Only)",
    category: "owner",
    filename: __filename,
    use: "<raw-gist-url>",
},
async (conn, mek, m, { args, from, reply, isPatron }) => {
    try {
        // Check if user is creator
        if (!isPatron) {
            return reply("*📛 This command is restricted to owners only.*");
        }

        const rawUrl = args[0];
      
        if (!rawUrl) {
            return reply("❌ Please provide a Gist URL.\nExample: .install https://gist.githubusercontent.com/...");
        }

        // Verify allowed domain
        if (!rawUrl.startsWith("https://gist.githubusercontent.com/GoodnessObilom")) {
            return reply("❌ Only Gists from https://gist.githubusercontent.com/GoodnessObilom are allowed.");
        }

        // Add loading reaction
        await conn.sendMessage(from, {
            react: {
                text: "⏳",
                key: mek.key
            }
        });

        // Get filename from URL
        const urlObj = new URL(rawUrl);
        let filename = path.basename(urlObj.pathname) || `plugin_${Date.now()}.js`;
        
        if (!filename.endsWith(".js")) {
            filename += ".js";
        }

        // Fetch plugin content
        const response = await axios.get(rawUrl, {
            timeout: 10000,
            headers: {
                'Cache-Control': 'no-cache'
            }
        });

        if (!response.data) {
            return reply("❌ Empty response from Gist. Nothing to install.");
        }

        // Ensure plugins directory exists
        const pluginsDir = path.join(__dirname, "..", "plugins");
        if (!fs.existsSync(pluginsDir)) {
            fs.mkdirSync(pluginsDir, { recursive: true });
        }

        // Save plugin file
        const savePath = path.join(pluginsDir, filename);
        fs.writeFileSync(savePath, response.data, "utf8");

        await reply(`✅ Plugin "${filename}" installed successfully.\n♻️ Restarting bot`);

        // Restart bot
        setTimeout(() => {
            process.exit(1);
        }, 1500);

    } catch (err) {
        console.error("Installation Error:", err);
        
        let errorMsg = "❌ Failed to install plugin.";
        if (err.code === "ENOTFOUND") {
            errorMsg = "❌ Could not connect to Gist. Check your internet connection.";
        } else if (err.response?.status === 404) {
            errorMsg = "❌ Gist not found. Please check the URL.";
        } else if (err.message.includes("URL")) {
            errorMsg = "❌ Invalid URL format provided.";
        }
        
        reply(errorMsg);
    }
});