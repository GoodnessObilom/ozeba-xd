const fs = require("fs");
const path = require("path");

// Ensure database directory exists
const databaseDir = path.join(__dirname, "database");
if (!fs.existsSync(databaseDir)) {
    fs.mkdirSync(databaseDir, { recursive: true });
}

const linkDetectionFile = path.join(databaseDir, "linkDetection.json");

// Ensure file exists and has proper structure
const ensureLinkDetectionFile = () => {
    try {
        if (!fs.existsSync(linkDetectionFile)) {
            fs.writeFileSync(linkDetectionFile, JSON.stringify({}));
            return { success: true, message: "Created new linkDetection.json file" };
        }
        return { success: true };
    } catch (error) {
        return { success: false, message: `Error creating linkDetection.json: ${error.message}` };
    }
};

// Load active group settings
const getLinkDetectionSettings = () => {
    const ensureResult = ensureLinkDetectionFile();
    if (!ensureResult.success) {
        throw new Error(ensureResult.message);
    }

    try {
        const data = fs.readFileSync(linkDetectionFile, "utf-8");
        const settings = JSON.parse(data);
        return { success: true, settings };
    } catch (error) {
        throw new Error(`Error reading linkDetection.json: ${error.message}`);
    }
};

// Enable link detection with a specific mode
const enableLinkDetection = (groupJid, mode) => {
    try {
        const { settings } = getLinkDetectionSettings();
        settings[groupJid] = mode;
        fs.writeFileSync(linkDetectionFile, JSON.stringify(settings, null, 2));
        return { success: true, message: `Enabled ${mode} mode for group ${groupJid}` };
    } catch (error) {
        throw new Error(`Error enabling link detection: ${error.message}`);
    }
};

// Disable link detection
const disableLinkDetection = (groupJid) => {
    try {
        const { settings } = getLinkDetectionSettings();
        delete settings[groupJid];
        fs.writeFileSync(linkDetectionFile, JSON.stringify(settings, null, 2));
        return { success: true, message: `Disabled link detection for group ${groupJid}` };
    } catch (error) {
        throw new Error(`Error disabling link detection: ${error.message}`);
    }
};

// Get mode (kick, delete, warn)
const getLinkDetectionMode = (groupJid) => {
    try {
        const { settings } = getLinkDetectionSettings();
        const mode = settings[groupJid] || null;
        return { success: true, mode };
    } catch (error) {
        throw new Error(`Error getting mode: ${error.message}`);
    }
};

module.exports = {
    enableLinkDetection,
    disableLinkDetection,
    getLinkDetectionMode
}; 