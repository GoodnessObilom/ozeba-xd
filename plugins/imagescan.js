const axios = require("axios");
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { cmd } = require('../command');

// Helper function to upload to Catbox with retries
async function uploadToCatbox(form) {
  const maxRetries = 3;
  const timeout = 30000; // 30 seconds
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.post("https://catbox.moe/user/api.php", form, {
        headers: form.getHeaders(),
        timeout: timeout,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });
      
      if (!response.data) {
        throw new Error("Empty response from Catbox");
      }
      if (attempt > 1) {
        console.log(`Successfully uploaded on attempt ${attempt}`);
      }
      return response.data;
    } catch (error) {
      console.log(`Upload attempt ${attempt} failed: ${error.message}`);
      if (attempt === maxRetries) {
        throw new Error(`Failed to upload after ${maxRetries} attempts: ${error.message}`);
      }
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}

// Helper function to scan image with retries
async function scanImage(imageUrl) {
  const maxRetries = 3;
  const timeout = 30000;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const scanUrl = `https://apis.davidcyriltech.my.id/imgscan?url=${encodeURIComponent(imageUrl)}`;
      const response = await axios.get(scanUrl, { timeout });
      
      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to analyze image");
      }
      
      return response.data.result;
    } catch (error) {
      console.log(`Scan attempt ${attempt} failed: ${error.message}`);
      if (attempt === maxRetries) {
        throw new Error(`Failed to scan image after ${maxRetries} attempts: ${error.message}`);
      }
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}

cmd({
  pattern: "scan",
  alias: ["imgscan", "imagescan", "scanimg", "scanimage"],
  desc: "Scan an image using AI",
  category: "ai",
  filename: __filename
}, async (conn, message, m, { reply, quoted }) => {
  await conn.sendMessage(message.key.remoteJid, {
    react: {
      text: "🔍",
      key: message.key
    }
  });
  
  try {
    // Check if message is a reply and contains an image
    if (!m.quoted) {
      return reply("Please reply to an image file (JPEG/PNG)");
    }

    // Get the quoted message type
    const quotedType = m.quoted.mtype;
    if (quotedType !== 'imageMessage') {
      return reply("Please make sure you're replying to an image file (JPEG/PNG)");
    }
    
    const mimeType = m.quoted.mimetype || '';
    
    // Download the media
    const mediaBuffer = await m.quoted.download();
    const extension = mimeType.includes('image/jpeg') ? '.jpg' : 
                     mimeType.includes('image/png') ? '.png' : null;
                     
    if (!extension) {
      throw new Error("Unsupported image format. Please use JPEG or PNG");
    }

    const tempFilePath = path.join(os.tmpdir(), `imgscan_${Date.now()}${extension}`);
    fs.writeFileSync(tempFilePath, mediaBuffer);

    // Upload to Catbox with retries
    const form = new FormData();
    form.append('fileToUpload', fs.createReadStream(tempFilePath), `image${extension}`);
    form.append('reqtype', 'fileupload');

    // Upload with retrie
    const imageUrl = await uploadToCatbox(form);
    fs.unlinkSync(tempFilePath);

    // Scan with retries
    await reply("🔄 Analyzing image...");
    const result = await scanImage(imageUrl);

    await reply(
      `🔍 *Image Analysis Results*\n\n` +
      `${result}\n\n` +
      `> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴏᴏᴅɴᴇꜱꜱ ᴛᴇᴄʜ*`
    );

  } catch (error) {
    console.error('Image Scan Error:', error);
    await reply(`❌ Error: ${error.message || error}`);
  }
});
