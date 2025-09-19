const { cmd } = require("../command");
const config = require('../config');

cmd({
  pattern: "compatibility",
  alias: ["friend", "fcheck"],
  desc: "Calculate the compatibility score between two users.",
  category: "fun",
  react: "",
  filename: __filename,
  use: "@tag1 @tag2",
}, async (conn, mek, m, { args, reply }) => {
  await conn.sendMessage(m.key.remoteJid, {
    react: {
        text: "💖",
        key: m.key
    }
});

  try {
    if (args.length < 2) {
      return reply("Please mention two users to calculate compatibility.\nUsage: `.compatibility @user1 @user2`");
    }

    let user1 = m.mentionedJid[0]; 
    let user2 = m.mentionedJid[1]; 

    const specialNumber = config.DEV ? `${config.DEV}@s.whatsapp.net` : null;

    // Calculate a random compatibility score (between 1 to 1000)
    let compatibilityScore = Math.floor(Math.random() * 1000) + 1;

    // Check if one of the mentioned users is the special number
    if (user1 === specialNumber || user2 === specialNumber) {
      compatibilityScore = 1000; // Special case for DEV number
      return reply(`💖 Compatibility between @${user1.split('@')[0]} and @${user2.split('@')[0]}: ${compatibilityScore}+/1000 💖`);
    }

    // Send the compatibility message
    await conn.sendMessage(mek.chat, {
      text: `💖 Compatibility between @${user1.split('@')[0]} and @${user2.split('@')[0]}: ${compatibilityScore}/1000 💖`,
      mentions: [user1, user2],
    }, { quoted: mek });

  } catch (error) {
    console.log(error);
    reply(`❌ Error: ${error.message}`);
  }
});

  cmd({
  pattern: "aura",
  desc: "Calculate aura score of a user.",
  category: "fun",
  filename: __filename,
  use: "@tag",
}, async (conn, mek, m, { args, reply }) => {
  await conn.sendMessage(m.key.remoteJid, {
    react: {
        text: "💀",
        key: m.key
    }
});

  try {
    if (args.length < 1) {
      return reply("Please mention a user to calculate their aura.\nUsage: `.aura @user`");
    }

    let user = m.mentionedJid[0]; 
    const specialNumber = config.DEV ? `${config.DEV}@s.whatsapp.net` : null;

    // Calculate a random aura score (between 1 to 1000)
    let auraScore = Math.floor(Math.random() * 1000) + 1;

    // Check if the mentioned user is the special number
    if (user === specialNumber) {
      auraScore = 999999; // Special case for DEV number
      return reply(`💀 Aura of @${user.split('@')[0]}: ${auraScore}+ 🗿`);
    }

    // Send the aura message
    await conn.sendMessage(mek.chat, {
      text: `💀 Aura of @${user.split('@')[0]}: ${auraScore}/1000 🗿`,
      mentions: [user],
    }, { quoted: mek });

  } catch (error) {
    console.log(error);
    reply(`❌ Error: ${error.message}`);
  }
});

