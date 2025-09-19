const { cmd } = require("../command");

cmd({
  pattern: "save",
  alias: ["sendme"],
  desc: "Forwards quoted message back to user and saves WhatsApp status",
  category: "utility",
  filename: __filename
}, async (client, message, match, { from }) => {
  await client.sendMessage(message.key.remoteJid, {
    react: {
      text: "📤",
      key: message.key
    }
  });

  try {
    let quotedMessage = match.quoted || message.reply_message;
    if (!quotedMessage) {
      return await client.sendMessage(from, {
        text: "*🍁 Please reply to a message!*"
      }, { quoted: message });
    }

    const buffer = await quotedMessage.download();
    const mtype = quotedMessage.mtype;
    const options = { quoted: message };

    const poweredBy = "\n\n> *© ᴘᴀᴛʀᴏɴ TᴇᴄʜX*";

    let messageContent = {};
    switch (mtype) {
      case "imageMessage":
        messageContent = {
          image: buffer,
          caption: (quotedMessage.text ? quotedMessage.text : "") + poweredBy,
          mimetype: quotedMessage.mimetype || "image/jpeg"
        };
        break;
      case "videoMessage":
        messageContent = {
          video: buffer,
          caption: (quotedMessage.text ? quotedMessage.text : "") + poweredBy,
          mimetype: quotedMessage.mimetype || "video/mp4"
        };
        break;
      case "audioMessage":
        messageContent = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: quotedMessage.ptt || false
          // Audio normally has no caption
        };
        break;
      default:
        return await client.sendMessage(from, {
          text: "❌ Only image, video, and audio messages are supported"
        }, { quoted: message });
    }

    await client.sendMessage(from, messageContent, options);

  } catch (error) {
    console.error("Save Command Error:", error);
    await client.sendMessage(from, {
      text: "❌ Error saving message:\n" + error.message
    }, { quoted: message });
  }
});
