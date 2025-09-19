const { cmd } = require("../command");

const scores = {};
const activeGames = {};
const activeListeners = {};
const gameMeta = {};
const getGameKey = (p1, p2) => [p1, p2].sort().join("-");

cmd({
  pattern: "ttt",
  alias: ["tictactoe", "xo"],
  desc: "Start a Tic Tac Toe game",
  category: "game",
  filename: __filename,
}, async (conn, mek, m, { from, sender, reply, args, participants, isGroup }) => {

  if (!isGroup) return reply("❌ This command can only be used in groups.");

  const senderJid = sender.endsWith("@lid") ? participants.find(p => p.id === sender)?.jid : sender;
  const senderNum = senderJid.replace(/[^0-9]/g, "");

  const allJids = participants.map(p => p.jid); // Correct JIDs only

  const rawInput = args.join("").replace(/[^0-9]/g, "");
  if (!rawInput) return reply("👥 Provide the opponent's *WhatsApp number*. Example: .ttt 2348012345678");

  if (rawInput.length < 10 || rawInput.length > 15)
    return reply("📱 Invalid number format. Use full WhatsApp number like 2348012345678");

  if (rawInput === senderNum)
    return reply("❌ You can't play against yourself.");

  const opponentJid = allJids.find(j => j.includes(rawInput));
  if (!opponentJid)
    return reply("❌ The opponent is not in this group.\n\nPaste their *number* (like 2348012345678), not tag.");

  const gameKey = getGameKey(senderNum, rawInput);
  if (activeGames[gameKey]) return reply("⚠️ A game is already ongoing between you two.");

  let board = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
  let currentPlayer = "❌";
  let turns = 0;

  const renderBoard = (currentId) => `
🎮 *Tic Tac Toe*

${board[0]} | ${board[1]} | ${board[2]}
${board[3]} | ${board[4]} | ${board[5]}
${board[6]} | ${board[7]} | ${board[8]}

👤 *Turn:* @${currentId} (${currentPlayer})
🗨️ Reply to this message with a number (1–9) to play.`.trim();

  const checkWin = () => {
    const wins = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    return wins.some(([a, b, c]) => board[a] === currentPlayer && board[b] === currentPlayer && board[c] === currentPlayer);
  };

  const sent = await conn.sendMessage(from, {
    text: renderBoard(senderNum),
    mentions: [senderJid, opponentJid]
  }, { quoted: m });

  gameMeta[gameKey] = {
    playerX: senderNum,
    playerO: rawInput,
    jidX: senderJid,
    jidO: opponentJid,
    messageID: sent.key.id
  };

  activeGames[gameKey] = true;

  const cleanup = (key) => {
    if (activeListeners[key]) conn.ev.off("messages.upsert", activeListeners[key]);
    delete activeListeners[key];
    delete activeGames[key];
    delete gameMeta[key];
  };

  const handler = async (msgData) => {
    try {
      const msg = msgData.messages?.[0];
      if (!msg?.message || msg.key.remoteJid !== from) return;

      const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
      if (!text.match(/^[1-9]$/)) return;

      // 👇 FIX: Resolve sender JID (from lid if needed)
      const rawFrom = msg.key.participant || msg.key.remoteJid;
      const fromJid = rawFrom.endsWith("@lid")
        ? participants.find(p => p.id === rawFrom)?.jid
        : rawFrom;
      if (!fromJid) return;

      const fromNum = fromJid.replace(/[^0-9]/g, "");

      const meta = gameMeta[gameKey];
      if (!meta) return;

      const expected = currentPlayer === "❌" ? meta.playerX : meta.playerO;
      if (fromNum !== expected) {
        return conn.sendMessage(from, {
          text: `⚠️ It's not your turn.`,
          mentions: [currentPlayer === "❌" ? meta.jidX : meta.jidO]
        }, { quoted: msg });
      }

      const move = parseInt(text);
      const idx = move - 1;
      if (["❌", "⭕"].includes(board[idx])) {
        return conn.sendMessage(from, { text: "❎ That spot is already taken." }, { quoted: msg });
      }

      board[idx] = currentPlayer;
      turns++;

      if (checkWin()) {
        scores[expected] = (scores[expected] || 0) + 1;
        await conn.sendMessage(from, {
          text: `🎉 *${currentPlayer} wins!* @${expected}\n\n${renderBoard(expected)}\n\n🏆 *Scores:*\n@${meta.playerX}: ${scores[meta.playerX] || 0}\n@${meta.playerO}: ${scores[meta.playerO] || 0}`,
          mentions: [meta.jidX, meta.jidO]
        }, { quoted: msg });
        cleanup(gameKey);
        return;
      }

      if (turns === 9) {
        await conn.sendMessage(from, {
          text: `🤝 *It's a draw!*\n\n${renderBoard(expected)}`,
          mentions: [meta.jidX, meta.jidO]
        }, { quoted: msg });
        cleanup(gameKey);
        return;
      }

      currentPlayer = currentPlayer === "❌" ? "⭕" : "❌";
      const nextTurn = currentPlayer === "❌" ? meta.playerX : meta.playerO;
      const nextMsg = await conn.sendMessage(from, {
        text: renderBoard(nextTurn),
        mentions: [meta.jidX, meta.jidO]
      }, { quoted: msg });

      gameMeta[gameKey].messageID = nextMsg.key.id;

    } catch (err) {
      console.error("[TicTacToe Handler Error]:", err);
    }
  };

  activeListeners[gameKey] = handler;
  conn.ev.on("messages.upsert", handler);
});

cmd({
  pattern: "tttstop",
  desc: "Force stop any active Tic Tac Toe game",
  category: "game",
  filename: __filename
}, async (conn, mek, m, { sender, reply, participants }) => {
  const senderJid = sender.endsWith("@lid") ? participants.find(p => p.id === sender)?.jid : sender;
  const senderNum = senderJid.replace(/[^0-9]/g, "");
  const key = Object.keys(activeGames).find(k => k.includes(senderNum));
  if (!key) return reply("⚠️ You are not in any active game.");

  if (activeListeners[key]) conn.ev.off("messages.upsert", activeListeners[key]);
  delete activeGames[key];
  delete activeListeners[key];
  delete gameMeta[key];

  reply("🛑 Game has been stopped.");
});