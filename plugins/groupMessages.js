const { cmd } = require('../command');
const { loadSettings, saveSettings } = require('../lib/groupMessagesStorage');

let settings = loadSettings();

let welcomeSettings = settings.welcome || {};
let goodbyeSettings = settings.goodbye || {};

const { getPDMStatus } = require('./pdmCommands');

const defaultWelcomeMessage = `╭═══ ⪩『 *ᴡᴇʟᴄᴏᴍᴇ* 』⪨ ═══⊷
❀ *ʜᴇʏ* {user}
❀ *ɢʀᴏᴜᴘ:* {gname}
┌──────────────────
* *ɢʀᴏᴜᴘ ᴅᴇsᴄʀɪᴘᴛɪᴏɴ:*
──────
* {gdesc}
* *ᴊᴏɪɴᴇᴅ {count}*
* *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ*
╰═══════════════⊷`;
const defaultGoodbyeMessage = `╭═══ ⪩『 *ɢᴏᴏᴅʙʏᴇ* 』⪨ ═══⊷
❀ *ʙʏᴇ* {user}
❀ *ɢʀᴏᴜᴘ:* {gname}
┌──────────────────
* *ʟᴇғᴛ ᴀᴛ {count} ᴍᴇᴍʙᴇʀs*
* *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ*
╰═══════════════⊷`;
function formatMessage(template, userMention, groupName, memberCount, groupDesc) {
  return template
    .replace(/{user}/g, userMention)
    .replace(/{gname}/g, groupName || "this group")
    .replace(/{count}/g, memberCount || "0")
    .replace(/{gdesc}/g, groupDesc || "No description available.");
}

// Welcome Command
cmd({
  pattern: "welcome",
  alias: ["welc", "wm"],
  desc: `Manage welcome messages in groups`,
  category: "group",
  use: "[on/off]",
  filename: __filename
}, async (conn, mek, m, { from, args, reply, isGroup, isBotAdmins }) => {
  await conn.sendMessage(m.chat, { react: { text: "👋", key: m.key } });

  if (!isGroup) return reply("❌ This command only works in groups");
  if (!isBotAdmins) return reply("❌ Bot needs admin rights to manage welcome messages");

  try {
    if (!args.length) {
      const setting = welcomeSettings[from];
      const status = setting?.enabled 
        ? `✅ *Enabled*\n💬 Message: ${setting.message || defaultWelcomeMessage}`
        : "❌ *Disabled*";
      return reply(`Current welcome settings:\n\n${status}\n\nUsage:\n• welcome on/off\n• welcome <custom message>\n\n📌 *Tip:* You can use these placeholders in your message:\n• {user} - mentions the new member\n• {gname} - group name\n• {count} - member count\n• {gdesc} - group description`);
    }

    const option = args[0].toLowerCase();
    if (option === "on") {
      welcomeSettings[from] = { enabled: true, message: defaultWelcomeMessage };
    } else if (option === "off") {
      welcomeSettings[from] = { enabled: false };
    } else {
      welcomeSettings[from] = { enabled: true, message: args.join(" ") };
    }

    settings.welcome = welcomeSettings;
    saveSettings(settings);
    return reply(option === "off" ? "❌ Welcome messages disabled" : "✅ Welcome messages enabled\n\nUsage:\n• Use welcome <custom message> to chnage default message\n\n📌 *Tip:* You can use these placeholders in your message:\n• {user} - mentions the new member\n• {gname} - group name\n• {count} - member count\n• {gdesc} - group description");

  } catch (e) {
    console.error('Welcome command error:', e);
    return reply("❌ Error updating welcome settings");
  }
});

