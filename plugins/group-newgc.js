//---------------------------------------------------------------------------
//           PATRON-MD  
//---------------------------------------------------------------------------
//  ⚠️ DO NOT MODIFY THIS FILE ⚠️  
//---------------------------------------------------------------------------
const { cmd, commands } = require('../command');
const config = require('../config');
const prefix = config.PREFIX;
const fs = require('fs');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');
const { writeFileSync } = require('fs');
const path = require('path');

cmd({
  pattern: "newgc",
  alias: ["creategc"],
  category: "group",
  desc: "Create a new group with only the sender added.",
  filename: __filename,
}, async (conn, mek, m, { args, sender, reply, senderNumber, isGroup }) => {
  try {
    if (isGroup) return reply("❌ This command can only be used in private chat with the bot.");

    const botOwner1 = conn.user.id.split(":")[0];
    const botOwner2 = conn.user.lid ? conn.user.lid.split(":")[0] : null;

    if (senderNumber !== botOwner1 && senderNumber !== botOwner2) {
      return reply("❌ Only the bot owner can use this command");
    }

    const groupName = args.join(" ").trim();

    if (!groupName) {
      return reply(`⚠️ *Usage:* ${prefix}newgc <group_name>\n\n❌ *Error:* Group name cannot be empty.`);
    }

    if (groupName.length > 25) {
      return reply(`❌ Group name too long. Use less than 25 characters.`);
    }

    const normalizedSender = sender.endsWith("@s.whatsapp.net")
      ? sender
      : sender + "@s.whatsapp.net";

    const group = await conn.groupCreate(groupName, [normalizedSender]);

    await sleep(3000); // Let WhatsApp finalize group creation

    const inviteCode = await conn.groupInviteCode(group.id).catch(e => {
      console.error("Error getting invite code:", e);
      return null;
    });

    reply(
      `✅ *Group created successfully!*

🆔 *Group Name:* ${groupName}
👤 *Added:* @${senderNumber}
🔗 *Invite Link:* https://chat.whatsapp.com/${inviteCode}
`,
    );

  } catch (e) {
    console.error("Error in newgc:", e);
    if (e.message?.includes('Connection Closed') || e.message?.includes('Timed Out')) {
      reply("❌ Connection error. Please try again after a few seconds.");
    } else {
      reply("❌ Failed to create group. Please try again.");
    }
  }
});