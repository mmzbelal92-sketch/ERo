const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "prefix",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "BELAL BOTX666",
  description: "Display prefix with auto-video attachment",
  commandCategory: "Information",
  usages: "prefix",
  cooldowns: 5
};

module.exports.handleEvent = async ({ event, api, Threads }) => {
  var { threadID, messageID, body } = event;
  if (!body) return;

  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;
  const dataThread = await Threads.getData(threadID);
  const groupName = dataThread.threadInfo?.threadName || "Unnamed Group";

  const adminName = "চাঁদের পাহাড় ✡️";
  const fbID = "https://www.facebook.com/mahi.gaming.165";
  const phone = "01913246554";

  const triggerWords = ["prefix", "mprefix", "bot prefix", "what is the prefix", "prefx", "prfix"];

  if (triggerWords.includes(body.toLowerCase())) {
    
    const videos = [
      "https://i.imgur.com/qUJvQud.mp4", "https://i.imgur.com/HFudaEm.mp4",
      "https://i.imgur.com/i8nxwCR.mp4", "https://i.imgur.com/zygQoCK.mp4",
      "https://i.imgur.com/qYTXUUb.mp4", "https://i.imgur.com/zqVszYj.mp4",
      "https://i.imgur.com/AmXhkTP.mp4", "https://i.imgur.com/T3yb7jy.mp4",
      "https://i.imgur.com/Bfq83Nl.mp4", "https://i.imgur.com/iWRa1uU.mp4",
      "https://i.imgur.com/YniEZIV.mp4", "https://i.imgur.com/gBrSoBB.mp4",
      "https://i.imgur.com/uetKIMp.mp4", "https://i.imgur.com/2YJexzw.mp4"
    ];

    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
    const videoPath = path.join(cacheDir, `prefix_${Date.now()}.mp4`);

    const message = `--- Prefix Information ---\n\n` +
      `[ Bot Intel ]\n` +
      `Prefix : [ ${prefix} ]\n` +
      `Name   : BELAL BOT X666\n` +
      `Admin  : ${adminName}\n\n` +
      `[ Box Details ]\n` +
      `Group  : ${groupName}\n` +
      `TID    : ${threadID}\n\n` +
      `[ Owner Links ]\n` +
      `Facebook : ${fbID}\n` +
      `WhatsApp : ${phone}\n` +
      `--------------------------\n` +
      `Sig: ┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়✿⃝🪬❈┉┄\n` +
      `System: Active & Secure`;

    try {
      const response = await axios({
        method: 'get',
        url: randomVideo,
        responseType: 'stream'
      });

      const writer = fs.createWriteStream(videoPath);
      response.data.pipe(writer);

      writer.on('finish', () => {
        api.sendMessage({
          body: message,
          attachment: fs.createReadStream(videoPath)
        }, threadID, () => {
          if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
        }, messageID);
      });
    } catch (err) {
      return api.sendMessage(message, threadID, messageID);
    }
  }
};

module.exports.run = async ({ event, api }) => {
  return api.sendMessage("Prefix জানতে 'prefix' লিখে মেসেজ দিন।", event.threadID);
};
    
