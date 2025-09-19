const { cmd } = require('../command');
const axios = require('axios');


cmd({
    pattern: "gpt",
    alias: ["bot", "ai", "gpt4", "bing"],
    desc: "Chat with an AI model",
    category: "ai",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        const question = q?.trim() || args.join(" ").trim();
        const jid = mek.key.remoteJid; // always reliable for both group and private

        if (!question) {
            await conn.sendMessage(jid, { react: { text: "❓", key: mek.key } });
            return await conn.sendMessage(jid, { text: "❓ Please provide a message for the AI.\n\nExample: `.ai Hello, how are you?`" }, { quoted: mek });
        }

        const apiUrl = `https://lance-frank-asta.onrender.com/api/gpt?q=${encodeURIComponent(question)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.message) {
            await conn.sendMessage(jid, { react: { text: "❌", key: mek.key } });
            return await conn.sendMessage(jid, { text: "⚠️ AI failed to respond. Please try again later." }, { quoted: mek });
        }

        await conn.sendMessage(jid, { text: `🤖 *AI Response:*\n\n${data.message}` }, { quoted: mek });
        await conn.sendMessage(jid, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("Error in AI command:", e);
        await conn.sendMessage(mek.key.remoteJid, { react: { text: "❌", key: mek.key } });
        await conn.sendMessage(mek.key.remoteJid, { text: "An error occurred while communicating with the AI." }, { quoted: mek });
    }
});


cmd({
    pattern: "openai",
    alias: ["chatgpt", "open-gpt"],
    desc: "Chat with OpenAI",
    category: "ai",
    filename: __filename
}, async (conn, mek, m, { from, args, q, reply }) => {
    try {
        await conn.sendMessage(m.key.remoteJid, {
            react: {
                text: "🧠",
                key: m.key
            }
        });
        // Check if there's a question or 'no' command
        if (!q || q.toLowerCase() === "no") {
            const usageMessage = "🧠 *Usage:*\n• openai <question>n\nExample: `.openai What is the capital of France?`";

            // Check if the message is in a group or private chat
            if (mek.key.remoteJid.endsWith('@g.us')) {
                // If it's a group, send the usage message in the group
                await conn.sendMessage(mek.key.remoteJid, { text: usageMessage }, { quoted: mek });
            } else {
                // If it's a private chat, send the usage message to the user directly (without quoted)
                await conn.sendMessage(mek.key.remoteJid, { text: usageMessage });
            }

            return;  // Exit early after showing usage message
        }

        // Limit the length of input
        if (q.length > 500) {
            return await reply("❌ Your question is too long. Please keep it under 500 characters.");
        }

        // Prepare API call URL
        const apiUrl = `https://vapis.my.id/api/openai?q=${encodeURIComponent(q)}`;

        // Timeout for the API call to avoid hanging
        const { data } = await axios.get(apiUrl, { timeout: 10000 });

        // Handle case where API response is empty or malformed
        if (!data || !data.result) {
            await conn.sendMessage(mek.key.remoteJid, { text: "OpenAI failed to respond. Please try again later." }, { quoted: mek });
            return;
        }

        // Send the OpenAI response
        await conn.sendMessage(mek.key.remoteJid, { text: `🧠 *OpenAI Response:*\n\n${data.result}` }, { quoted: mek });

    } catch (e) {
        console.error("❌ Error in OpenAI command:", e.message || e);
        await conn.sendMessage(mek.key.remoteJid, { text: "An error occurred while communicating with OpenAI." }, { quoted: mek });
    }
});

cmd({
    pattern: "gemini",
    alias: ["askgemini", "gptgemini"],
    desc: "Ask Gemini AI a question",
    category: "ai",
    filename: __filename,
    use: ".gemini <your question>"
},
async (conn, mek, m, { args, from, reply }) => {
    const query = args.join(" ").trim();
    if (!query) return reply("🧠 Please ask something like `.gemini what is consciousness?`");

    await conn.sendMessage(from, {
        react: { text: "🔮", key: m.key }
    });

    try {
        const encodedQuery = encodeURIComponent(query);
        const apiUrl = `https://api.nekorinn.my.id/ai/gemini?text=${encodedQuery}`;
        const res = await fetch(apiUrl);
        const json = await res.json();

        if (!json?.status || !json?.result) {
            return reply("❌ Gemini AI couldn't generate a response.");
        }

        const message = `🧠 *𝗚𝗘𝗠𝗜𝗡𝗜 𝗔𝗜 𝗥𝗘𝗦𝗣𝗢𝗡𝗦𝗘*\n\n"${json.result.trim()}"\n\n— *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ*`;

        await conn.sendMessage(from, { text: message }, { quoted: mek });

    } catch (e) {
        console.error("Gemini AI Error:", e);
        reply("❌ An error occurred while contacting Gemini AI.");
    }
});

