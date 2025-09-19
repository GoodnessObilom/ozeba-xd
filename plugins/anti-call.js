const { cmd } = require('../command');
const config = require('../config');

let called = false;

cmd({
  on: "body"
}, async (conn, mek, m, { from }) => {
  try {
    if (!called) {
      conn.ev.on("call", async (json) => {
        if (config.ANTI_CALL !== "true") return;

        for (const id of json) {
          if (id.status !== "offer") continue;

          await conn.rejectCall(id.id, id.from);

          if (!id.isGroup) {
            await conn.sendMessage(id.from, {
              text: "*📵 Call rejected automatically because the owner is busy.*",
              mentions: [id.from]
            });
          }
        }
      });
      called = true; // ensure it's only attached once
    }
  } catch (e) {
    console.log(e);
    reply(e.toString());
  }
});