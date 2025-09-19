const fs = require("fs");
const path = require("path");

// Ensure database directory exists
const databaseDir = path.join(__dirname, "database");
if (!fs.existsSync(databaseDir)) {
    fs.mkdirSync(databaseDir, { recursive: true });
}

const warningsFile = path.join(databaseDir, "warnings.json");

// Ensure file exists and has proper structure
const ensureWarningsFile = () => {
    try {
        if (!fs.existsSync(warningsFile)) {
            fs.writeFileSync(warningsFile, JSON.stringify({}));
            return { success: true, message: "Created new warnings.json file" };
        }
        return { success: true };
    } catch (error) {
        return { success: false, message: `Error creating warnings.json: ${error.message}` };
    }
};

// Get warnings for a user in a group
const getWarnings = (groupJid, participant) => {
    const ensureResult = ensureWarningsFile();
    if (!ensureResult.success) {
        throw new Error(ensureResult.message);
    }

    try {
        const data = fs.readFileSync(warningsFile, "utf-8");
        const warnings = JSON.parse(data);
        return warnings[groupJid]?.[participant] || 0;
    } catch (error) {
        throw new Error(`Error reading warnings: ${error.message}`);
    }
};

// Add a warning for a user in a group
const addWarning = (groupJid, participant) => {
    const ensureResult = ensureWarningsFile();
    if (!ensureResult.success) {
        throw new Error(ensureResult.message);
    }

    try {
        const data = fs.readFileSync(warningsFile, "utf-8");
        const warnings = JSON.parse(data);
        
        if (!warnings[groupJid]) {
            warnings[groupJid] = {};
        }
        
        warnings[groupJid][participant] = (warnings[groupJid][participant] || 0) + 1;
        fs.writeFileSync(warningsFile, JSON.stringify(warnings, null, 2));
        
        return warnings[groupJid][participant];
    } catch (error) {
        throw new Error(`Error adding warning: ${error.message}`);
    }
};

// Reset warnings for a user in a group
const resetWarnings = (groupJid, participant) => {
    const ensureResult = ensureWarningsFile();
    if (!ensureResult.success) {
        throw new Error(ensureResult.message);
    }

    try {
        const data = fs.readFileSync(warningsFile, "utf-8");
        const warnings = JSON.parse(data);
        
        if (warnings[groupJid] && warnings[groupJid][participant]) {
            delete warnings[groupJid][participant];
            fs.writeFileSync(warningsFile, JSON.stringify(warnings, null, 2));
        }
    } catch (error) {
        throw new Error(`Error resetting warnings: ${error.message}`);
    }
};

module.exports = {
    getWarnings,
    addWarning,
    resetWarnings
}; 