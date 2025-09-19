const { cmd ,commands } = require('../command');
const { exec } = require('child_process');
const config = require('../config');
const {sleep} = require('../lib/functions')
const { downloadContentFromMessage } = require("baileys");

// 1. Shutdown Bot
cmd({
    pattern: "shutdown",
    desc: "Shutdown the bot.",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, isPatron, reply }) => {
    if (!isPatron) return reply("❌ Only the bot owner can shutdown the bot!");

    await conn.sendMessage(from, {
        react: {
            text: "🛑",
            key: m.key
        }
    });

    await reply("🛑 Shutting down the bot...");

    await sleep(1500); // Add a small delay for smoother UX
    process.exit(0); // Proper and clean shutdown
});


// 2. Broadcast Message to All Groups
cmd({
    pattern: "broadcast",
    desc: "Broadcast a message to all groups.",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, isPatron, args, reply }) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "📢",
            key: m.key
        }
    });
    if (!isPatron) return reply("❌ You are not the owner!");
    if (args.length === 0) return reply("📢 Please provide a message to broadcast.");

    const text = args.join(' ');
    const message = `📢 *ANNOUNCEMENT!*\n\n${text}\n\n*𝙊𝙯𝙚𝙗𝙖 𝙓𝘿 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡 ʙʀᴏᴀᴅᴄᴀsᴛ*`;

    try {
        const groups = Object.keys(await conn.groupFetchAllParticipating());
        let count = 0;

        for (const groupId of groups) {
            await conn.sendMessage(groupId, { text: message }, { quoted: mek });
            count++;
        }

        reply(`📢 Broadcast complete!\nMessage sent to ${count} group(s).`);
    } catch (err) {
        reply(`❌ Broadcast failed: ${err.message}`);
    }
});

// 3. Set Profile Picture

cmd(
  {
    pattern: "setpp",
    desc: "Set bot profile picture.",
    category: "owner",
    filename: __filename,
  },
  async (conn, mek, m, { reply, senderNumber }) => {
    // 1) React so the user knows we’ve seen the command
    await conn.sendMessage(m.key.remoteJid, {
      react: { text: "🖼️", key: m.key },
    });

    // 3) Determine the bot owner's IDs from conn.user
    const botOwner1 = conn.user.id.split(":")[0];
    const botOwner2 = conn.user.lid ? conn.user.lid.split(":")[0] : null;

    // 4) Only allow if sender matches one of the owner IDs
    if (senderNumber !== botOwner1 && senderNumber !== botOwner2) {
      return reply("❌ Only group admins can use this command.");
    }

    // 5) Grab the extendedTextMessage context and the quoted node
    const quotedCtx = m.message.extendedTextMessage?.contextInfo;
    const quotedMsgNode = quotedCtx?.quotedMessage;

    // 6) If there’s no quotedMessage or it’s not an image, bail
    if (!quotedMsgNode || !quotedMsgNode.imageMessage) {
      return reply("❌ Please reply to an *image*.");
    }

    try {
      // 7) Use downloadContentFromMessage to get the image stream
      const stream = await downloadContentFromMessage(
        quotedMsgNode.imageMessage,
        "image"
      );

      let buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      // 8) Determine the JID to update (the bot itself)
      const botJid = conn.user.id.split(":")[0] + "@s.whatsapp.net";

      if (!botJid) {
        return reply("❌ Unable to retrieve bot user ID.");
      }

      // 9) Pass the raw Buffer directly to updateProfilePicture
      await conn.updateProfilePicture(botJid, buffer);
      return reply("🖼️ Profile picture updated successfully!");
    } catch (error) {
      return reply(`❌ Error updating profile picture: ${error.message}`);
    }
  }
);

// 6. Clear All CCha

cmd({
  pattern: "clear",
  desc: "Clear chat for bot account (owner only)",
  category: "owner",
  filename: __filename
}, async (conn, m, mek, { from, isPatron, reply }) => {
  if (!isPatron) return reply("❌ Only the bot owners can use this command.");

  try {
    const jid = m.chat;

    // Simple getLastMessageInChat using current message (fallback)
    const getLastMessageInChat = async (jid) => {
      // If you don't have a message store, fallback to the current triggering message
      return m; // current message is used as the last known one
    };

    const lastMsgInChat = await getLastMessageInChat(jid);

    if (!lastMsgInChat?.key || !lastMsgInChat?.messageTimestamp) {
      console.warn("⚠️ Cannot clear: missing key or timestamp.");
      return;
    }

    await conn.chatModify({
      delete: true,
      lastMessages: [
        {
          key: lastMsgInChat.key,
          messageTimestamp: lastMsgInChat.messageTimestamp
        }
      ]
    }, jid);

    await sleep(1500);
    reply("✅ Chat cleared from bot account.");
  } catch (err) {
    reply(`❌ Failed to clear chat:\n\n${err.message || err.toString()}`);
  }
});

// 8. Group JIDs List
cmd({
    pattern: "gjid",
    desc: "Get the list of JIDs for all groups the bot is part of.",
    category: "owner",
    react: "",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply }) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "📝",
            key: m.key
        }
    });
    if (!isOwner) return reply("❌ You are not the owner!");
    const groups = await conn.groupFetchAllParticipating();
    const groupJids = Object.keys(groups).join('\n');
    reply(`📝 *Group JIDs:*\n\n${groupJids}`);
});


// delete 

cmd({
    pattern: "delete",
    alias: ["del", "delmsg"],
    desc: "Delete a message (reply to a message)",
    category: "owner",
    filename: __filename
}, async (Void, citel, text, { isPatron }) => {
    if (!isPatron) return citel.reply("❌ Only the bot owner can delete messages.");
    
    try {
        // Check if there's a quoted message
        if (!citel.quoted) {
            return citel.reply("⚠️ Please reply to the message you want to delete.");
        }

        // Get the correct message key (works for both private and group chats)
        const key = {
            remoteJid: citel.quoted.chat,  // Use chat instead of fakeObj
            id: citel.quoted.id,
            fromMe: citel.quoted.fromMe || false,
            participant: citel.quoted.sender  // Important for group messages
        };


        // First try: Modern deletion method
        try {
            await Void.sendMessage(citel.chat, { delete: key });
        } catch (modernError) {
            
            // Fallback: Legacy deletion method
            await Void.sendMessage(citel.chat, {
                text: "Deleting message...",
                delete: key
            });
        }

        // Send success reaction
        await Void.sendMessage(citel.chat, {
            react: {
                text: "✅",
                key: citel.key
            }
        });

    } catch (err) {
        console.error("Delete Error:", err);
        let errorMsg = "❌ Failed to delete message.";
        
        if (err.message.includes("MessageNotFound")) {
            errorMsg += "\nMessage not found or already deleted.";
        } else if (err.message.includes("NotAllowed")) {
            errorMsg += "\nI need to be admin to delete others' messages in groups.";
        } else if (err.message.includes("participant")) {
            errorMsg += "\nCouldn't identify message sender in group.";
        } else if (err.message.includes("remoteJid")) {
            errorMsg += "\nInvalid message format.";
        }
        
        // Additional group-specific checks
        if (citel.isGroup) {
            errorMsg += "\n\nNote: In groups, I can only:";
            errorMsg += "\n- Delete my own messages anytime";
            errorMsg += "\n- Delete others' messages if I'm admin";
        }
        
        return citel.reply(errorMsg);
    }
});


