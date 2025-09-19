const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "define",
    desc: "📖 Get the definition of a word",
    react: "🔍",
    category: "search",
    filename: __filename,
    use: "<word>"
}, 
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            const noWordMsg = "Please provide a word to define.\n\n📌 *Usage:* .define [word]";
            if (m.isGroup) {
                return await reply(noWordMsg);
            } else {
                return await conn.sendMessage(from, { text: noWordMsg }, { quoted: mek });
            }
        }

        const word = q.trim();
        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

        const response = await axios.get(url);
        const definitionData = response.data[0];

        const definition = definitionData.meanings[0].definitions[0].definition;
        const example = definitionData.meanings[0].definitions[0].example || '❌ No example available';
        const synonyms = definitionData.meanings[0].definitions[0].synonyms.join(', ') || '❌ No synonyms available';
        const phonetics = definitionData.phonetics[0]?.text || '🔇 No phonetics available';
        const audio = definitionData.phonetics[0]?.audio || null;

        const wordInfo = `
📖 *Word*: *${definitionData.word}*  
🗣️ *Pronunciation*: _${phonetics}_  
📚 *Definition*: ${definition}  
✍️ *Example*: ${example}  
📝 *Synonyms*: ${synonyms}  

🔗 *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ*`;

        if (audio) {
            await conn.sendMessage(from, { audio: { url: audio }, mimetype: 'audio/mpeg' }, { quoted: mek });
        }

        return await conn.sendMessage(from, { text: wordInfo }, { quoted: mek });

    } catch (e) {
        console.error("❌ Error:", e);
        if (e.response && e.response.status === 404) {
            return reply("🚫 *Word not found.* Please check the spelling and try again.");
        }
        return reply("⚠️ An error occurred while fetching the definition. Please try again later.");
    }
});
