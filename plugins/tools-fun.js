const axios = require("axios");
const fetch = require("node-fetch");
const { sleep } = require('../lib/functions');
const { cmd, commands } = require("../command");

cmd({
  pattern: "joke",
  desc: "😂 Get a random joke",
  category: "fun",
  filename: __filename,
  use: ".joke"
}, async (conn, m, store, { reply }) => {
  await conn.sendMessage(m.key.remoteJid, {
    react: {
        text: "🤣",
        key: m.key
    }
});
  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    const joke = response.data;

    if (!joke || !joke.setup || !joke.punchline) {
      return reply("❌ Failed to fetch a joke. Please try again.");
    }

    const jokeMessage = `🤣 *Here's a random joke for you!* 🤣\n\n*${joke.setup}*\n\n${joke.punchline} 😆\n\n> POWERED BY GOODNESS TECH`;

    return reply(jokeMessage);
  } catch (error) {
    console.error("❌ Error in joke command:", error);
    return reply("⚠️ An error occurred while fetching the joke. Please try again.");
  }
});

// flirt

cmd({
    pattern: "flirt",
    alias: ["masom", "line"],
    desc: "Get a random flirt or pickup line.",
    category: "fun",
    filename: __filename,
    use: ".flirt"
}, 
async (conn, mek, m, { from, reply }) => {
  await conn.sendMessage(m.key.remoteJid, {
    react: {
        text: "💘",
        key: m.key
    }
});
    try {
        // Define API key and URL
        const shizokeys = 'shizo';
        const apiUrl = `https://shizoapi.onrender.com/api/texts/flirt?apikey=${shizokeys}`;

        // Fetch data from the API
        const res = await fetch(apiUrl);
        if (!res.ok) {
            throw new Error(`API error: ${await res.text()}`);
        }
        
        const json = await res.json();
        if (!json.result) {
            throw new Error("Invalid response from API.");
        }

        // Extract and send the flirt message
        const flirtMessage = `${json.result}`;
        await conn.sendMessage(from, {
            text: flirtMessage,
            mentions: [m.sender],
        }, { quoted: m });

    } catch (error) {
        console.error("Error in flirt command:", error);
        reply("Sorry, something went wrong while fetching the flirt line. Please try again later.");
    }
});

//truth

cmd({
    pattern: "truth",
    alias: ["t"],
    desc: "Get a random truth question from the API.",
    category: "fun",
    filename: __filename,
    use: ".truth"
}, 
async (conn, mek, m, { from, reply }) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "❓",
            key: m.key
        }
    });
    try {
        const shizokeys = 'shizo';
        const res = await fetch(`https://shizoapi.onrender.com/api/texts/truth?apikey=${shizokeys}`);
        
        if (!res.ok) {
            console.error(`API request failed with status ${res.status}`);
            throw new Error(`API request failed with status ${res.status}`);
        }

        const json = await res.json();

        if (!json.result) {
            console.error("Invalid API response: No 'result' field found.");
            throw new Error("Invalid API response: No 'result' field found.");
        }

        const truthText = `${json.result}`;
        await conn.sendMessage(from, { 
            text: truthText, 
            mentions: [m.sender] 
        }, { quoted: m });

    } catch (error) {
        console.error("Error in truth command:", error);
        reply("Sorry, something went wrong while fetching the truth question. Please try again later.");
    }
});

// dare

cmd({
    pattern: "dare",
    alias: ["d"],
    desc: "Get a random dare from the API.",
    category: "fun",
    filename: __filename,
    use: ".dare"
}, 
async (conn, mek, m, { from, reply }) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "🎯",
            key: m.key
        }
    });
    try {
        // API Key
        const shizokeys = 'shizo';

        // Fetch dare text from the API
        const res = await fetch(`https://shizoapi.onrender.com/api/texts/dare?apikey=${shizokeys}`);
        
        if (!res.ok) {
            console.error(`API request failed with status ${res.status}`);
            throw new Error(`API request failed with status ${res.status}`);
        }

        const json = await res.json();

        if (!json.result) {
            console.error("Invalid API response: No 'result' field found.");
            throw new Error("Invalid API response: No 'result' field found.");
        }

        // Format the dare message
        const dareText = `${json.result}`;

        // Send the dare to the chat
        await conn.sendMessage(from, { 
            text: dareText, 
            mentions: [m.sender] 
        }, { quoted: m });

    } catch (error) {
        console.error("Error in dare command:", error);
        reply("Sorry, something went wrong while fetching the dare. Please try again later.");
    }
});

cmd({
  pattern: "fact",
  desc: "🧠 Get a random fun fact",
  category: "fun",
  filename: __filename,
  use: ".fact"
}, async (conn, m, store, { reply }) => {
  await conn.sendMessage(m.key.remoteJid, {
    react: {
        text: "🧠",
        key: m.key
    }
});
  try {
    const response = await axios.get("https://uselessfacts.jsph.pl/random.json?language=en");
    const fact = response.data.text;

    if (!fact) {
      return reply("❌ Failed to fetch a fun fact. Please try again.");
    }

    const factMessage = `🧠 *Random Fun Fact* 🧠\n\n${fact}\n\nIsn't that interesting? 😄\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘᴀᴛʀᴏɴTᴇᴄʜＸ* 🚹`;

    return reply(factMessage);
  } catch (error) {
    console.error("❌ Error in fact command:", error);
    return reply("⚠️ An error occurred while fetching a fun fact. Please try again later.");
  }
});

