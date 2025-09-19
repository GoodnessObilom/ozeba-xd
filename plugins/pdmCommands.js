const fs = require('fs');
const { cmd, commands } = require('../command');
const pdmDatabasePath = './lib/pdmsettings.json'; // Path to the PDM settings file

// Helper function to get PDM status
const getPDMStatus = (groupJid) => {
    try {
        const data = JSON.parse(fs.readFileSync(pdmDatabasePath, 'utf8'));
        return data[groupJid] || false;
    } catch (err) {
        console.error("Error reading PDM settings:", err);
        return false;
    }
};

// Helper function to update PDM status
const updatePDMStatus = (groupJid, status) => {
    try {
        let data = {};
        if (fs.existsSync(pdmDatabasePath)) {
            data = JSON.parse(fs.readFileSync(pdmDatabasePath, 'utf8'));
        }
        data[groupJid] = status;
        fs.writeFileSync(pdmDatabasePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error("Error updating PDM settings:", err);
    }
};

// Command to toggle PDM ON/OFF
cmd({
    pattern: "pdm",
    desc: "Enable or Disable promotion/demotion announcment for a group",
    category: "group",
    use: '[on/off]',
    filename: __filename
}, async (conn, mek, m, { from, reply, senderNumber, groupAdmins, command, args, isPatron, isAdmin, isGroup }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups!");
        if (!isAdmin && !isPatron) return reply("❌ You must be an admin to use this command!");

        const status = args[0]?.toLowerCase();
        if (!["on", "off"].includes(status)) {
            return reply("❌ Please use .pdm on or .pdm off to toggle the feature.");
        }

        if (status === "on") {
            updatePDMStatus(from, true);
            await conn.sendMessage(from, {
                text: `✅ *PDM is now enabled* for this group. Admin promotions and demotions will be notified.`,
            });
        } else if (status === "off") {
            updatePDMStatus(from, false);
            await conn.sendMessage(from, {
                text: `✅ *PDM is now disabled* for this group. Admin promotions and demotions will no longer be notified.`,
            });
        }
    } catch (err) {
        console.error("PDM command error:", err);
        reply(`❌ An error occurred while processing your request.`);
    }
});

module.exports = { getPDMStatus, updatePDMStatus };