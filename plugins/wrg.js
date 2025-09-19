const axios = require('axios');
const { cmd } = require('../command');

const wrgGames = {};
const turnTimers = {};
const wrgStartTimers = {};

function isGameReplyMessage(m) {
  const text = m.text || m.body || m.msg?.text || m.msg?.conversation || '';
  return text.includes('#wrg');
}

function getPhoneNumber(jid, participants) {
  const match = participants?.find(p => p.id === jid || p.phoneNumber === jid);
  return match?.id?.split('@')[0] || jid.split('@')[0];
}

cmd({
  pattern: "wrg",
  desc: 'Word Relay Game: .wrg, .wrg stop, .wrg leave',
  category: 'game',
  filename: __filename,
}, async (conn, mek, m, { from, sender, isGroup, args, participants }) => {
  const sub = (args[0] || '').toLowerCase();

  if (!sub) {
    if (!isGroup) return await conn.sendMessage(from, {
      text: '❗ This game only works in *groups*.\n#wrg'
    });

    if (wrgGames[from]) return await conn.sendMessage(from, {
      text: '⚠️ A game is *already running* in this group.\n#wrg'
    });

    wrgGames[from] = {
      players: [sender],
      started: false,
      round: 1,
      minLen: 3,
      currentLetter: '',
      turn: 0,
      usedWords: [],
      turnTime: 40
    };

    const text = `🎮 *Word Relay Game Created!*\n\n👤 Player 1: @${getPhoneNumber(sender, participants)}\n\nType *join* to join the game!\n\nGame will start in 40s if at least 2 people join.\n*Please public your bot before the game starts*\n#wrg`;
    await conn.sendMessage(from, {
      text,
      mentions: [sender]
    });

    setTimeout(() => {
      if (wrgGames[from] && !wrgGames[from].started) {
        conn.sendMessage(from, { text: `⏳ 30 seconds remaining to join the game!\nType *join* to join.\n#wrg` });
      }
    }, 10000);

    setTimeout(() => {
      if (wrgGames[from] && !wrgGames[from].started) {
        conn.sendMessage(from, { text: `⏳ 10 seconds left! Type *join* to join the Word Relay Game.\n#wrg` });
      }
    }, 30000);

    wrgStartTimers[from] = setTimeout(() => {
      const game = wrgGames[from];
      if (!game || game.started) return;

      if (game.players.length >= 2) {
        game.started = true;
        game.currentLetter = randomLetter();
        game.turn = 0;
        const current = game.players[0];
        const next = game.players[1];

        const text = `🎮 *Game starting!*\n\n🔤 First Letter: *${game.currentLetter.toUpperCase()}*\n\n🎯 @${getPhoneNumber(current, participants)}, it's your turn!\nStart with: *${game.currentLetter.toUpperCase()}*\nMin letters: ${game.minLen}\nNext: @${getPhoneNumber(next, participants)}\n⏱️ ${game.turnTime}s\n#wrg`;
        conn.sendMessage(from, {
          text,
          mentions: [current, next]
        });

        startTurnTimeout(from, conn, participants);
      } else {
        conn.sendMessage(from, {
          text: '🚫 Not enough players joined. Game cancelled.\n#wrg'
        });
        delete wrgGames[from];
      }
    }, 40000);

    return;
  }

  if (sub === 'stop') {
    if (!wrgGames[from]) return await conn.sendMessage(from, {
      text: '❌ No game running.\n#wrg'
    });
    delete wrgGames[from];
    return await conn.sendMessage(from, {
      text: '🛑 Game has been stopped.\n#wrg'
    });
  }

  if (sub === 'leave') {
    const game = wrgGames[from];
    if (!game) return await conn.sendMessage(from, {
      text: '❌ No game running.\n#wrg'
    });
    if (!game.players.includes(sender)) return await conn.sendMessage(from, {
      text: '😕 You are not in the game.\n#wrg'
    });

    game.players = game.players.filter(p => p !== sender);

    await conn.sendMessage(from, {
      text: `👋 @${getPhoneNumber(sender, participants)} left the game.\n#wrg`,
      mentions: [sender]
    });

    if (game.players.length < 2 && game.started) {
      await conn.sendMessage(from, {
        text: '🏁 Not enough players left. Game ended.\n#wrg'
      });
      delete wrgGames[from];
    }
    return;
  }
});