cmd({
    pattern: "pickupline",
    alias: ["pickup"],
    desc: "Get a random pickup line from the API.",
    category: "fun",
    filename: __filename,
    use: ".pickupline"
}, 
async (conn, mek, m, { from, reply }) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "💬",
            key: m.key
        }
    });
    try {
        // Fetch pickup line from the API
        const res = await fetch('https://api.popcat.xyz/pickuplines');
        
        if (!res.ok) {
            throw new Error(`API request failed with status ${res.status}`);
        }

        const json = await res.json();

        // Log the API response (for debugging purposes)
        console.log('JSON response:', json);

        // Format the pickup line message
        const pickupLine = `*Here's a pickup line for you:*\n\n"${json.pickupline}"\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘᴀᴛʀᴏɴTᴇᴄʜＸ* 🚹`;

        // Send the pickup line to the chat
        await conn.sendMessage(from, { text: pickupLine }, { quoted: m });

    } catch (error) {
        console.error("Error in pickupline command:", error);
        reply("Sorry, something went wrong while fetching the pickup line. Please try again later.");
    }
});

// char

cmd({
    pattern: "character",
    alias: ["char"],
    desc: "Check the character of a mentioned user.",
    category: "fun",
    filename: __filename,
    use: ".character <@mention>"
}, 
async (conn, mek, m, { from, isGroup, text, reply }) => {
    await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "🔥",
            key: m.key
        }
    });
    try {
        // Ensure the command is used in a group
        if (!isGroup) {
            return reply("This command can only be used in groups.");
        }

        // Extract the mentioned user
        const mentionedUser = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!mentionedUser) {
            return reply("Please mention a user whose character you want to check.");
        }

        // Define character traits
        const userChar = [
            "Sigma",
            "Generous",
            "Grumpy",
            "Overconfident",
            "Obedient",
            "Good",
            "Simp",
            "Kind",
            "Patient",
            "Pervert",
            "Cool",
            "Helpful",
            "Brilliant",
            "Sexy",
            "Hot",
            "Gorgeous",
            "Cute",
        ];

        // Randomly select a character trait
        const userCharacterSelection =
            userChar[Math.floor(Math.random() * userChar.length)];

        // Message to send
        const message = `Character of @${mentionedUser.split("@")[0]} is *${userCharacterSelection}* 🔥⚡`;

        // Send the message with mentions
        await conn.sendMessage(from, {
            text: message,
            mentions: [mentionedUser],
        }, { quoted: m });

    } catch (e) {
        console.error("Error in character command:", e);
        reply("An error occurred while processing the command. Please try again.");
    }
});

cmd({
  pattern: "repeat",
  alias: ["rp", "rpm"],
  desc: "Repeat a message a specified number of times.",
  category: "fun",
  filename: __filename,
  use: ".repeat <count>,<message>"
}, async (conn, m, store, { args, reply }) => {
  try {
    if (!args[0]) {
      return reply("✳️ Use this command like:\n*Example:* .repeat 10,I love you");
    }

    const [countStr, ...messageParts] = args.join(" ").split(",");
    const count = parseInt(countStr.trim());
    const message = messageParts.join(",").trim();

    if (isNaN(count) || count <= 0 || count > 300) {
      return reply("❎ Please specify a valid number between 1 and 300.");
    }

    if (!message) {
      return reply("❎ Please provide a message to repeat.");
    }

    const repeatedMessage = Array(count).fill(message).join("\n");

    reply(`🔄 Repeated ${count} times:\n\n${repeatedMessage}`);
  } catch (error) {
    console.error("❌ Error in repeat command:", error);
    reply("❎ An error occurred while processing your request.");
  }
});


cmd({
  pattern: "readmore",
  alias: ["rm", "rmore", "readm"],
  desc: "Generate a Read More message.",
  category: "convert",
  use: ".readmore <text>",
  filename: __filename
}, async (conn, m, store, { args, reply }) => {
  try {
    // React to the message first
    try {
      await conn.sendMessage(m.key.remoteJid, {
        react: {
          text: "📝",
          key: m.key
        }
      });
    } catch (reactError) {
      console.log("React failed:", reactError);
      // Continue execution even if react fails
    }

    const inputText = args.join(" ") || "No text provided.";
    const readMore = String.fromCharCode(8206).repeat(4000); // Creates a large hidden gap
    const message = `${inputText} ${readMore} Continue Reading...`;

    // Use reply function which is more reliable
    return reply(message);
  } catch (error) {
    console.error("❌ Error in readmore command:", error);
    reply("❌ An error occurred: " + error.message);
  }
});