cmd({
    pattern: "roast",
    alias: ["insult"],
    desc: "Roast someone in Pigdin",
    category: "fun",
    react: "",
    filename: __filename,
    use: "@tag"
}, async (conn, mek, m, { q, reply }) => {
  await conn.sendMessage(m.key.remoteJid, {
    react: {
        text: "🔥",
        key: m.key
    }
});

let roasts = [
  'Bro, your brain dey buffer like bad network!',
  'You dey reason like person wey DStv no subscribe!',
  'Your IQ na like NEPA light, e dey blink anyhow!',
  'Bro, even pure water get more value pass your advice!',
  'If mumu was a profession, you go don be CEO!',
  'You sabi yarn dust pass harmattan breeze!',
  'Bro, your sense get low battery, go charge am!',
  'Your head dey like generator wey no get fuel!',
  'Even Google tire to search your sense!',
  'Your brain dey do loading... since 2015!',
  'If to say foolishness na exam, you for be professor!',
  'Your thinking na like Danfo driver — always off route!',
  'Even snake go fear to enter your brain, e too empty!',
  'Your mouth dey leak pass gutter water!',
  'Bro, if slow thinking na sport, you go collect gold medal!',
  'The way your head dey work, even Windows 98 fast pass you!',
  'You dey behave like phone wey no get network!',
  'If to say overconfidence dey cure stupidity, you for wise since!',
  'You no get wahala, na wahala get you!',
  'Bro, your mumu get unlimited subscription!',
  'E be like say your village people open WhatsApp group for your matter!',
  'You be like recharge card wey dem don scratch finish!',
  'If dem dey find who go disgrace ancestors, na you dem go pick!',
  'Your brain dey hibernate like old laptop!',
  'Your sense na trial version, e don expire!',
  'You sabi reason nonsense pass who drink burukutu!',
  'If dem dey share common sense, you go come late!',
  'Bro, your thinking process dey like Nollywood part 1,2,3... no ending!',
  'You dey form hard guy but mosquito fit flog you!',
  'Even plantain wey don ripe still get more sense pass you!',
  'Your confidence pass your brain capacity!',
  'Your eye sharp but your brain blind!',
  'Bro, na only you fit fail open-book exam!',
  'Dem suppose use you do case study for misplaced priorities!',
  'Your life na loading screen wey no dey load!',
  'You dey reason like person wey chop expired biscuit!',
  'If overhype na disease, you go need quarantine!',
  'Your brain dey leak like DSTV subscription wey expire!',
  'Bro, your mouth dey move faster than your brain!',
  'The only update you sabi na to dey misbehave!',
  'Your logic fit crash Facebook server!',
  'If ignorance na art, you for win Grammy!',
  'Your destiny dey buffer like NTA network!',
  'Bro, your vibe dry pass harmattan lips!',
  'You fit confuse Google Maps with your sense of direction!',
  'You sabi argue nonsense pass mechanic!',
  'Even sachet water get more relevance pass you!',
  'Your brain reset button don spoil!',
  'You dey do pass yourself like fowl wey no sabi fly!',
  'Bro, you need factory reset urgently!',
  'Na only you fit block yourself on WhatsApp!',
  'If foolishness na money, you for don buy mansion!',
  'Your swagger dey leak like old basket!',
  'You dey form boss but na only mosquito dey fear you!',
  'Bro, your sense dey on sabbatical leave!',
  'You dey reason like person wey drink sniper!',
  'Your WiFi brain signal na "no network"! 😂',
  'Bro, your own worse pass village people hand!',
  'Even JAMB cut-off mark dey high pass your reasoning!',
  'Your brain dey jog on slow motion!',
  'You dey reason like person wey believe ATM dey cook money!',
  'Bro, your village people dey stream your life live!'
];




             
        
    let randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
    let sender = `@${mek.sender.split("@")[0]}`;
    let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);

    if (!mentionedUser) {
        return reply("Usage: .roast @user (Tag someone to roast them!)");
    }

    let target = `@${mentionedUser.split("@")[0]}`;
    
    // Sending the roast message with the mentioned user
    let message = `${target} :\n *${randomRoast}*\n> This is all for fun, don't take it seriously!`;
    await conn.sendMessage(mek.chat, { text: message, mentions: [mek.sender, mentionedUser] }, { quoted: mek });
});

cmd({
    pattern: "8ball",
    desc: "Magic 8-Ball gives answers",
    category: "fun",
    filename: __filename,
    use: ".8ball <yes/no question>"
}, 
async (conn, mek, m, { from, q, reply }) => {
  await conn.sendMessage(m.key.remoteJid, {
    react: {
        text: "🎱",
        key: m.key
    }
});
    if (!q) return reply("Ask a yes/no question! Example: .8ball Will I be rich?");
    
    let responses = [
        "Yes!", "No.", "Maybe...", "Definitely!", "Not sure.", 
        "Ask again later.", "I don't think so.", "Absolutely!", 
        "No way!", "Looks promising!"
    ];
    
    let answer = responses[Math.floor(Math.random() * responses.length)];
    
    reply(`🎱 *Magic 8-Ball says:* ${answer}`);
});

cmd({
    pattern: "compliment",
    desc: "Give a nice compliment",
    category: "fun",
    filename: __filename,
    use: "@tag (optional)"
}, async (conn, mek, m, { reply }) => {
  await conn.sendMessage(m.key.remoteJid, {
    react: {
        text: "😊",
        key: m.key
    }
});
    let compliments = [
        "You're amazing just the way you are! 💖",
        "You light up every room you walk into! 🌟",
        "Your smile is contagious! 😊",
        "You're a genius in your own way! 🧠",
        "You bring happiness to everyone around you! 🥰",
        "You're like a human sunshine! ☀️",
        "Your kindness makes the world a better place! ❤️",
        "You're unique and irreplaceable! ✨",
        "You're a great listener and a wonderful friend! 🤗",
        "Your positive vibes are truly inspiring! 💫",
        "You're stronger than you think! 💪",
        "Your creativity is beyond amazing! 🎨",
        "You make life more fun and interesting! 🎉",
        "Your energy is uplifting to everyone around you! 🔥",
        "You're a true leader, even if you don’t realize it! 🏆",
        "Your words have the power to make people smile! 😊",
        "You're so talented, and the world needs your skills! 🎭",
        "You're a walking masterpiece of awesomeness! 🎨",
        "You're proof that kindness still exists in the world! 💕",
        "You make even the hardest days feel a little brighter! ☀️"
    ];

    let randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
    let sender = `@${mek.sender.split("@")[0]}`;
    let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
    let target = mentionedUser ? `@${mentionedUser.split("@")[0]}` : "";

    let message = mentionedUser 
        ? `${sender} complimented ${target}:\n😊 *${randomCompliment}*`
        : `${sender}, you forgot to tag someone! But hey, here's a compliment for you:\n😊 *${randomCompliment}*`;

    await conn.sendMessage(mek.chat, { text: message, mentions: [mek.sender, mentionedUser].filter(Boolean) }, { quoted: mek });
});