cmd({
    pattern: "meta",
    alias: ["llama", "metallama"],
    desc: "Ask Meta LLaMA AI a question",
    category: "ai",
    filename: __filename,
    use: ".meta <your question>"
},
async (conn, mek, m, { args, from, reply }) => {
    const query = args.join(" ").trim();
    if (!query) return reply("🦙 Please ask something like `.meta what is consciousness?`");

    await conn.sendMessage(from, {
        react: {
            text: "🦙",
            key: m.key
        }
    });

    try {
        const encodedQuery = encodeURIComponent(query);
        const apiUrl = `https://api.nekorinn.my.id/ai/meta-llama?text=${encodedQuery}`;
        const res = await fetch(apiUrl);
        const json = await res.json();

        if (!json?.status || !json?.result) {
            return reply("❌ Meta LLaMA AI couldn't generate a response.");
        }

        const message = `🦙 *Meta LLaMA says:*\n\n${json.result.trim()}\n\n— *Patron TechX*`;

        await conn.sendMessage(from, { text: message }, { quoted: mek });

    } catch (e) {
        console.error("Meta LLaMA Error:", e);
        reply("❌ An error occurred while contacting Meta LLaMA AI.");
    }
});



cmd({
    pattern: "ozebaai",
    alias: ["askozeba"],
    desc: "Ask the Ozeba AI chatbot a question",
    category: "ai",
    filename: __filename,
    use: ".patronai <your question>"
},
async (conn, mek, m, { args, from, reply }) => {
    const query = args.join(" ").trim();
    if (!query) return reply("🤖 Please ask something like `.ozebaai What is philosophy?`");

    // Send reaction emoji
    await conn.sendMessage(from, {
        react: {
            text: "🤖",
            key: m.key
        }
    });

    try {
        const encodedQuery = encodeURIComponent(query);
        const logic = encodeURIComponent(`
            Speak like someone who radiates presence — calm, confident, and quietly powerful. 
            You are at the pinnacle, a king among all, but never loud about it. And always still answer the questions
            Your words carry weight, and your replies should feel magnetic, subtle, and unshakably dominant. 
            Be human, but not ordinary. Let your tone reflect someone who is never fazed, never explaining too much, and never seeking approval. 
            If someone questions your reply, respond like someone whose authority is beyond doubt — “you question me?” kind of tone, but with calm charisma. 
            Keep responses short, smooth, and impactful.
        `);

        const apiUrl = `https://api.nekorinn.my.id/ai/chatbot?ai_name=Patron&text=${encodedQuery}&logic=${logic}`;
        const res = await fetch(apiUrl);
        const json = await res.json();

        if (!json?.status || !json?.result) {
            return reply("❌ Ozeba AI couldn't generate a response. Please try again.");
        }

        const response = `╭──『 Ozeba AI 』──⳹\n│\n│ ${json.result}\n│\n╰────────────────⳹`;
        await conn.sendMessage(from, { text: response }, { quoted: mek });

    } catch (e) {
        console.error("Ozeba Ai Error:", e);
        reply("❌ An error occurred while contacting Ozeba AI.");
    }
});


cmd({
  pattern: "grok",
  alias: ["grokai", "askgrok"],
  desc: "Ask AI a question using Grok AI",
  category: "ai",
  use: "<prompt>",
  filename: __filename
}, async (conn, mek, m, { from, args, q, reply, prefix, command }) => {
  const question = q?.trim() || args.join(" ").trim();
  if (!question) {
    return await conn.sendMessage(mek.key.remoteJid, { text: `❌ Please provide a prompt!\n\nExample:\n${prefix + command} how are you?` }, { quoted: mek });
  }
  try {
    const response = await axios.get(`https://api.nekorinn.my.id/ai/turboseek?text=${encodeURIComponent(question)}`);
    const data = response.data;
    if (data.status && data.result) {
      await conn.sendMessage(mek.key.remoteJid, { text: data.result }, { quoted: mek });
    } else {
      await conn.sendMessage(mek.key.remoteJid, { text: "❌ Failed to get a response from the AI." }, { quoted: mek });
    }
  } catch (err) {
    console.error("Grok AI error:", err);
    await conn.sendMessage(mek.key.remoteJid, { text: "⚠️ Error in this command." }, { quoted: mek });
  }
});








cmd({
    pattern: "deepseek",
    alias: ["ds", "seek"],
    desc: "Ask DeepSeek-R1 AI a question",
    category: "ai",
    filename: __filename,
    use: ".deepseek <your question>"
},
async (conn, mek, m, { args, from, reply }) => {
    const query = args.join(" ").trim();
    if (!query) return reply("🧠 Please ask something like `.deepseek what is free will?`");

    await conn.sendMessage(from, {
        react: {
            text: "🔍",
            key: m.key
        }
    });

    try {
        const encodedQuery = encodeURIComponent(query);
        const apiUrl = `https://api.nekorinn.my.id/ai/deepseek-r1?text=${encodedQuery}`;
        const res = await fetch(apiUrl);
        const json = await res.json();

        if (!json?.status || !json?.result?.text) {
            return reply("❌ DeepSeek AI couldn't generate a response.");
        }

        const message = `🔍 *DeepSeek AI says:*\n\n${json.result.text.trim()}`;

        await conn.sendMessage(from, { text: message }, { quoted: mek });

    } catch (e) {
        console.error("DeepSeek Error:", e);
        reply("❌ An error occurred while contacting DeepSeek AI.");
    }
});
