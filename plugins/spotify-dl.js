const { cmd } = require('../command');
const fetch = require('node-fetch');

const s = {
    tools: {
        async hit(description, url, options, returnType = 'text') {
            try {
                const response = await fetch(url, options);
                if (!response.ok) throw Error(`${response.status} ${response.statusText}\n${await response.text() || '(response body kosong)'}`);
                if (returnType === 'text') {
                    const data = await response.text();
                    return { data, response };
                } else if (returnType === 'json') {
                    const data = await response.json();
                    return { data, response };
                } else {
                    throw Error(`invalid returnType param.`);
                }
            } catch (e) {
                throw Error(`hit ${description} failed. ${e.message}`);
            }
        }
    },

    get baseUrl() {
        return 'https://spotisongdownloader.to';
    },
    get baseHeaders() {
        return {
            'accept-encoding': 'gzip, deflate, br, zstd',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
        };
    },

    async getCookie() {
        const url = this.baseUrl;
        const headers = this.baseHeaders;
        const { response } = await this.tools.hit('homepage', url, { headers });
        let cookie = response?.headers?.getSetCookie?.()?.[0]?.split('; ')?.[0];
        if (!cookie?.length) throw Error(`gagal mendapatkan kuki`);
        cookie += '; _ga=GA1.1.2675401.1754827078';
        return { cookie };
    },

    async ifCaptcha(gcObject) {
        const pathname = '/ifCaptcha.php';
        const url = new URL(pathname, this.baseUrl);
        const headers = {
            referer: new URL(this.baseUrl).href,
            ...gcObject,
            ...this.baseHeaders
        };
        await this.tools.hit('ifCaptcha', url, { headers });
        return headers;
    },

    async singleTrack(spotifyTrackUrl, icObject) {
        const pathname = '/api/composer/spotify/xsingle_track.php';
        const url = new URL(pathname, this.baseUrl);
        url.search = new URLSearchParams({ url: spotifyTrackUrl });
        const headers = icObject;
        const { data } = await this.tools.hit('single track', url, { headers }, 'json');
        return data;
    },

    async singleTrackHtml(stObject, icObj) {
        const payload = [
            stObject.song_name,
            stObject.duration,
            stObject.img,
            stObject.artist,
            stObject.url,
            stObject.album_name,
            stObject.released
        ];
        const pathname = '/track.php';
        const url = new URL(pathname, this.baseUrl);
        const headers = icObj;
        const body = new URLSearchParams({ data: JSON.stringify(payload) });
        await this.tools.hit('track html', url, { headers, body, method: 'post' });
        return true;
    },

    async downloadUrl(spotifyTrackUrl, icObj, stObj) {
        const pathname = '/api/composer/spotify/ssdw23456ytrfds.php';
        const url = new URL(pathname, this.baseUrl);
        const headers = icObj;
        const body = new URLSearchParams({
            song_name: '',
            artist_name: '',
            url: spotifyTrackUrl,
            zip_download: 'false',
            quality: 'm4a'
        });
        const { data } = await this.tools.hit('get download url', url, { headers, body, method: 'post' }, 'json');
        return { ...data, ...stObj };
    },

    async download(spotifyTrackUrl) {
        const gcObj = await this.getCookie();
        const icObj = await this.ifCaptcha(gcObj);
        const stObj = await this.singleTrack(spotifyTrackUrl, icObj);
        await this.singleTrackHtml(stObj, icObj);
        const dlObj = await this.downloadUrl(spotifyTrackUrl, icObj, stObj);
        return dlObj;
    }
};

cmd({
    pattern: "spotifydl",
    alias: ["spotify"],
    desc: "Search and download Spotify tracks",
    category: "downloader",
    filename: __filename
}, async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("Example: spotifydl Twice");

        // Search track using Delirius API
        const searchUrl = `https://delirius-apiofc.vercel.app/search/spotify?q=${encodeURIComponent(q)}&limit=1`;
        const searchRes = await fetch(searchUrl);
        const searchJson = await searchRes.json();

        if (!searchJson.status || !searchJson.data?.length) return reply("No results found.");
        const track = searchJson.data[0]; // First result
        const spotifyTrackUrl = track.url;

        reply(`🎵 Downloading: *${track.title}* by *${track.artist}*...`);

        // Download process
        const dl = await s.download(spotifyTrackUrl);
        const audioRes = await fetch(dl.dlink);
        if (!audioRes.ok) throw `Failed to download audio`;
        const audioBuffer = await audioRes.arrayBuffer();

        await conn.sendMessage(m.chat, {
            audio: Buffer.from(audioBuffer),
            mimetype: 'audio/mpeg',
            fileName: `${dl.song_name}.mp3`,
            ptt: false,
            contextInfo: {
                forwardingScore: 999999,
                isForwarded: true,
                externalAdReply: {
                    title: `OZEBA-XD DOWNLOADER`,
                    body: `${dl.song_name} | ${dl.artist}`,
                    mediaType: 1,
                    previewType: 0,
                    renderLargerThumbnail: true,
                    thumbnailUrl: dl.img,
                    sourceUrl: spotifyTrackUrl
                }
            }
        }, { quoted: m });

    } catch (e) {
        reply(`Error: ${e.message || e}`);
    }
});