cmd({
    pattern: "lovetest",
    desc: "Check love compatibility between two users",
    category: "fun",
    filename: __filename,
    use: "@tag1 @tag2"
}, async (conn, mek, m, { args, reply }) => {
  await conn.sendMessage(m.key.remoteJid, {
    react: {
        text: "❤️",
        key: m.key
    }
});
    if (args.length < 2) return reply("Tag two users! Example: .lovetest @user1 @user2");

    let user1 = args[0].replace("@", "") + "@s.whatsapp.net";
    let user2 = args[1].replace("@", "") + "@s.whatsapp.net";

    let lovePercent = Math.floor(Math.random() * 100) + 1; // Generates a number between 1-100

    let messages = [
        { range: [90, 100], text: "💖 *A match made in heaven!* True love exists!" },
        { range: [75, 89], text: "😍 *Strong connection!* This love is deep and meaningful." },
        { range: [50, 74], text: "😊 *Good compatibility!* You both can make it work." },
        { range: [30, 49], text: "🤔 *It’s complicated!* Needs effort, but possible!" },
        { range: [10, 29], text: "😅 *Not the best match!* Maybe try being just friends?" },
        { range: [1, 9], text: "💔 *Uh-oh!* This love is as real as a Bollywood breakup!" }
    ];

    let loveMessage = messages.find(msg => lovePercent >= msg.range[0] && lovePercent <= msg.range[1]).text;

    let message = `💘 *Love Compatibility Test* 💘\n\n❤️ *@${user1.split("@")[0]}* + *@${user2.split("@")[0]}* = *${lovePercent}%*\n${loveMessage}`;

    await conn.sendMessage(mek.chat, { text: message, mentions: [user1, user2] }, { quoted: mek });
}); 

cmd(
    {
        pattern: "emoji",
        desc: "Convert text into emoji form.",
        category: "fun",
        filename: __filename,
        use: "<text>"
    },
    async (conn, mek, m, { args, q, reply }) => {
      await conn.sendMessage(m.key.remoteJid, {
        react: {
            text: "🙂",
            key: m.key
        }
    });
        try {
            // Join the words together in case the user enters multiple words
            let text = args.join(" ");
            
            // Map text to corresponding emoji characters
            let emojiMapping = {
                "a": "🅰️",
                "b": "🅱️",
                "c": "🇨️",
                "d": "🇩️",
                "e": "🇪️",
                "f": "🇫️",
                "g": "🇬️",
                "h": "🇭️",
                "i": "🇮️",
                "j": "🇯️",
                "k": "🇰️",
                "l": "🇱️",
                "m": "🇲️",
                "n": "🇳️",
                "o": "🅾️",
                "p": "🇵️",
                "q": "🇶️",
                "r": "🇷️",
                "s": "🇸️",
                "t": "🇹️",
                "u": "🇺️",
                "v": "🇻️",
                "w": "🇼️",
                "x": "🇽️",
                "y": "🇾️",
                "z": "🇿️",
                "0": "0️⃣",
                "1": "1️⃣",
                "2": "2️⃣",
                "3": "3️⃣",
                "4": "4️⃣",
                "5": "5️⃣",
                "6": "6️⃣",
                "7": "7️⃣",
                "8": "8️⃣",
                "9": "9️⃣",
                " ": "␣", // for space
            };

            // Convert the input text into emoji form
            let emojiText = text.toLowerCase().split("").map(char => emojiMapping[char] || char).join("");

            // If no valid text is provided
            if (!text) {
                return reply("Please provide some text to convert into emojis!");
            }

            await conn.sendMessage(mek.chat, {
                text: emojiText,
            }, { quoted: mek });

        } catch (error) {
            console.log(error);
            reply(`Error: ${error.message}`);
        }
    }
);
