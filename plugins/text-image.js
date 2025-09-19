const axios = require('axios');
const cheerio = require('cheerio');
const { cmd } = require('../command');

async function txttoimage(prompt) {
  const datapost = `prompt=${encodeURIComponent(prompt)}`
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36',
    'Referer': 'https://www.texttoimage.org/'
  }

  const res = await axios.post('https://www.texttoimage.org/generate', datapost, { headers })
  const pageUrl = `https://www.texttoimage.org/${res.data.url}`
  const $ = cheerio.load((await axios.get(pageUrl)).data)
  const imgSrc = $('a[data-lightbox="image-set"] img').attr('src')
  return `https://www.texttoimage.org${imgSrc}`
}

cmd({
  pattern: "txt2img",
  alias: ["text2image"],
  desc: "Generate an image based on your text prompt",
  category: "ai",
  filename: __filename
},
async (conn, mek, m, { text, reply }) => {
  if (!text) return reply('*Example:* txt2img Cute Anime Girl');

  try {
    const imageUrl = await txttoimage(text);
    await conn.sendMessage(m.chat, {
      image: { url: imageUrl }
    }, { quoted: mek });
  } catch (e) {
    reply(`❌ Error: ${e.message}`);
  }
});