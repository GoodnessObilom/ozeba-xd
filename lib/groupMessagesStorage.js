const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, 'groupMessagesSettings.json');

// Initialize file if it doesn't exist.
if (!fs.existsSync(storageFile)) {
  fs.writeFileSync(storageFile, JSON.stringify({ welcome: {}, goodbye: {} }, null, 2), 'utf8');
}

// Load settings from the JSON file.
function loadSettings() {
  try {
    const data = fs.readFileSync(storageFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading groupMessages settings:", err);
    return { welcome: {}, goodbye: {} };
  }
}

// Save settings to the JSON file.
function saveSettings(settings) {
  try {
    fs.writeFileSync(storageFile, JSON.stringify(settings, null, 2), 'utf8');
  } catch (err) {
    console.error("Error writing groupMessages settings:", err);
  }
}

module.exports = { loadSettings, saveSettings }; 