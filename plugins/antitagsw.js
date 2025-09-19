const { cmd } = require("../command");
const fs = require("fs");
const path = require("path");
const warnings = require("../lib/warnings");
const config = require('../config');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

// Path to the JSON file that stores AntiTagSW status per group
const antiTagSWPath = path.join(__dirname, "../lib/antitagsw.json");

// Ensure the file exists
if (!fs.existsSync(antiTagSWPath)) fs.writeFileSync(antiTagSWPath, '{}', 'utf-8');

// Helper functions to load and save JSON with error handling
const loadAntiTagSW = () => {
    try {
        const data = fs.readFileSync(antiTagSWPath, 'utf-8');
        return data ? JSON.parse(data) : {};
    } catch (e) {
        console.error('[AntiTagSW] Failed to load or parse antitagsw.json:', e);
        fs.writeFileSync(antiTagSWPath, '{}', 'utf-8');
        return {};
    }
};
const saveAntiTagSW = (data) => {
    try {
        fs.writeFileSync(antiTagSWPath, JSON.stringify(data, null, 4), 'utf-8');
    } catch (e) {
        console.error('[AntiTagSW] Failed to save antitagsw.json:', e);
    }
};

cmd({
    pattern: "anti-tag",
    alias: ["antistatustag", "antitagsw", "antitagstatus", "antitag"],
    desc: "Enable/Disable Anti Status Tagging for this group",
    category: "group",
    use: ".anti-tag on/off"
}, async (conn, mek, m, { from, isGroup, senderNumber, isAdmins, isBotAdmins, reply, args }) => {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    if (!isAdmins) return reply("❌ Only group admins can use this command.");
    if (!isBotAdmins) return reply("❌ I need to be an admin to perform this action.");
    if (!args[0]) return reply("⚠️ Usage: .anti-tag on / off");

    const option = args[0].toLowerCase();
    let antiTagSWGroup = loadAntiTagSW();

    if (option === "on") {
        if (antiTagSWGroup[from] === true) return reply("✅ AntiTag is already enabled in this group.");
        antiTagSWGroup[from] = true;
        saveAntiTagSW(antiTagSWGroup);
        return reply("✅ AntiTag has been ENABLED in this group!");
    } else if (option === "off") {
        if (!antiTagSWGroup[from]) return reply("❌ AntiTag is already disabled in this group.");
        antiTagSWGroup[from] = false;
        saveAntiTagSW(antiTagSWGroup);
        return reply("❌ AntiTag has been DISABLED in this group!");
    } else {
        return reply("⚠️ Please choose either 'on' or 'off'");
    }
});

module.exports = {
    loadAntiTagSW,
    saveAntiTagSW
};

