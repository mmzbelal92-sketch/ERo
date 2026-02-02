const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "rip4",
  version: "1.7.0",
  hasPermssion: 0,
  credits: "MahMUD (Mirai Version)",
  description: "কাউকে RIP মেম বানিয়ে দিন।",
  commandCategory: "fun",
  usages: "[Mention/Reply/UID]",
  cooldowns: 10,
};

// বেস এপিআই ইউআরএল সংগ্রহের ফাংশন
async function getBaseApi() {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
  return base.data.mahmud;
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, messageReply, mentions } = event;

  // ১. অথর নেম চেক (অরিজিনাল লজিক বজায় রাখা হয়েছে)
  const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68);
  if (this.config.credits.split(" ")[0] !== obfuscatedAuthor) {
    return api.sendMessage("You are not authorized to change the author name.", threadID, messageID);
  }

  // ২. টার্গেট আইডি নির্ধারণ
  let id2;
  if (messageReply) {
    id2 = messageReply.senderID;
  } else if (Object.keys(mentions).length > 0) {
    id2 = Object.keys(mentions)[0];
  } else if (args[0]) {
    id2 = args[0];
  } else {
    return api.sendMessage("baby, Mention, reply, or provide UID of the target.", threadID, messageID);
  }

  try {
    // লোডিং রিঅ্যাকশন বা মেসেজ (ঐচ্ছিক)
    api.setMessageReaction("🐸", messageID, () => {}, true);

    const apiBase = await getBaseApi();
    const url = `${apiBase}/api/dig?type=rip&user=${id2}`;

    const response = await axios.get(url, { responseType: "arraybuffer" });
    
    // ক্যাশ ডিরেক্টরি চেক
    const cachePath = path.join(__dirname, "cache");
    if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);
    
    const filePath = path.join(cachePath, `rip_${id2}.png`);
    fs.writeFileSync(filePath, Buffer.from(response.data));

    // ৩. মেম পাঠানো
    return api.sendMessage({
      body: `rip 🐸`,
      attachment: fs.createReadStream(filePath)
    }, threadID, () => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }, messageID);

  } catch (err) {
    console.error(err);
    api.sendMessage(`🥹 error, contact MahMUD.`, threadID, messageID);
  }
};
