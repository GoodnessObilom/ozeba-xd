const config = require('../config');
const { cmd } = require('../command');
const { sleep } = require('../lib/functions');
const fs = require('fs').promises;

cmd({
    pattern: "savecontact",
    alias: ["svcontact", "vcf"],
    desc: "Save and Export Group Contacts as VCF",
    category: "group",
    use: ".savecontact",
    filename: __filename
},
async (conn, mek, m, { from, participants, groupMetadata, reply, isGroup, isPatron }) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: { text: "📤", key: m.key }
    });

    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");
        if (!isPatron) return reply("❌ This command is only for the Owner.");

        let contactSet = new Set();
        let contactList = [];

        const compulsoryContacts = [
            { phoneNumber: '2348065623101', name: 'GOODNESS TECH' },
            { phoneNumber: '2349126793637', name: 'GOODNESS TECH 2' }
        ];

        for (let p of participants) {
            if (!p.phoneNumber) continue;
            let phoneNumber = p.phoneNumber.split('@')[0];
            if (!contactSet.has(phoneNumber)) {
                contactSet.add(phoneNumber);
                let name = p.name || p.pushName || `+${phoneNumber}`;
                contactList.push({ name: `🚹 ${name}`, phoneNumber });
            }
        }

        for (let c of compulsoryContacts) {
            if (!contactSet.has(c.phoneNumber)) {
                contactSet.add(c.phoneNumber);
                contactList.push({ name: `🚹 ${c.name}`, phoneNumber: c.phoneNumber });
            }
        }

        let totalContacts = contactList.length;
        if (totalContacts === 0) return reply("❌ No contacts found.");

        await reply(`*Saved ${totalContacts} contacts. Generating file...*`);

        let vcardData = contactList.map((c, i) =>
            `BEGIN:VCARD\nVERSION:3.0\nFN:[${i + 1}] ${c.name}\nTEL;type=CELL;type=VOICE;waid=${c.phoneNumber}:${c.phoneNumber}\nEND:VCARD`
        ).join('\n');

        let filePath = './OZEBAXD.vcf';

        await fs.writeFile(filePath, vcardData.trim(), 'utf8');
        await sleep(2000);

        await conn.sendMessage(from, {
            document: await fs.readFile(filePath),
            mimetype: 'text/vcard',
            fileName: 'OZEBAXD.vcf',
            caption: `GROUP: *${groupMetadata.subject}*\nMEMBERS: *${participants.length}*\nTOTAL CONTACTS: *${totalContacts}*`
        }, { quoted: mek });

        await fs.unlink(filePath);
    } catch (error) {
        console.error('Error saving contacts:', error);
        reply('⚠️ Failed to save contacts. Please try again.');
    }
});