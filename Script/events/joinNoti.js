module.exports.config = {
  name: "joinnoti",
  eventType: ["log:subscribe"],
  version: "3.0.0",
  credits: "Chander Pahar x Gemini",
  description: "চাঁদের পাহাড় আল্ট্রা-লাক্সারি ওয়েলকাম ডিজাইন",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

module.exports.onLoad = function () {
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];
  const paths = [
    join(__dirname, "cache", "joinGif"),
    join(__dirname, "cache", "randomgif")
  ];
  for (const path of paths) {
    if (!existsSync(path)) mkdirSync(path, { recursive: true });
  }
};

module.exports.run = async function({ api, event }) {
  const fs = require("fs");
  const path = require("path");
  const { threadID } = event;
  
  const botPrefix = global.config.PREFIX || "/";
  const botName = "BELAL BOTX666"; 

  // যখন বট নিজে গ্রুপে অ্যাড হবে (বটের প্রবেশ)
  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    await api.changeNickname(`[ ${botPrefix} ] • ${botName}`, threadID, api.getCurrentUserID());

    api.sendMessage(`🚀 𝗦𝘆𝘀𝘁𝗲𝗺 𝗔𝗰𝘁𝗶𝘃𝗮𝘁𝗲𝗱: ${botName} এখন আপনাদের সেবায় নিয়োজিত..!`, threadID, () => {
      const randomGifPath = path.join(__dirname, "cache", "randomgif");
      const allFiles = fs.readdirSync(randomGifPath).filter(file =>
        [".mp4", ".jpg", ".png", ".jpeg", ".gif", ".mp3"].some(ext => file.endsWith(ext))
      );

      const selected = allFiles.length > 0 
        ? fs.createReadStream(path.join(randomGifPath, allFiles[Math.floor(Math.random() * allFiles.length)])) 
        : null;

      const messageBody = `┏━━━━━━━ 🛰️ ━━━━━━━┓
   💠 𝗥𝗢𝗬𝗔𝗟 𝗘𝗡𝗧𝗥𝗬: ${botName} 💠
┗━━━━━━━ 🌌 ━━━━━━━┛

✨ 𝐓𝐡𝐚𝐧𝐤 𝐲𝐨𝐮 𝐬𝐨 𝐦𝐮𝐜𝐡 𝐟𝐨𝐫 𝐚𝐝𝐝𝐢𝐧𝐠 𝐦𝐞!
আমি এই গ্রুপের প্রতিটি মুহূর্তকে আনন্দময় করে তুলতে প্রস্তুত। 🖤🤗

🛠️ 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀:
🔹 ${botPrefix}Help  |  🔹 ${botPrefix}Info  |  🔹 ${botPrefix}Admin

━━━━━━━━━━━━━━━━━━━━━
👑 𝗢𝘄𝗻𝗲𝗿: BELAL
📱 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽: 01913246554
🌐 𝗙𝗕: https://www.facebook.com/mahi.gaming.165
━━━━━━━━━━━━━━━━━━━━━
┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়✿⃝🪬❈┉┄`;

      if (selected) {
        api.sendMessage({ body: messageBody, attachment: selected }, threadID);
      } else {
        api.sendMessage(messageBody, threadID);
      }
    });

    return;
  }

  // যখন নতুন মেম্বার জয়েন করবে (মেম্বারদের জন্য গ্র্যান্ড ওয়েলকাম)
  try {
    const { createReadStream, readdirSync } = global.nodemodule["fs-extra"];
    let { threadName, participantIDs } = await api.getThreadInfo(threadID);
    const threadData = global.data.threadData.get(parseInt(threadID)) || {};
    let mentions = [], nameArray = [], memLength = [], i = 0;

    for (let id in event.logMessageData.addedParticipants) {
      const userName = event.logMessageData.addedParticipants[id].fullName;
      nameArray.push(userName);
      mentions.push({ tag: userName, id: event.logMessageData.addedParticipants[id].userFbId });
      memLength.push(participantIDs.length - i++);
    }
    memLength.sort((a, b) => a - b);

    let msg = (typeof threadData.customJoin === "undefined") ? `┏━━━━━━━ 🌸 ━━━━━━━┓
   🎊 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗢𝗨𝗥 𝗙𝗔𝗠𝗜𝗟𝗬 🎊
┗━━━━━━━ 💎 ━━━━━━━┛

🌹 হাসি, আনন্দ আর বন্ধুত্বের ছোঁয়ায় গড়ে উঠুক আমাদের এই রাজকীয় পরিবার।🥰 আমাদের এই বন্ধন হোক চিরস্থায়ী ও পবিত্র।💝

📜 𝗚𝗿𝗼𝘂𝗽 𝗚𝘂𝗶𝗱𝗲𝗹𝗶𝗻𝗲𝘀:
⭐ সবার সাথে মার্জিত ও সুন্দর ব্যবহার কাম্য।😍
⭐ একে অপরের প্রতি সম্মান বজায় রাখুন।🤝
⭐ অশালীন কথা বা গালিগালাজ কঠোরভাবে নিষিদ্ধ।🚫
⭐ গ্রুপের সকল নিয়ম ও এডমিনের কথা মেনে চলুন।✅

━━━━━━━━━━━━━━━━━━━━━
👤 𝗡𝗮𝗺𝗲: {name}
🔢 𝗠𝗲𝗺𝗯𝗲𝗿 𝗡𝗼: {soThanhVien}
🏘️ 𝗚𝗿𝗼𝘂𝗽: {threadName}
━━━━━━━━━━━━━━━━━━━━━

💌 𝖧𝖺𝗏𝖾 𝖺 𝖶𝗈𝗇𝖽𝖾𝗋𝖿𝗎𝗅 𝖳𝗂𝗆𝖾 𝖶𝗂𝗍𝗁 𝖴𝗌! 🌺
╭─╼╾─╼🌸╾─╼╾───╮
   ┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়✿⃝🪬❈┉┄
╰───╼╾─╼🌸╾─╼╾─╯` : threadData.customJoin;

    msg = msg
      .replace(/\{name}/g, nameArray.join(', '))
      .replace(/\{soThanhVien}/g, memLength.join(', '))
      .replace(/\{threadName}/g, threadName);

    const joinGifPath = path.join(__dirname, "cache", "joinGif");
    const files = readdirSync(joinGifPath).filter(file =>
      [".mp4", ".jpg", ".png", ".jpeg", ".gif", ".mp3"].some(ext => file.endsWith(ext))
    );
    const randomFile = files.length > 0 
      ? createReadStream(path.join(joinGifPath, files[Math.floor(Math.random() * files.length)])) 
      : null;

    return api.sendMessage(
      randomFile ? { body: msg, attachment: randomFile, mentions } : { body: msg, mentions },
      threadID
    );
  } catch (e) {
    console.error(e);
  }
};
    
