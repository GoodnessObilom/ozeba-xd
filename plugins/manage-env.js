//---------------------------------------------------------------------------
//           𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡  
//---------------------------------------------------------------------------
//  ⚠️ DO NOT MODIFY THIS FILE ⚠️  
//---------------------------------------------------------------------------
const { cmd, commands } = require('../command');
const config = require('../config');
const prefix = config.PREFIX;
const fs = require('fs');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');
const { writeFileSync } = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Add the saveConfig function at the top of the file after the imports
const saveConfig = (key, value) => {
    const configPath = path.join(__dirname, '../config.js');
    let configText = fs.readFileSync(configPath, 'utf-8');
    
    // Create a simpler regex pattern
    const pattern = new RegExp(`${key}:\\s*process\\.env\\.${key}\\s*\\|\\|\\s*["'].*?["']`);
    const newLine = `${key}: process.env.${key} || "${value}"`;
    
    configText = configText.replace(pattern, newLine);
    fs.writeFileSync(configPath, configText, 'utf8');
};

cmd({
    pattern: "setprefix",
    alias: ["prefix"],
    desc: "Change the bot's command prefix.",
    category: "settings",
    filename: __filename,
    use: "[new prefix]"
}, async (conn, mek, m, { from, args, isPatron, reply }) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "🔧",
            key: m.key
        }
    });

    if (!isPatron) return reply("*📛 This command is restricted to owners only.*");

    const newPrefix = args[0];
    if (!newPrefix) return reply("❌ Please provide a new prefix.\n\n📌 Example: `.setprefix !`");

    // Validate prefix - only allow specific characters
    const validPrefixes = [".", "/", "!", "#", "?", "&", "^", ":", ";", "`", "~", "+", "=", "-", "_", ","];
    if (!validPrefixes.includes(newPrefix)) {
        return reply("❌ Invalid prefix! Please use one of these: " + validPrefixes.join(" "));
    }

    try {
        // Update the prefix in memory
        config.PREFIX = newPrefix;
        
        // Use saveConfig to properly handle environment variable format
        saveConfig('PREFIX', newPrefix);

        await reply(`✅ Prefix successfully changed to *${newPrefix}*\n\n♻️ Restarting bot...`);

        await sleep(1500); // short delay to allow message to send

        // Restart the bot using pm2
        exec('pm2 restart 𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡', (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ PM2 Restart Error: ${error.message}`);
               return;
            }
            if (stderr) {
                console.error(`❌ PM2 stderr: ${stderr}`);
                return;
            }
            console.log(`✅ PM2 stdout: ${stdout}`);
        });

    } catch (err) {
        console.error("❌ Failed to update PREFIX:", err);
        reply("❌ Something went wrong while updating the prefix.");
    }
});

cmd({
    pattern: "mode",
    alias: ["setmode", "botmode", "changemode"],
    desc: "Set bot mode to private or public.",
    category: "owner", // Changed to owner category to enforce creator-only access
    filename: __filename,
    use: "[private/public]"
}, async (conn, mek, m, { from, args, isPatron, reply }) => {
    // Strict creator check before any action
    if (!isPatron) {
        return reply("*📛 This command is restricted to bot owners only!*");
    }

    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "🚹",
            key: m.key
        }
    });

    if (!args[0]) {
        return reply(`📌 Current mode: *${config.MODE}*\n\nUsage: .mode private OR .mode public`);
    }

    const modeArg = args[0].toLowerCase();
    if (modeArg === "private") {
        config.MODE = "private";
        saveConfig('MODE', 'private');
        return reply("✅ Bot mode is now set to *PRIVATE*.");
    } else if (modeArg === "public") {
        config.MODE = "public";
        saveConfig('MODE', 'public');
        return reply("✅ Bot mode is now set to *PUBLIC*.");
    } else {
        return reply("❌ Invalid mode. Please use `.mode private` or `.mode public`.");
    }
});

cmd({
    pattern: "auto-typing",
    alias: ["autotype", "typing", "autotyper"],
    description: "Enable or disable auto-typing feature.",
    category: "settings",
    filename: __filename,
    use: "[on/off]"
}, async (conn, mek, m, { from, args, isPatron, reply }) => {
    if (!isPatron) return reply("*📛 This command is restricted to bot owners only!*");

    const status = args[0]?.toLowerCase();
    if (!["on", "off"].includes(status)) {
        return reply("*🚹 Example: .auto-typing on*");
    }

    const newValue = status === "on" ? "true" : "false";
    config.AUTO_TYPING = newValue;
    saveConfig('AUTO_TYPING', newValue);
    await reply(`✅ Auto-typing has been turned *${status}*.`);
});

// anti call 

cmd({
  pattern: "anti-call",
  alias: ["anticall"],
  description: "Enable or disable auto call reject feature.",
  category: "settings",
  filename: __filename,
  use: "[on/off]"
}, async (conn, mek, m, { from, args, isPatron, reply }) => {
  if (!isPatron) return reply("*📛 This command is restricted to bot owners only!*");

  const status = args[0]?.toLowerCase();
  if (!["on", "off"].includes(status)) {
    return reply("*🧾 Example:* .anti-call on");
  }

  const newValue = status === "on" ? "true" : "false";
  config.ANTI_CALL = newValue;
  saveConfig('ANTI_CALL', newValue); // Make sure `saveConfig` is defined

  await reply(`📵 Anti-call has been turned *${status.toUpperCase()}*.`);
});

//mention reply 


cmd({
    pattern: "mention-reply",
    alias: ["menetionreply", "mee", "mention"],
    description: "Set bot status to always online or offline.",
    category: "settings",
    filename: __filename,
    use: "[on/off]"
},    
async (conn, mek, m, { from, args, isPatron, reply }) => {
    if (!isPatron) return reply("*📛 Only the owner can use this command!*");

    const status = args[0]?.toLowerCase();
    if (args[0] === "on") {
        config.MENTION_REPLY = "true";
        saveConfig('MENTION_REPLY', 'true');
        return reply("Mention Reply feature is now enabled.");
    } else if (args[0] === "off") {
        config.MENTION_REPLY = "false";
        saveConfig('MENTION_REPLY', 'false');
        return reply("Mention Reply feature is now disabled.");
    } else {
        return reply(`_example: .mention-reply on_`);
    }
});

//--------------------------------------------
// ALWAYS_ONLINE COMMANDS
//--------------------------------------------
cmd({
    pattern: "always-online",
    alias: ["alwaysonline", "online", "status"],
    description: "Set bot status to always online or offline.",
    category: "settings",
    filename: __filename,
    use: "[on/off]"
},    
async (conn, mek, m, { from, args, isPatron, reply }) => {
    if (!isPatron) return reply("*📛 Only the owner can use this command!*");

    const status = args[0]?.toLowerCase();
    if (!["on", "off"].includes(status)) {
        return reply("*🚹 Example: .always-online on*");
    }

    const newValue = status === "on" ? "true" : "false";
    config.ALWAYS_ONLINE = newValue;
    saveConfig('ALWAYS_ONLINE', newValue);
    await conn.sendPresenceUpdate(status === "on" ? "available" : "unavailable", from);
    return reply(`Bot is now ${status === "on" ? "online" : "offline"}.`);
});
//--------------------------------------------
//  AUTO_RECORDING COMMANDS
//--------------------------------------------
cmd({
    pattern: "auto-recording",
    alias: ["autorecording", "recording", "autorecord"],
    description: "Enable or disable auto-recording feature.",
    category: "settings",
    filename: __filename,
    use: "[on/off]"
},    
async (conn, mek, m, { from, args, isPatron, reply }) => {
    if (!isPatron) return reply("*📛 Only the owner can use this command!*");

    const status = args[0]?.toLowerCase();
    if (!["on", "off"].includes(status)) {
        return reply("*🚹 Example: .auto-recording on*");
    }

    const newValue = status === "on" ? "true" : "false";
    config.AUTO_RECORDING = newValue;
    saveConfig('AUTO_RECORDING', newValue);
    
    if (status === "on") {
        await conn.sendPresenceUpdate("recording", from);
        return reply("Auto recording is now enabled. Bot is recording...");
    } else {
        await conn.sendPresenceUpdate("available", from);
        return reply("Auto recording has been disabled.");
    }
});
//--------------------------------------------
// AUTO_VIEW_STATUS COMMANDS
//--------------------------------------------
cmd({
    pattern: "auto-seen",
    alias: ["autostatusview", "autoview", "seen"],
    desc: "Enable or disable auto-viewing of statuses",
    category: "settings",
    filename: __filename,
    use: "[on/off]"
},    
async (conn, mek, m, { from, args, isPatron, reply }) => {
    if (!isPatron) return reply("*📛 Only the owner can use this command!*");

    const status = args[0]?.toLowerCase();
    if (args[0] === "on") {
        config.AUTO_STATUS_SEEN = "true";
        saveConfig('AUTO_STATUS_SEEN', 'true');
        return reply("Auto-viewing of statuses is now enabled.");
    } else if (args[0] === "off") {
        config.AUTO_STATUS_SEEN = "false";
        saveConfig('AUTO_STATUS_SEEN', 'false');
        return reply("Auto-viewing of statuses is now disabled.");
    } else {
        return reply(`*🚹 Example: .auto-seen on*`);
    }
}); 
//--------------------------------------------
// AUTO_LIKE_STATUS COMMANDS
//--------------------------------------------
cmd({
    pattern: "status-react",
    alias: ["statusreaction", "statusreact", "reactstatus"],
    desc: "Enable or disable auto-liking of statuses",
    category: "settings",
    filename: __filename,
    use: "[on/off]"
},    
async (conn, mek, m, { from, args, isPatron, reply }) => {
    if (!isPatron) return reply("*📛 Only the owner can use this command!*");

    const status = args[0]?.toLowerCase();
    if (args[0] === "on") {
        config.AUTO_STATUS_REACT = "true";
        saveConfig('AUTO_STATUS_REACT', 'true');
        return reply("Auto-reacting of statuses is now enabled.");
    } else if (args[0] === "off") {
        config.AUTO_STATUS_REACT = "false";
        saveConfig('AUTO_STATUS_REACT', 'false');
        return reply("Auto-liking of statuses is now disabled.");
    } else {
        return reply(`Example: .status-react on`);
    }
});

//--------------------------------------------
//  READ-MESSAGE COMMANDS
//--------------------------------------------
cmd({
    pattern: "read-message",
    alias: ["autoread", "read", "autoreadmsg"],
    desc: "Enable or disable readmessage.",
    category: "settings",
    filename: __filename,
    use: "[on/off]"
},    
async (conn, mek, m, { from, args, isPatron, reply }) => {
    if (!isPatron) return reply("*📛 Only the owner can use this command!*");

    const status = args[0]?.toLowerCase();
    if (args[0] === "on") {
        config.READ_MESSAGE = "true";
        saveConfig('READ_MESSAGE', 'true');
        return reply("readmessage feature is now enabled.");
    } else if (args[0] === "off") {
        config.READ_MESSAGE = "false";
        saveConfig('READ_MESSAGE', 'false');
        return reply("readmessage feature is now disabled.");
    } else {
        return reply(`_example: .readmessage on_`);
    }
});


//--------------------------------------------
//  ANI-BAD COMMANDS
//--------------------------------------------
cmd({
    pattern: "anti-bad",
    alias: ["antibadword", "badword", "antibad"],
    desc: "Enable or disable antibad.",
    category: "settings",
    filename: __filename,
    use: "[on/off]"
},    
async (conn, mek, m, { from, args, isPatron, reply }) => {
    if (!isPatron) return reply("*📛 Only the owner can use this command!*");

    const status = args[0]?.toLowerCase();
    if (args[0] === "on") {
        config.ANTI_BAD_WORD = "true";
        saveConfig('ANTI_BAD_WORD', 'true');
        return reply("*anti bad word is now enabled.*");
    } else if (args[0] === "off") {
        config.ANTI_BAD_WORD = "false";
        saveConfig('ANTI_BAD_WORD', 'false');
        return reply("*anti bad word feature is now disabled*");
    } else {
        return reply(`_example: .antibad on_`);
    }
});
//--------------------------------------------
//  AUTO-REPLY COMMANDS
//--------------------------------------------
cmd({
    pattern: "auto-reply",
    alias: ["autoreply", "chatbot", "autoresponse"],
    desc: "Enable or disable auto-reply.",
    category: "settings",
    filename: __filename,
    use: "[on/off]"
},    
async (conn, mek, m, { from, args, isPatron, reply }) => {
    if (!isPatron) return reply("*📛 Only the owner can use this command!*");

    const status = args[0]?.toLowerCase();
    if (args[0] === "on") {
        config.AUTO_REPLY = "true";
        saveConfig('AUTO_REPLY', 'true');
        return reply("*auto-reply is now enabled.*");
    } else if (args[0] === "off") {
        config.AUTO_REPLY = "false";
        saveConfig('AUTO_REPLY', 'false');
        return reply("auto-reply feature is now disabled.");
    } else {
        return reply(`*🚹 Example: .auto-reply on*`);
    }
});

//--------------------------------------------
//   AUTO-REACT COMMANDS
//--------------------------------------------
cmd({
    pattern: "auto-react",
    alias: ["autoreact", "react", "autoreaction"],
    desc: "Enable or disable the autoreact feature",
    category: "settings",
    filename: __filename,
    use: "[on/off]"
},    
async (conn, mek, m, { from, args, isPatron, reply }) => {
    if (!isPatron) return reply("*📛 Only the owner can use this command!*");

    const status = args[0]?.toLowerCase();
    if (args[0] === "on") {
        config.AUTO_REACT = "true";
        saveConfig('AUTO_REACT', 'true');
        await reply("*autoreact feature is now enabled.*");
    } else if (args[0] === "off") {
        config.AUTO_REACT = "false";
        saveConfig('AUTO_REACT', 'false');
        await reply("autoreact feature is now disabled.");
    } else {
        await reply(`*🚹 Example: .auto-react on*`);
    }
});
//--------------------------------------------
//  STATUS-REPLY COMMANDS
//--------------------------------------------
cmd({
    pattern: "status-reply",
    alias: ["autostatusreply", "statusreply", "replystatus"],
    desc: "Enable or disable status-reply.",
    category: "settings",
    filename: __filename,
    use: "[on/off]"
},    
async (conn, mek, m, { from, args, isPatron, reply }) => {
    if (!isPatron) return reply("*📛 Only the owner can use this command!*");

    const status = args[0]?.toLowerCase();
    if (args[0] === "on") {
        config.AUTO_STATUS_REPLY = "true";
        saveConfig('AUTO_STATUS_REPLY', 'true');
        return reply("status-reply feature is now enabled.");
    } else if (args[0] === "off") {
        config.AUTO_STATUS_REPLY = "false";
        saveConfig('AUTO_STATUS_REPLY', 'false');
        return reply("status-reply feature is now disabled.");
    } else {
        return reply(`*🚹 Example: .status-reply on*`);
    }
});

//--------------------------------------------
//  STATUS-MSG COMMAND
//--------------------------------------------
cmd({
    pattern: "status-msg",
    alias: ["statusmessage", "setstatusmsg", "autostatusmsg"],
    desc: "Set the auto-reply message for status replies.",
    category: "settings",
    filename: __filename,
    use: "[message]"
}, async (conn, mek, m, { from, args, isPatron, reply }) => {
    if (!isPatron) return reply("*📛 Only the owner can use this command!*");

    const newMsg = args.join(" ");
    if (!newMsg) return reply("❌ Please provide a new auto-reply message.\n\n📌 Example: `.status-msg Seen by 𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡 🤍`");

    config.AUTO_STATUS_MSG = newMsg;
    saveConfig('AUTO_STATUS_MSG', newMsg);
    return reply(`✅ Status auto-reply message successfully updated to:\n*${newMsg}*`);
});

//--------------------------------------------
//  ANTI-DEL-PATH COMMAND
//--------------------------------------------
cmd({
    pattern: "antidel-path",
    alias: ["setantidelpath", "antidelpath", "delpath"],
    desc: "Set the path for anti-delete logs.\n\n📌 Example: `.antidel-path log` for ur dm or `.antidel-path same` for same place it was deleted",
    category: "settings",
    filename: __filename,
    use: "[log/same]"
}, async (conn, mek, m, { from, args, isPatron, reply }) => {
    if (!isPatron) return reply("*📛 Only the owner can use this command!*");

    const newPath = args.join(" ");
    if (!newPath) return reply("❌ Please provide a new path for anti-delete logs.\n\n📌 Example: `.antidel-path log` or `.antidel-path same`");

    config.ANTI_DEL_PATH = newPath;
    saveConfig('ANTI_DEL_PATH', newPath);
    return reply(`✅ Anti-delete log path successfully updated to:\n*${newPath}*`);
});

//--------------------------------------------
//  STICKER-NAME COMMAND
//--------------------------------------------
cmd({
    pattern: "sticker-name",
    alias: ["setstickername", "stickername"],
    desc: "Set the sticker pack name.",
    category: "settings",
    filename: __filename,
    use: "[name]"
}, async (conn, mek, m, { from, args, isPatron, reply }) => {
    if (!isPatron) return reply("*📛 Only the owner can use this command!*");

    const newName = args.join(" ");
    if (!newName) return reply("❌ Please provide a new sticker name.\n\n📌 Example: `.sticker-name MyStickerPack`");

    config.STICKER_NAME = newName;
    saveConfig('STICKER_NAME', newName);
    return reply(`✅ Sticker name successfully updated to *${newName}*.`);
});

//--------------------------------------------
//  CUSTOM-REACT COMMAND
//--------------------------------------------
cmd({
    pattern: "custom-react",
    alias: ["setcustomreact", "customreact"],
    desc: "Enable or disable custom emoji reactions.",
    category: "settings",
    filename: __filename,
    use: "[on/off]"
}, async (conn, mek, m, { from, args, isPatron, reply }) => {
    if (!isPatron) return reply("*📛 Only the owner can use this command!*");

    const status = args[0]?.toLowerCase();
    if (!["on", "off"].includes(status)) {
        return reply("*🚹 Example: .custom-react on*");
    }

    const newValue = status === "on" ? "true" : "false";
    config.CUSTOM_REACT = newValue;
    saveConfig('CUSTOM_REACT', newValue);
    return reply(`✅ Custom react feature has been turned *${status}*.`);
});

//--------------------------------------------
//  setcustomemojis COMMAND
//--------------------------------------------
cmd({
    pattern: "custom-react-emojis",
    alias: ["setcustomemojis", "customemojis"],
    desc: "Set custom emojis for reactions.",
    category: "settings",
    filename: __filename,
    use: "[emojis]"
}, async (conn, mek, m, { from, args, isPatron, reply }) => {
    if (!isPatron) return reply("*📛 Only the owner can use this command!*");

    const emojis = args.join(" ");
    if (!emojis) return reply("❌ Please provide a list of emojis separated by commas.\n\n📌 Example: `.setcustomemojis ❤️,💖,💗`");

    config.CUSTOM_REACT_EMOJIS = emojis;
    saveConfig('CUSTOM_REACT_EMOJIS', emojis);
    return reply(`✅ Custom react emojis successfully updated to *${emojis}*.`);
});

//--------------------------------------------
//  OWNER-NUMBER COMMAND
//--------------------------------------------
cmd({
    pattern: "owner-number",
    alias: ["setownernumber", "ownernumber"],
    desc: "Set the bot owner's number.",
    category: "settings",
    filename: __filename,
    use: "[number]"
}, async (conn, mek, m, { from, args, isPatron, reply }) => {
    if (!isPatron) return reply("*📛 Only the owner can use this command!*");

    const newNumber = args[0];
    if (!newNumber) return reply("❌ Please provide a valid phone number.\n\n📌 Example: `.owner-number 234813XXXX`");

    config.OWNER_NUMBER = newNumber;
    saveConfig('OWNER_NUMBER', newNumber);
    return reply(`✅ Owner number successfully updated to *${newNumber}*.`);
});

//--------------------------------------------
//  OWNER-NAME COMMAND
//--------------------------------------------
cmd({
    pattern: "owner-name",
    alias: ["setownername", "ownername"],
    desc: "Set the bot owner's name.",
    category: "settings",
    filename: __filename,
    use: "[name]"
}, async (conn, mek, m, { from, args, isPatron, reply }) => {
    if (!isPatron) return reply("*📛 Only the owner can use this command!*");

    const newName = args.join(" ");
    if (!newName) return reply("❌ Please provide a new owner name.\n\n📌 Example: `.owner-name Patron`");

    config.OWNER_NAME = newName;
    saveConfig('OWNER_NAME', newName);
    return reply(`✅ Owner name successfully updated to *${newName}*.`);
});

//--------------------------------------------
//  GET-LID COMMAND
//--------------------------------------------
cmd({
    pattern: "getlid",
    desc: "Get LID (Linked ID) of yourself or replied user (Only works in groups)",
    category: "settings",
    filename: __filename,
    use: ".getlid or reply .getlid to get someone's LID",
},
async (conn, mek, m, { reply, from }) => {
    // Check if command is used in a group
    const isGroup = from.endsWith('@g.us');
    if (!isGroup) {
        return reply("❌ Dont do this command again\nSigned: Patron™!");
    }

    // Check if message is a reply
    const isReply = m.quoted ? true : false;
    let userNumber;

    if (isReply) {
        // Get the sender ID of replied message
        userNumber = m.quoted.sender?.split("@")[0] || m.quoted.participant?.split("@")[0];
    } else {
        // If not a reply, get requester's ID
        userNumber = m.sender?.split("@")[0];
    }

    if (!userNumber) return reply("❌ Could not get the user ID");

    let lid = userNumber + "@lid";
    reply(`${isReply ? "Their" : "Your"} LID: ${lid}\nDont do this command again\nSigned: Patron™`);
});

//--------------------------------------------
//  SET-LID COMMAND
//--------------------------------------------
cmd({
    pattern: "setlid",
    desc: "You will be able to use the bot in groups with permissions",
    use: ".setlid [yourlid]",
    category: "owner",
    filename: __filename
}, async (conn, mek, m, { from, text, args, reply }) => {
    try {
        // Owner verification
        if (!conn?.user?.id) return reply("❌ Bot is not fully connected yet");
        const botOwnerJid = conn.user.id.split(":")[0] + "@s.whatsapp.net";
        
        if (m.sender !== botOwnerJid) {
            return reply("*Dont do this command again\nSigned: Patron™*");
        }

        if (!text) return reply("❓ Dont do this command again\nSigned: Patron™");

        // Format the lid
        let newLid = text.trim();
        
        // Remove @lid if it exists, then add it back
        newLid = newLid.replace(/@lid$/, "");
        // Validate number format
        if (!/^\d+$/.test(newLid)) {
            return reply("❌ Dont do this command again\nSigned: Patron™.");
        }
        newLid = newLid + "@lid";

        // Read and update config.js
        const configPath = path.join(__dirname, '../config.js');
        let configContent = fs.readFileSync(configPath, 'utf8');
        
        // Extract current lid value - now handling comma-separated values
        const lidMatch = configContent.match(/lid:\s*process\.env\.lid\s*\|\|\s*"([^"]*)"/) || [];
        const currentLid = lidMatch[1] || "";

        // Prepare new lid value with proper comma formatting
        let newLidValue;
        if (currentLid) {
            // If current lid exists, add new one with proper comma formatting
            const lids = currentLid.split(',').map(lid => lid.trim());
            lids.push(newLid);
            newLidValue = lids.join(', ');
        } else {
            newLidValue = newLid;
        }

        // Update the lid line in config.js
        configContent = configContent.replace(
            /(lid:\s*process\.env\.lid\s*\|\|\s*")[^"]*(")/,
            `$1${newLidValue}$2`
        );

        // Save the updated config
        fs.writeFileSync(configPath, configContent);
        
        // Show success message first
        await reply(`✅ Successfully added LID: ${newLid}\nDont do this command again\nSigned: Patron™`);
        await sleep(1000);
        
        // Then show restart message and restart
        await reply(`♻️ Restarting bot to apply changes...`);
        await sleep(500);
    } catch (error) {
        console.error("setlid error:", error);
        return reply("❌ Error updating LID: " + error.message);
    }
});

