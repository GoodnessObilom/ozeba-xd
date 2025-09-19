const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');
const path = require('path');

// Path to bank data file
const bankDataPath = path.join(__dirname, '../lib/bank-data.json');

// Function to load bank info
function loadBankInfo() {
    try {
        if (fs.existsSync(bankDataPath)) {
            const data = fs.readFileSync(bankDataPath, 'utf8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.error('Error loading bank data:', e);
    }
    return {
        bankName: '',
        holderName: '',
        accountNumber: ''
    };
}

// Function to save bank info
function saveBankInfo(data) {
    try {
        fs.writeFileSync(bankDataPath, JSON.stringify(data, null, 2));
        return true;
    } catch (e) {
        console.error('Error saving bank data:', e);
        return false;
    }
}

// Load initial bank info
let bankInfo = loadBankInfo();

// Command to set bank information
cmd({
    pattern: "setaza",
    desc: "Set bank account information (Usage: .setaza holder_name | bank_name | account_number)",
    category: "owner",
    filename: __filename
}, async (conn, mek, m, { from, reply, args, isPatron, text }) => {
    try {
        await conn.sendMessage(m.key.remoteJid, {
            react: {
                text: "💳",
                key: m.key
            }
        });

        if (!isPatron) {
            await conn.sendMessage(from, { text: "*📛 This command is restricted to owners only.*" });
            return;
        }

        if (!text || text.trim() === "") {
            await conn.sendMessage(from, { 
                text: "❌ *Missing Bank Info!*\n\nPlease use the correct format to set your bank details:\n\n`.setaza Holder Name | Bank Name | Account Number`\n\nExample:\n`.setaza John Doe | First Bank | 1234567890`"
            });
            return;
        }

        const parts = text.split("|").map(part => part.trim());

        if (parts.length !== 3) {
            await conn.sendMessage(from, {
                text: "❌ *Invalid Format!*\n\nPlease enter your details like this:\n\n*.setaza Jane Doe | GTBank | 0123456789*"
            });
            return;
        }

        let [holderName, bankName, accountNumber] = parts;

        // Convert to uppercase
        holderName = holderName.toUpperCase();
        bankName = bankName.toUpperCase();

        if (!/^\d+$/.test(accountNumber)) {
            await conn.sendMessage(from, {
                text: "❌ *Invalid Format!*\n\nPlease enter your details like this:\n\n*.setaza patron | GTBank | 0123456789*"
            });
            return;
        }

        bankInfo = {
            bankName,
            holderName,
            accountNumber
        };

        if (!saveBankInfo(bankInfo)) {
            await conn.sendMessage(from, {
                text: "❌ Error saving bank information. Please try again."
            });
            return;
        }

        await conn.sendMessage(from, {
            text: `🏦 *BANK DETAILS*\n\n` +
                  `🚹 *${bankInfo.holderName}*\n` +
                  `🔢 *${bankInfo.accountNumber}*\n` +
                  `🏦 *${bankInfo.bankName}*\n` +
                  `You can use .aza to view this information.`
        });

    } catch (e) {
        console.error('Set bank info error:', e);
        await conn.sendMessage(from, {
            text: "❌ An error occurred while setting bank information."
        });
    }
});




// Command to get bank information
cmd({
    pattern: "aza",
    alias: ["bank"],
    desc: "Get bank account information",
    category: "main",
    filename: __filename,
    use: ".aza"
}, async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(m.key.remoteJid, {
            react: {
                text: "💳", 
                key: m.key  
            }
        });

        // Load latest bank info from file
        bankInfo = loadBankInfo();

        // Check if bank info is set
        if (!bankInfo.bankName || !bankInfo.holderName || !bankInfo.accountNumber) {
            await conn.sendMessage(from, {
                text: "❌ Bank information has not been set yet.\nPlease use .setaza command first.\n.setaza Holder Name | Bank Name | Account Number"
            });
            return;
        }

        // Format and send bank information
        const bankInfoMessage = `🏦 *BANK DETAILS*\n\n` +
                              `🚹 *${bankInfo.holderName}*\n` +
                              `🔢 *${bankInfo.accountNumber}*\n` +
                              `🏦 *${bankInfo.bankName}*\n` +
                              `*SEND SCREENSHOT AFTER PAYMENT*`;

        await conn.sendMessage(from, { text: bankInfoMessage });

    } catch (e) {
        console.error('Get bank info error:', e);
        await conn.sendMessage(from, {
            text: "❌ An error occurred while getting bank information."
        });
    }
});