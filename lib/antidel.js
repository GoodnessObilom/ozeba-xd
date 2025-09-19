const { getMessage } = require('../data');
const { isJidGroup, downloadContentFromMessage } = require('baileys');
const { getAnti } = require('../data/antidel');
const config = require('../config');

const ANTI_DEL_PATH = process.env.ANTI_DEL_PATH || "log";
const messageCache = new Map();
const MAX_CACHE_SIZE = 1000;

// Cache message with media buffer if available
const cacheMessage = async (jid, messageId, message) => {
  const key = `${jid}:${messageId}`;
  const cloned = JSON.parse(JSON.stringify(message));
  const type = message.message && Object.keys(message.message)[0];

  if (['imageMessage', 'videoMessage', 'documentMessage', 'audioMessage', 'stickerMessage'].includes(type)) {
    try {
      const stream = await downloadContentFromMessage(message.message[type], type.replace('Message', ''));
      let buffer = Buffer.from([]);
      for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

      if (buffer.length > 0) {
        cloned.message[type].mediaBuffer = buffer;
      } else {
        return;
      }
    } catch {
      return;
    }
  }

  messageCache.set(key, { message: cloned, timestamp: Date.now() });

  if (messageCache.size > MAX_CACHE_SIZE) {
    const oldestKey = [...messageCache.keys()][0];
    messageCache.delete(oldestKey);
  }
};

const getFromCache = (jid, messageId) => {
  const key = `${jid}:${messageId}`;
  const cached = messageCache.get(key);
  return cached ? cached.message : null;
};

const redownloadMediaBuffer = async (conn, message) => {
  try {
    const type = Object.keys(message)[0];
    if (!['imageMessage', 'videoMessage', 'documentMessage', 'audioMessage', 'stickerMessage'].includes(type)) return null;

    const stream = await downloadContentFromMessage(message[type], type.replace('Message', ''));
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

    if (buffer.length > 0) {
      message[type].mediaBuffer = buffer;
      return message;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};

const DeletedText = async (conn, mek, targetJid, deleteInfo, isGroup, update) => {
  const messageContent = mek.message?.conversation || mek.message?.extendedTextMessage?.text || 'Unknown content';
  deleteInfo += `\n\n*Text:* ${messageContent}`;

  await conn.sendMessage(
    targetJid,
    {
      text: deleteInfo,
      contextInfo: {
        mentionedJid: isGroup ? [update.key.participant, mek.key.participant] : [update.key.remoteJid],
      },
    },
    { quoted: mek }
  );
};

const DeletedMedia = async (conn, mek, targetJid, deleteInfo) => {
  try {
    const antideletedmek = JSON.parse(JSON.stringify(mek.message));
    const messageType = Object.keys(antideletedmek)[0];

    if (!antideletedmek[messageType]) throw new Error('Invalid message type');

    let buffer = antideletedmek[messageType].mediaBuffer;

    if (!buffer || !Buffer.isBuffer(buffer)) {
      const redownloaded = await redownloadMediaBuffer(conn, antideletedmek);
      if (!redownloaded) throw new Error('No valid media buffer found after redownload attempt');
      buffer = redownloaded[messageType].mediaBuffer;
    }

    const sendType = {
      imageMessage: 'image',
      videoMessage: 'video',
      documentMessage: 'document',
      audioMessage: 'audio',
      stickerMessage: 'sticker'
    }[messageType];

    if (!sendType) throw new Error('Invalid media type');

    await conn.sendMessage(
      targetJid,
      {
        [sendType]: buffer,
        caption: ['image', 'video'].includes(sendType) ? deleteInfo : undefined,
        mimetype: antideletedmek[messageType].mimetype
      },
      { quoted: mek }
    );

    if (!['image', 'video'].includes(sendType)) {
      await conn.sendMessage(
        targetJid,
        {
          text: `*🚨 Delete Detected!*\n\n${deleteInfo}`,
          contextInfo: {
            mentionedJid: [mek.key.participant || mek.key.remoteJid].filter(Boolean)
          }
        },
        { quoted: mek }
      );
    }
  } catch (error) {
    await conn.sendMessage(targetJid, {
      text: `*🚨 Delete Detected!*\n\n${deleteInfo}\n\n_Error: Could not recover media content._\n*Reason:* ${error.message}\n\n> *POWERED BY GOODNESS TECH*`,
      contextInfo: {
        mentionedJid: [mek.key.participant || mek.key.remoteJid].filter(Boolean)
      }
    }, { quoted: mek });
  }
};

const AntiDelete = async (conn, updates) => {
  conn.ev.on("messages.upsert", async ({ messages }) => {
    for (const message of messages) {
      if (message.key && message.message) {
        await cacheMessage(message.key.remoteJid, message.key.id, message);
      }
    }
  });

  for (const update of updates) {
    try {
      if (update.key.remoteJid === 'status@broadcast') continue;

      const isDeleted = update.update.message === null || update.update.messageStubType === 1;
      if (!isDeleted) continue;

      const isGroup = update.key.remoteJid.endsWith('@g.us');
      const antiEnabled = await getAnti(isGroup ? 'gc' : 'dm');
      if (!antiEnabled) continue;

      const deleteTime = new Date().toLocaleTimeString('en-GB', {
  timeZone: 'Africa/Lagos',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});

      let deleteInfo = '';
      if (isGroup) {
        try {
          const groupMetadata = await conn.groupMetadata(update.key.remoteJid);
          const groupName = groupMetadata.subject;
          const deleter = update.key.participant?.split('@')[0] || 'unknown';
          deleteInfo = `*🚨 Message Deleted in Group*\n\n*Time:* ${deleteTime}\n*Group:* ${groupName}\n*Deleted by:* @${deleter}\n> *POWERED BY GOODNESS TECH*`;
        } catch {
          deleteInfo = `*🚨 Message Deleted*\n\n*Time:* ${deleteTime}\n*In Group*`;
        }
      } else {
        const deleter = update.key.remoteJid?.split('@')[0] || 'unknown';
        deleteInfo = `*🚨 Message Deleted in DM*\n\n*Time:* ${deleteTime}\n*By:* @${deleter}\n> *POWERED BY GOODNESS TECH*`;
      }

      let mek = getFromCache(update.key.remoteJid, update.key.id);
      if (!mek && conn.store) {
        try {
          mek = await conn.store.loadMessage(update.key.remoteJid, update.key.id);
        } catch {}
      }
      if (!mek) mek = await getMessage(update.key.remoteJid, update.key.id);
      if (!mek && conn.messages?.[update.key.remoteJid]) {
        mek = conn.messages[update.key.remoteJid].get(update.key.id);
      }

      if (!mek) continue;

      const ownerJid = conn.user.id.split(':')[0] + '@s.whatsapp.net';
      const sendTo = ANTI_DEL_PATH === 'same' ? update.key.remoteJid : ownerJid;

      if (mek.message?.conversation || mek.message?.extendedTextMessage) {
        await DeletedText(conn, mek, sendTo, deleteInfo, isGroup, update);
      } else {
        await DeletedMedia(conn, mek, sendTo, deleteInfo);
      }

    } catch {}
  }
};

module.exports = {
  DeletedText,
  DeletedMedia,
  AntiDelete
};