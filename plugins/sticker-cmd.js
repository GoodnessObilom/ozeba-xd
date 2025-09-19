const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const config = require('../config.js');

// Create data directory if it doesn't exist
const DATA_DIR = path.join(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Path for sticker commands storage
const STICKER_COMMANDS_FILE = path.join(DATA_DIR, 'sticker-commands.json');

// Initialize sticker commands file if it doesn't exist
if (!fs.existsSync(STICKER_COMMANDS_FILE)) {
    fs.writeFileSync(STICKER_COMMANDS_FILE, '{}', 'utf8');
}

// Save mappings to file
const saveStickerCommands = (commands) => {
    try {
        fs.writeFileSync(STICKER_COMMANDS_FILE, JSON.stringify(commands, null, 2));
    } catch (error) {
        console.error('Error saving sticker commands:', error);
    }
};

// Load commands from file
const loadStickerCommands = () => {
    try {
        if (fs.existsSync(STICKER_COMMANDS_FILE)) {
            return JSON.parse(fs.readFileSync(STICKER_COMMANDS_FILE, 'utf8'));
        }
        return {};
    } catch (error) {
        console.error('Error loading sticker commands:', error);
        return {};
    }
};

// Command to set a sticker as a command
cmd({
    pattern: "setcmd",
    desc: "Set a sticker to execute a command",
    category: "sticker",
    filename: __filename
}, async (conn, m, store, { args, reply, isPatron }) => {
    try {
        if (!isPatron) {
            return reply("❌ This command is only for the bot creator!");
        }

        if (!args[0]) {
            return reply("❌ Please provide the command to bind to the sticker\n\n*Example:* .setcmd menu");
        }

        // Join all arguments to allow multi-word commands
        const command = args.join(' ').replace(/^[./!#?&^:;`~+=\-,_]/, '');

        if (!m.quoted) {
            return reply("❌ Please reply to a sticker with this command");
        }

        if (m.quoted.mtype !== 'stickerMessage') {
            return reply("❌ Please reply to a sticker (not an image or other media)");
        }

        const stickerData = m.msg.contextInfo?.quotedMessage?.stickerMessage;

        if (!stickerData) {
            return reply("❌ Could not get sticker data. Make sure you're replying to a sticker.");
        }

        let identifier = null;

        if (stickerData.fileSha256) {
            identifier = Buffer.from(stickerData.fileSha256).toString('base64');
        } else if (stickerData.mediaKey) {
            identifier = Buffer.from(stickerData.mediaKey).toString('base64');
        }

        if (!identifier) {
            return reply("❌ Could not get sticker identifier. Please try with a different sticker.");
        }

        const commands = loadStickerCommands();
        commands[identifier] = command;
        saveStickerCommands(commands);

        await reply(`✅ Successfully bound sticker to the command: *${config.PREFIX}${command}*`);

    } catch (error) {
        reply("❌ Error setting command for sticker: " + error.message);
    }
});


// Command to list all sticker commands
cmd({
    pattern: "listcmd",
    desc: "List all sticker commands",
    category: "sticker",
    filename: __filename
}, async (conn, m, store, { reply, isPatron }) => {
    try {
        // Check if user is creator
        if (!isPatron) {
            return reply("❌ This command is only for the bot creator!");
        }

        const commands = loadStickerCommands();
        if (Object.keys(commands).length === 0) {
            return reply("❌ No sticker commands are set");
        }

        let text = "*🎯 Sticker Commands List*\n\n";
        let i = 1;
        for (const [hash, command] of Object.entries(commands)) {
            text += `${i}. Command: ${config.PREFIX}${command}\n`;
            i++;
        }
        
        reply(text);
    } catch (error) {
        console.error('Error in listcmd:', error);
        reply("❌ Error listing sticker commands");
    }
});

// Command to delete a sticker command
cmd({
    pattern: "delcmd",
    desc: "Delete a sticker command binding",
    category: "sticker",
    filename: __filename
}, async (conn, m, store, { reply, isPatron }) => {
    try {
        // Check if user is creator
        if (!isPatron) {
            return reply("❌ This command is only for the bot creator!");
        }

        // Check if the message quotes a sticker
        if (!m.quoted || m.quoted.mtype !== 'stickerMessage') {
            return reply("❌ Please reply to the sticker whose command you want to delete");
        }        // Get sticker data from quoted message's contextInfo
        const stickerData = m.msg.contextInfo?.quotedMessage?.stickerMessage;
        if (!stickerData) {
            return reply("❌ Could not get sticker data. Make sure you're replying to a sticker.");
        }

        // Get identifier using same logic as setcmd
        let fileHash = null;
        if (stickerData.fileSha256) {
            fileHash = Buffer.from(stickerData.fileSha256).toString('base64');
        } else if (stickerData.mediaKey) {
            fileHash = Buffer.from(stickerData.mediaKey).toString('base64');
        }

        if (!fileHash) {
            return reply("❌ Could not get sticker identifier. Please try with a different sticker.");
        }
        
        // Remove the mapping
        const commands = loadStickerCommands();
        if (!commands[fileHash]) {
            return reply("❌ This sticker doesn't have any command bound to it");
        }

        const command = commands[fileHash];
        delete commands[fileHash];
        saveStickerCommands(commands);

        reply(`✅ Successfully removed command binding: *${config.PREFIX}${command}*`);
    } catch (error) {
        console.error('Error in delcmd:', error);
        reply("❌ Error deleting sticker command");
    }
});