// Goodbye Command
cmd({
  pattern: "goodbye",
  alias: ["gb", "bye"],
  desc: "Manage goodbye messages in groups",
  category: "group",
  use: "[on/off]",
  filename: __filename
}, async (conn, mek, m, { from, args, reply, isGroup, isBotAdmins }) => {
  await conn.sendMessage(m.chat, { react: { text: "👋", key: m.key } });

  if (!isGroup) return reply("❌ This command only works in groups");
  if (!isBotAdmins) return reply("❌ Bot needs admin rights to manage goodbye messages");

  try {
    if (!args.length) {
      const setting = goodbyeSettings[from];
      const status = setting?.enabled 
        ? `✅ *Enabled*\n💬 Message: ${setting.message || defaultGoodbyeMessage}`
        : "❌ *Disabled*";
      return reply(`Current goodbye settings:\n\n${status}\n\nUsage:\n• goodbye on/off\n• goodbye <custom message>\n\n📌 *Tip:* You can use these placeholders in your message:\n• {user} - mentions the leaving member\n• {gname} - group name\n• {count} - member count\n• {gdesc} - group description`);
    }

    const option = args[0].toLowerCase();
    if (option === "on") {
      goodbyeSettings[from] = { enabled: true, message: defaultGoodbyeMessage };
    } else if (option === "off") {
      goodbyeSettings[from] = { enabled: false };
    } else {
      goodbyeSettings[from] = { enabled: true, message: args.join(" ") };
    }

    settings.goodbye = goodbyeSettings;
    saveSettings(settings);
    return reply(option === "off" ? "❌ Goodbye messages disabled" : "✅ Goodbye messages enabled\nUsage:\n• goodbye <custom message> to chnage default message\n\n📌 *Tip:* You can use these placeholders in your message:\n• {user} - mentions the leaving member\n• {gname} - group name\n• {count} - member count\n• {gdesc} - group description");

  } catch (e) {
    console.error('Goodbye command error:', e);
    return reply("❌ Error updating goodbye settings");
  }
});

// Group Participants Update Handler
function registerGroupMessages(conn) {
  conn.ev.on("group-participants.update", async (update) => {
    const groupId = update.id;

    try {
      // ✅ Check if connection is still open before calling groupMetadata
      if (!conn?.ws || conn.ws.readyState !== 1) {
        return;
      }

      const groupMetadata = await conn.groupMetadata(groupId);
      const groupName = groupMetadata?.subject || "this group";
      const memberCount = groupMetadata?.participants?.length || 0;
      const groupDesc = groupMetadata?.desc?.toString() || groupMetadata?.description?.toString() || "No description available.";

      const handleMessage = async (participant, isWelcome) => {
        const settings = isWelcome ? welcomeSettings[groupId] : goodbyeSettings[groupId];
        if (!settings?.enabled) return;

        const template = settings.message || (isWelcome ? defaultWelcomeMessage : defaultGoodbyeMessage);
        const mention = `@${participant.split('@')[0]}`;
        const message = formatMessage(template, mention, groupName, memberCount, groupDesc);

        // Get user's profile picture and push name
        let ppUrl, pushName;
        try {
            ppUrl = await conn.profilePictureUrl(participant, 'image');
        } catch {
            ppUrl = 'https://files.catbox.moe/9i9pdm.jpeg';
        }

        try {
            const userInfo = await conn.fetchStatus(participant);
            pushName = userInfo?.pushname || participant.split('@')[0];
        } catch {
            pushName = participant.split('@')[0];
        }

        const messageWithName = message.replace(/{user}/g, `@${participant.split('@')[0]} (${pushName})`);

        await conn.sendMessage(groupId, { 
          image: { url: ppUrl },
          caption: messageWithName,
          mentions: [participant]
        });
      };

      if (update.action === "add") {
        for (const participant of update.participants) {
          await handleMessage(participant, true);
        }
      } 
      else if (update.action === "remove") {
        for (const participant of update.participants) {
          await handleMessage(participant, false);
        }
      }
      else if (update.action === "promote" || update.action === "demote") {
        if (getPDMStatus && getPDMStatus(groupId)) {
          for (const participant of update.participants) {
            const actor = update.author || update.actor || participant;
            const action = update.action === "promote" ? "promoted" : "demoted";
            const emoji = update.action === "promote" ? "🎉" : "🚫";
            await conn.sendMessage(groupId, {
              text: `${emoji} *@${actor.split('@')[0]}* ${action} *@${participant.split('@')[0]}*`,
              mentions: [actor, participant]
            });
          }
        }
      }

    } catch (error) {
      if (
        error?.message === 'forbidden' ||
        error?.message === 'item-not-found' ||
        error?.data === 403 ||
        error?.data === 404
      ) {
        return;
      }
      console.error('Group update handler error:', error);
    }
  });
}

module.exports = { registerGroupMessages };