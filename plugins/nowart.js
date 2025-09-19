const crypto = require('crypto')
const axios = require('axios')
const { cmd } = require('../command')

async function nowchat(question) {
    const t = Date.now().toString()
    const s = 'dfaugf098ad0g98-idfaugf098ad0g98-iduoafiunoa-f09a8s098a09ea-a0s8g-asd8g0a9d--gasdga8d0g8a0dg80a9sd8g0a9d8gduoafiunoa-f09adfaugf098ad0g98-iduoafiunoa-f09a8s098a09ea-a0s8g-asd8g0a9d--gasdga8d0g8a0dg80a9sd8g0a9d8g8s098a09ea-a0s8g-asd8g0a9d--gasdga8d0g8a0dg80a9sd8g0a9d8g'
    const k = crypto.createHmac('sha512', s).update(t).digest('base64')
    const data = JSON.stringify({ content: question })

    const config = {
        method: 'POST',
        url: 'http://aichat.nowtechai.com/now/v1/ai',
        headers: {
            'User-Agent': 'Ktor client',
            'Connection': 'Keep-Alive',
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip',
            'Content-Type': 'application/json',
            'Key': k,
            'TimeStamps': t,
            'Accept-Charset': 'UTF-8'
        },
        data,
        responseType: 'stream'
    }

    return new Promise((resolve, reject) => {
        axios.request(config).then(res => {
            let result = ''
            res.data.on('data', chunk => {
                const lines = chunk.toString().split('\n')
                for (const line of lines) {
                    if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                        try {
                            const json = JSON.parse(line.replace('data: ', ''))
                            const c = json?.choices?.[0]?.delta?.content
                            if (c) result += c
                        } catch { }
                    }
                }
            })
            res.data.on('end', () => resolve(result.trim()))
            res.data.on('error', reject)
        }).catch(reject)
    })
}

async function nowart(prompt) {
    const res = await axios.get('http://art.nowtechai.com/art?name=' + prompt, {
        headers: {
            'User-Agent': 'okhttp/5.0.0-alpha.9',
            'Connection': 'Keep-Alive',
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip',
            'Content-Type': 'application/json'
        }
    })
    return res.data
}

// NowChat Command
cmd({
    pattern: "nowchat",
    alias: ["nowai"],
    desc: "Ask NowTech AI a question",
    category: "ai",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    const input = args.join(' ').trim()
    if (!input) return reply('❌ What do you want to ask?')

    try {
        const res = await nowchat(input)
        reply(res)
    } catch (e) {
        reply('❌ An error occurred: ' + e.message)
    }
})

// NowArt Image Command
cmd({
    pattern: "nowimg",
    alias: ["nowimage", "nowart"],
    desc: "Generate AI image using NowTech Art",
    category: "ai",
    filename: __filename
}, async (conn, mek, m, { args }) => {
    const input = args.join(' ').trim()
    if (!input) return m.reply('❌ Please provide a prompt.')

    try {
        const res = await nowart(input)
        for (const x of res.data) {
            await conn.sendMessage(m.chat, { image: { url: x.img_url } }, { quoted: m })
        }
    } catch (e) {
        m.reply('❌ An error occurred: ' + e.message)
    }
})