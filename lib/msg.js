const { proto, downloadContentFromMessage, getContentType } = require('baileys')
const fs = require('fs')

const downloadMediaMessage = async (m, filename) => {
    if (m.type === 'viewOnceMessage') {
        m.type = m.msg.type
    }

    const typeMap = {
        imageMessage: 'jpg',
        videoMessage: 'mp4',
        audioMessage: 'mp3',
        stickerMessage: 'webp'
    }

    const ext = typeMap[m.type] || m.msg?.fileName?.split('.')?.pop()?.toLowerCase()?.replace('jpeg', 'jpg').replace('png', 'jpg').replace('m4a', 'mp3') || 'bin'
    const name = filename ? `${filename}.${ext}` : `undefined.${ext}`

    if (['imageMessage', 'videoMessage', 'audioMessage', 'stickerMessage', 'documentMessage'].includes(m.type)) {
        const stream = await downloadContentFromMessage(m.msg, m.type.replace('Message', '').toLowerCase())
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        fs.writeFileSync(name, buffer)
        return fs.readFileSync(name)
    }
}

const sms = (conn, m, store) => {
    if (!m) return m
    let M = proto.WebMessageInfo

    if (m.key) {
        m.id = m.key.id
        m.isBot = m.id.startsWith('BAES') && m.id.length === 16
        m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16
        m.chat = m.key.remoteJid
        m.fromMe = m.key.fromMe
        m.isGroup = m.chat.endsWith('@g.us')
        m.sender = m.fromMe ? conn.user.id.split(':')[0] + '@s.whatsapp.net' : m.isGroup ? m.key.participant : m.key.remoteJid
    }

    if (!m.message) {
        console.error("Message object is undefined. Skipping processing.");
        return m;
    }

    m.mtype = getContentType(m.message)
    m.msg = (m.mtype === 'viewOnceMessage')
        ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)]
        : m.message[m.mtype]

    try {
        m.body = (m.mtype === 'conversation') ? m.message.conversation :
            (m.mtype === 'imageMessage' && m.message.imageMessage.caption) ? m.message.imageMessage.caption :
            (m.mtype === 'videoMessage' && m.message.videoMessage.caption) ? m.message.videoMessage.caption :
            (m.mtype === 'extendedTextMessage') ? m.message.extendedTextMessage.text :
            (m.mtype === 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId :
            (m.mtype === 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
            (m.mtype === 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId :
            (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ''
    } catch {
        m.body = false
    }

    const quotedRaw = m.msg?.contextInfo?.quotedMessage ?? null
    m.mentionedJid = m.msg?.contextInfo?.mentionedJid ?? []

    if (quotedRaw) {
        let type = getContentType(quotedRaw)
        let qContent = quotedRaw[type]

        if (type === 'productMessage') {
            type = getContentType(qContent)
            qContent = qContent[type]
        }

        const quoted = typeof qContent === 'string' ? { text: qContent } : (qContent ?? {})
        quoted.mtype = type
        quoted.id = m.msg.contextInfo.stanzaId
        quoted.chat = m.msg.contextInfo.remoteJid || m.chat
        quoted.isBot = quoted.id?.startsWith('BAES') && quoted.id.length === 16
        quoted.isBaileys = quoted.id?.startsWith('BAE5') && quoted.id.length === 16
        quoted.sender = conn.decodeJid(m.msg.contextInfo.participant)
        quoted.fromMe = quoted.sender === (conn.user && conn.user.id)
        quoted.text = quoted.text || quoted.caption || quoted.conversation || quoted.contentText || quoted.selectedDisplayText || quoted.title || ''
        quoted.mentionedJid = m.msg.contextInfo?.mentionedJid ?? []

        quoted.delete = async () => conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: quoted.id, participant: quoted.sender } })

        quoted.download = () => conn.downloadMediaMessage(quoted)

        const vM = quoted.fakeObj = M.fromObject({
            key: { remoteJid: quoted.chat, fromMe: quoted.fromMe, id: quoted.id },
            message: quotedRaw,
            ...(m.isGroup ? { participant: quoted.sender } : {})
        })

        m.forwardMessage = (jid, forceForward = true, options = {}) =>
            conn.copyNForward(jid, vM, forceForward, { contextInfo: { isForwarded: false } }, options)

        m.getQuotedObj = m.getQuotedMessage = async () => {
            if (!quoted.id) return false
            const q = await store.getMessage({
                remoteJid: m.chat,
                id: quoted.id,
                fromMe: false,
                participant: quoted.sender
            })
            quoted.message = q?.message || q
            return exports.sms(conn, q, store)
        }

        m.quoted = quoted
    }

    if (m?.msg?.url) m.download = () => conn.downloadMediaMessage(m.msg)
    m.text = m.msg?.text || m.msg?.caption || m.message?.conversation || m.msg?.contentText || m.msg?.selectedDisplayText || m.msg?.title || ''

    m.copy = () => exports.sms(conn, M.fromObject(M.toObject(m)))
    m.copyNForward = (jid = m.chat, forceForward = false, options = {}) => conn.copyNForward(jid, m, forceForward, options)

    m.sticker = (stik, id = m.chat, option = { mentions: [m.sender] }) =>
        conn.sendMessage(id, { sticker: stik, contextInfo: { mentionedJid: option.mentions } }, { quoted: m })

    m.replyimg = (img, teks, id = m.chat, option = { mentions: [m.sender] }) =>
        conn.sendMessage(id, { image: img, caption: teks, contextInfo: { mentionedJid: option.mentions } }, { quoted: m })

    m.imgurl = (img, teks, id = m.chat, option = { mentions: [m.sender] }) =>
        conn.sendMessage(id, { image: { url: img }, caption: teks, contextInfo: { mentionedJid: option.mentions } }, { quoted: m })

    m.reply = async (content, opt = { packname: "Secktor", author: "SamPandey001" }, type = "text") => {
        switch (type.toLowerCase()) {
            case "text":
                return await conn.sendMessage(m.chat, { text: content }, { quoted: m })
            case "image":
                return Buffer.isBuffer(content)
                    ? await conn.sendMessage(m.chat, { image: content, ...opt }, { quoted: m })
                    : isUrl(content)
                        ? await conn.sendMessage(m.chat, { image: { url: content }, ...opt }, { quoted: m })
                        : null
            case "video":
                return Buffer.isBuffer(content)
                    ? await conn.sendMessage(m.chat, { video: content, ...opt }, { quoted: m })
                    : isUrl(content)
                        ? await conn.sendMessage(m.chat, { video: { url: content }, ...opt }, { quoted: m })
                        : null
            case "audio":
                return Buffer.isBuffer(content)
                    ? await conn.sendMessage(m.chat, { audio: content, ...opt }, { quoted: m })
                    : isUrl(content)
                        ? await conn.sendMessage(m.chat, { audio: { url: content }, ...opt }, { quoted: m })
                        : null
            case "template":
                const optional = await generateWAMessage(m.chat, content, opt)
                const message = { viewOnceMessage: { message: { ...optional.message } } }
                return await conn.relayMessage(m.chat, message, { messageId: optional.key.id })
            case "sticker":
                const { data, mime } = await conn.getFile(content)
                if (mime === "image/webp") {
                    const buff = await writeExifWebp(data, opt)
                    return await conn.sendMessage(m.chat, { sticker: { url: buff }, ...opt }, { quoted: m })
                } else {
                    const type = mime.split("/")[0]
                    if (["video", "image"].includes(type)) {
                        return await conn.sendImageAsSticker(m.chat, content, opt)
                    }
                }
                break
        }
    }

    m.senddoc = (doc, type, id = m.chat, option = {
        mentions: [m.sender],
        filename: Config.ownername,
        mimetype: type,
        externalAdRepl: {
            title: Config.ownername,
            body: ' ',
            thumbnailUrl: ``,
            thumbnail: log0,
            mediaType: 1,
            mediaUrl: '',
            sourceUrl: gurl,
        }
    }) => conn.sendMessage(id, {
        document: doc,
        mimetype: option.mimetype,
        fileName: option.filename,
        contextInfo: {
            externalAdReply: option.externalAdRepl,
            mentionedJid: option.mentions
        }
    }, { quoted: m })

    m.sendcontact = (name, info, number) => {
        const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nORG:${info};\nTEL;type=CELL;type=VOICE;waid=${number}:+${number}\nEND:VCARD`
        conn.sendMessage(m.chat, { contacts: { displayName: name, contacts: [{ vcard }] } }, { quoted: m })
    }

    m.react = (emoji) => conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } })

    return m
}

module.exports = { sms, downloadMediaMessage }