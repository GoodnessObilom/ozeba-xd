const { cmd } = require('../command');

const gameState = globalThis.squidGameState || (globalThis.squidGameState = {});

cmd({
  pattern: "squidgame",
  desc: "🦑 *How to Play: Squid Game (WhatsApp Bot Edition)*\n\n🔰 *How to Start*\n1. Type `.squidgame` to start the game in a group.\n2. Other players must join by sending `squidgame join`.\n3. You have 1 minute to join the game.\n4. The bot will notify at 30s and 10s left.\n5. Game auto-starts if at least 2 players joined.\n\n🟢 *Green Light Phase (10 seconds)*\n- Spam messages quickly.\n- Each message = +1 point.\n- First to 50 messages wins.\n\n🔴 *Red Light Phase (5 seconds)*\n- DO NOT type.\n- If you type, you're eliminated instantly.\n\n🏆 *How to Win*\n- Reach 50 messages during green light.\n- Don’t get eliminated during red light.\n\n📊 *Live Leaderboard*\n- Random leaderboard shown during red light.\n- Shows top players and progress.\n\n❌ *Elimination*\n- Send message during red light = instant elimination.\n- You’ll be tagged if eliminated.\n\n💬 *Commands Summary*\n- Start Game: `.squidgame`\n- Join Game: `squidgame join`\n\n🔥 Good luck! Only one will survive!",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { args, reply }) => {
  const chatId = m.chat;
  const sender = m.sender;
  const joinCmd = args[0]?.toLowerCase() === "join";

  if (joinCmd) {
    if (!gameState[chatId] || gameState[chatId].status !== "waiting") {
      return reply("❌ No Squid Game lobby open. Type `.squidgame` to start one.");
    }
    if (gameState[chatId].players.find(p => p.id === sender)) {
      return reply("❗ You’ve already joined the game.");
    }

    gameState[chatId].players.push({ id: sender });
    await conn.sendMessage(chatId, {
      text: `✅ @${sender.split("@")[0]} has joined the Squid Game!\n Use .help squidgame if you dont understand`,
      mentions: [sender]
    });
    return;
  }

  if (gameState[chatId]) return reply("⚠️ A Squid Game is already in progress.");

  gameState[chatId] = {
    status: "waiting",
    players: [{ id: sender }],
    scores: {},
    eliminated: [],
    interval: null,
    currentLight: null
  };

  await conn.sendMessage(chatId, {
    text: `✅ @${sender.split("@")[0]} has joined the Squid Game!`,
    mentions: [sender]
  });

  await conn.sendMessage(chatId, {
    text: `🔴 *Squid Game: Red Light, Green Light!*\n\nType \".squidgame join\" to participate.\n⏳ You have 1 minute to join.\nUse .help squidgame if you dont understand`
  });

  setTimeout(() => conn.sendMessage(chatId, { text: "🕒 30 seconds left to join!" }), 30000);
  setTimeout(() => conn.sendMessage(chatId, { text: "⏰ 10 seconds left to join!" }), 50000);

  setTimeout(async () => {
    const game = gameState[chatId];
    if (!game.players || game.players.length < 2) {
      delete gameState[chatId];
      return conn.sendMessage(chatId, {
        text: "❌ Not enough players joined. At least 2 players required."
      });
    }

    game.status = "started";
    game.players.forEach(p => game.scores[p.id] = 0);

    await conn.sendMessage(chatId, {
      text: `🎮 Game Starting with ${game.players.length} players!\n\nGoal: First to send 50 messages during 🟩 *Green Light* wins.\n🟥 *Red Light* = silence or elimination!`
    });

    startGameLoop(conn, chatId);
  }, 60000);
});

function startGameLoop(conn, chatId) {
  const game = gameState[chatId];
  if (!game) return;

  const interval = setInterval(async () => {
    if (game.players.length <= 1) {
      clearInterval(game.interval);
      game.status = "ended";
      const winner = game.players[0];
      await conn.sendMessage(chatId, {
        text: `🏆 *Congratulations @${winner.id.split("@")[0]}!*\nYou survived and won the Squid Game with ${game.scores[winner.id]} messages!`,
        mentions: [winner.id]
      });
      delete gameState[chatId];
      return;
    }

    // GREEN LIGHT
    game.currentLight = "green";
    await conn.sendMessage(chatId, { text: "🟩 *GREEN LIGHT!* Start sending messages!" });
    await delay(10000); // 10s

    // Eliminate silent players after green light
    if (typeof global.eliminateSilentPlayers === 'function') {
      await global.eliminateSilentPlayers(conn, chatId);
    }

    // RED LIGHT
    game.currentLight = "red";
    await conn.sendMessage(chatId, { text: "🟥 *RED LIGHT!* Stay silent or be eliminated!" });

    // Random leaderboard during red light
    if (Math.random() > 0.4) {
      const leaderboard = Object.entries(game.scores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([id, score], i) => `${i + 1}. @${id.split("@")[0]} - ${score} msgs`)
        .join("\n");

      await conn.sendMessage(chatId, {
        text: `📊 *Live Leaderboard:*\n\n${leaderboard}`,
        mentions: Object.keys(game.scores)
      });
    }

    await delay(5000); // 5s
  }, 15000);

  game.interval = interval;
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

