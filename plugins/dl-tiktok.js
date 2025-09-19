

const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');
const moment = require('moment-timezone');
const { cmd } = require('../command');

async function tiktokV1(query) {
  const encodedParams = new URLSearchParams();
  encodedParams.set('url', query);
  encodedParams.set('hd', '1');

  const { data } = await axios.post('https://tikwm.com/api/', encodedParams, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Cookie: 'current_language=en',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
    }
  });

  return data;
}

async function tiktokV2(query) {
  const form = new FormData();
  form.append('q', query);

  const { data } = await axios.post('https://savetik.co/api/ajaxSearch', form, {
    headers: {
      ...form.getHeaders(),
      'Accept': '*/*',
      'Origin': 'https://savetik.co',
      'Referer': 'https://savetik.co/en2',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest'
    }
  });

  const rawHtml = data.data;
  const $ = cheerio.load(rawHtml);
  const title = $('.thumbnail .content h3').text().trim();
  const thumbnail = $('.thumbnail .image-tik img').attr('src');
  const video_url = $('video#vid').attr('data-src');

  const slide_images = [];
  $('.photo-list .download-box li').each((_, el) => {
    const imgSrc = $(el).find('.download-items__thumb img').attr('src');
    if (imgSrc) slide_images.push(imgSrc);
  });

  return { title, thumbnail, video_url, slide_images };
}

cmd({
  pattern: 'tiktok',
  alias: ['tt', 'ttdl'],
  desc: 'Download TikTok video or slideshow',
  category: 'downloader',
  filename: __filename
}, async (conn, m, { text, reply }) => {
  if (!text) return reply('Please provide a valid TikTok URL.\nExample: .tiktok https://vt.tiktok.com/xxxxx');

  await reply('*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ*');

  try {
    let res;
    let images = [];

    const dataV1 = await tiktokV1(text);
    if (dataV1?.data) {
      const d = dataV1.data;
      if (Array.isArray(d.images) && d.images.length > 0) {
        images = d.images;
      } else if (Array.isArray(d.image_post) && d.image_post.length > 0) {
        images = d.image_post;
      }
      res = {
        title: d.title,
        region: d.region,
        duration: d.duration,
        create_time: d.create_time,
        play_count: d.play_count,
        digg_count: d.digg_count,
        comment_count: d.comment_count,
        share_count: d.share_count,
        download_count: d.download_count,
        author: {
          unique_id: d.author?.unique_id,
          nickname: d.author?.nickname
        },
        music_info: {
          title: d.music_info?.title,
          author: d.music_info?.author
        },
        cover: d.cover,
        play: d.play,
        hdplay: d.hdplay,
        wmplay: d.wmplay
      };
    }

    const dataV2 = await tiktokV2(text);
    if ((!res?.play && images.length === 0) && dataV2.video_url) {
      res = res || { play: dataV2.video_url };
    }
    if (Array.isArray(dataV2.slide_images) && dataV2.slide_images.length > 0) {
      images = dataV2.slide_images;
    }

    if (images.length > 0) {
      await reply(`Detected ${images.length} image(s).`);
      for (const img of images) {
        await conn.sendMessage(m.chat, {
          image: { url: img },
          caption: res?.title || ''
        }, { quoted: m });
      }
      return;
    }

    const time = res.create_time
      ? moment.unix(res.create_time).tz('Africa/Lagos').format('dddd, D MMMM YYYY [at] HH:mm:ss')
      : '-';

    const caption = `📹 *TikTok Video Information*

🎵 *Title:* ${res.title || '-'}
🌍 *Region:* ${res.region || 'N/A'}
⏱ *Duration:* ${res.duration || '-'} seconds
📅 *Uploaded:* ${time}

━━━━━━━━━━━━━━━
📊 *Statistics*
👁 *Views:* ${res.play_count?.toLocaleString() || 0}
❤️ *Likes:* ${res.digg_count?.toLocaleString() || 0}
💬 *Comments:* ${res.comment_count?.toLocaleString() || 0}
🔄 *Shares:* ${res.share_count?.toLocaleString() || 0}
⬇️ *Downloads:* ${res.download_count?.toLocaleString() || 0}

━━━━━━━━━━━━━━━
👤 *Author*
🔗 *Username:* ${res.author?.unique_id || '-'}
📛 *Name:* ${res.author?.nickname || '-'}`;

    const videoUrl = res.play || res.hdplay || res.wmplay;
    if (videoUrl) {
      await conn.sendMessage(m.chat, { video: { url: videoUrl }, caption }, { quoted: m });
    } else if (res.cover) {
      await conn.sendMessage(m.chat, { image: { url: res.cover }, caption: 'Video cover' }, { quoted: m });
    }
  } catch (e) {
    reply(`Error: ${e.message}`);
  }
});
