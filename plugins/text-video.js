const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { cmd } = require('../command');

async function veo3(prompt, { model, auto_sound = true, auto_speech = true, quality = '1080p' } = {}) {
    try {
        const allowedModels = ['veo-3-fast', 'veo-3'];
        if (!prompt) throw new Error('Prompt is required');
        if (!allowedModels.includes(model)) throw new Error(`Available models: ${allowedModels.join(', ')}`);

        const { data: cf } = await axios.get('https://api.nekorinn.my.id/tools/rynn-stuff', {
            params: {
                mode: 'turnstile-min',
                siteKey: '0x4AAAAAAANuFg_hYO9YJZqo',
                url: 'https://aivideogenerator.me/features/g-ai-video-generator',
                accessKey: 'e2ddc8d3ce8a8fceb9943e60e722018cb23523499b9ac14a8823242e689eefed'
            }
        });

        const uid = crypto.createHash('md5').update(Date.now().toString()).digest('hex');

        const { data: task } = await axios.post('https://aiarticle.erweima.ai/api/v1/secondary-page/api/create', {
            prompt: prompt,
            imgUrls: [],
            quality: quality,
            duration: 15,
            autoSoundFlag: auto_sound,
            soundPrompt: '',
            autoSpeechFlag: auto_speech,
            speechPrompt: '',
            speakerId: 'Auto',
            aspectRatio: '16:9',
            secondaryPageId: 1811,
            channel: 'VEO3',
            source: 'aivideogenerator.me',
            type: 'features',
            watermarkFlag: true,
            privateFlag: true,
            isTemp: true,
            vipFlag: true,
            model: model
        }, {
            headers: {
                uniqueid: uid,
                verify: cf.result.token
            }
        });

        while (true) {
            const { data } = await axios.get(`https://aiarticle.erweima.ai/api/v1/secondary-page/api/${task.data.recordId}`, {
                headers: {
                    uniqueid: uid,
                    verify: cf.result.token
                }
            });

            if (data.data.state === 'success') {
                return JSON.parse(data.data.completeData);
            }

            await new Promise(res => setTimeout(res, 1000));
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

// Command for fast model "veo-3-fast"
cmd({
    pattern: "txt2vidfast",
    alias: ["veo3fast", "text2videofast"],
    desc: "Generate a fast AI video (model: veo-3-fast, 1080p, with sound and speech)",
    category: "ai",
    filename: __filename
}, async (conn, mek, m, { text, reply }) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: { text: "⏳", key: m.key }
    });

    if (!text) return reply('❌ Please enter a prompt to generate a video.\nExample: txt2vidfast a futuristic city at sunset');

    try {
        await reply('⏳ Generating fast video, please wait...');
        const result = await veo3(text, { model: 'veo-3-fast' });

        if (!result?.data?.video_url) return reply('❌ Failed to get the video. Please try again later.');

        const tempDir = path.join(__dirname, '..', 'temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

        const fileName = `video_${Date.now()}.mp4`;
        const filePath = path.join(tempDir, fileName);

        const writer = fs.createWriteStream(filePath);
        const videoStream = await axios.get(result.data.video_url, { responseType: 'stream' });
        videoStream.data.pipe(writer);

        writer.on('finish', async () => {
            await conn.sendMessage(m.chat, {
                video: fs.readFileSync(filePath),
                mimetype: 'video/mp4',
                caption: `🎬 *AI Video (1080p, fast)*\n\n📝 Prompt: ${text}`
            }, { quoted: m });

            fs.unlinkSync(filePath);
        });

        writer.on('error', async (err) => {
            console.error(err);
            reply('❌ Failed to download or send video.');
        });

    } catch (e) {
        reply(`❌ Error: ${e?.message || e}`);
    }
});

// Command for high quality model "veo-3"
cmd({
    pattern: "txt2vid",
    alias: ["veo3", "text2video"],
    desc: "Generate a high-quality AI video (model: veo-3, 1080p, with sound and speech)",
    category: "ai",
    filename: __filename
}, async (conn, mek, m, { text, reply }) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: { text: "⏳", key: m.key }
    });

    if (!text) return reply('❌ Please enter a prompt to generate a video.\nExample: txt2vid a futuristic city at sunset');

    try {
        await reply('⏳ Generating high-quality video, please wait...');
        const result = await veo3(text, { model: 'veo-3' });

        if (!result?.data?.video_url) return reply('❌ Failed to get the video. Please try again later.');

        const tempDir = path.join(__dirname, '..', 'temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

        const fileName = `video_${Date.now()}.mp4`;
        const filePath = path.join(tempDir, fileName);

        const writer = fs.createWriteStream(filePath);
        const videoStream = await axios.get(result.data.video_url, { responseType: 'stream' });
        videoStream.data.pipe(writer);

        writer.on('finish', async () => {
            await conn.sendMessage(m.chat, {
                video: fs.readFileSync(filePath),
                mimetype: 'video/mp4',
                caption: `🎬 *AI Video (1080p, high quality)*\n\n📝 Prompt: ${text}`
            }, { quoted: m });

            fs.unlinkSync(filePath);
        });

        writer.on('error', async (err) => {
            console.error(err);
            reply('❌ Failed to download or send video.\n*Try command veo3fast*');
        });

    } catch (e) {
        reply(`❌ Error: ${e?.message || e}`);
    }
});