cmd({
  on: 'body',
}, async (conn, mek, m, { from, sender, body, participants }) => {
  const game = wrgGames[from];

  if (body?.toLowerCase?.() === "join") {
    if (!game || game.started) return;
    if (game.players.includes(sender)) return conn.sendMessage(from, {
      text: '😅 You already joined!\n#wrg'
    });
    game.players.push(sender);

    return await conn.sendMessage(from, {
      text: `✅ @${getPhoneNumber(sender, participants)} joined the game!\n#wrg`,
      mentions: [sender]
    });
  }

  if (!game || !game.started || !game.players.includes(sender) || game.players[game.turn] !== sender || isGameReplyMessage(m)) return;

  const word = body.trim().toLowerCase();

  const warn = async (reason) => {
    await conn.sendMessage(from, {
      text: `⚠️ @${getPhoneNumber(sender, participants)}, ${reason}\nTry again before your time runs out!\n#wrg`,
      mentions: [sender]
    });
  };

  if (word.length < game.minLen) return warn(`your word is too short. Minimum length: ${game.minLen}`);
  if (game.currentLetter && word[0] !== game.currentLetter) return warn(`your word must start with *${game.currentLetter.toUpperCase()}*`);

  try {
    const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!Array.isArray(res.data)) throw new Error();

    clearTimeout(turnTimers[from]);
    game.usedWords.push(word);
    game.round++;

    if ((game.round - 1) % game.players.length === 0) {
      game.minLen++;
      if (game.turnTime > 10) {
        game.turnTime = Math.max(game.turnTime - 5, 10);
      }
    }

    game.turn = (game.turn + 1) % game.players.length;
    game.currentLetter = word[word.length - 1];

    const next = game.players[game.turn];
    const warnNext = game.players[(game.turn + 1) % game.players.length];

    const text = `✅ Great job @${getPhoneNumber(sender, participants)}!\nWord: *${word}*\n\n🧠 @${getPhoneNumber(next, participants)}, you're next!\nStart with: *${game.currentLetter.toUpperCase()}*\nMin length: ${game.minLen}\n⏱️ You have ${game.turnTime}s\n#wrg`;
    await conn.sendMessage(from, {
      text,
      mentions: [sender, next, warnNext]
    });

    startTurnTimeout(from, conn, participants);
  } catch (e) {
    return warn('that word is invalid or not found in the dictionary.');
  }
});

function startTurnTimeout(from, conn, participants) {
  const game = wrgGames[from];
  const player = game.players[game.turn];
  if (turnTimers[from]) clearTimeout(turnTimers[from]);

  turnTimers[from] = setTimeout(async () => {
    await conn.sendMessage(from, {
      text: `⏰ @${getPhoneNumber(player, participants)} was too slow and is disqualified!\n#wrg`,
      mentions: [player]
    });

    game.players = game.players.filter(p => p !== player);

    if (game.players.length === 1) {
      const winner = game.players[0];
      await conn.sendMessage(from, {
        text: `🏆 Congratulations @${getPhoneNumber(winner, participants)}! You are the *winner* of this Word Relay Game! 🎉\n#wrg`,
        mentions: [winner]
      });
      delete wrgGames[from];
      return;
    }

    if (game.players.length < 2) {
      conn.sendMessage(from, { text: '🏁 Not enough players left. Game ended.\n#wrg' });
      delete wrgGames[from];
      return;
    }

    game.turn = game.turn % game.players.length;
    setTimeout(() => nextTurn(conn, from, participants), 1000);
  }, game.turnTime * 1000);
}

function nextTurn(conn, from, participants) {
  const game = wrgGames[from];
  if (!game) return;

  const player = game.players[game.turn];
  const next = game.players[(game.turn + 1) % game.players.length];

  const text = `🎯 @${getPhoneNumber(player, participants)}, it's your turn!\nStart with: *${game.currentLetter.toUpperCase()}*\nMin letters: ${game.minLen}\nNext: @${getPhoneNumber(next, participants)}\n⏱️ ${game.turnTime}s\n#wrg`;
  conn.sendMessage(from, {
    text,
    mentions: [player, next]
  });

  startTurnTimeout(from, conn, participants);
}

function randomLetter() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}