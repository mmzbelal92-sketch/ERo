const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports.config = {
    name: "help",
    version: "6.0.0",
    hasPermssion: 0,
    credits: "BELAL BOTX666",
    description: "ক্যাটাগরি অনুযায়ী ধাপে ধাপে চোখ ধাঁধানো হেল্প লিস্ট",
    commandCategory: "system",
    usages: "[command name/page number]",
    cooldowns: 5,
    envConfig: {
        autoUnsend: true,
        delayUnsend: 30
    }
};

module.exports.languages = {
    "en": {
        "moduleInfo": `┏━━━━━━━━━━━━━━━━━━━┓\n   ✨ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐃𝐄𝐓𝐀𝐈𝐋𝐒 ✨\n┗━━━━━━━━━━━━━━━━━━━┛\n\n🔹 Name: %1\n🔹 Usage: %2\n🔹 Desc: %3\n🔹 Permission: %4\n🔹 Credit: %5\n🔹 Category: %6\n🔹 Cooldown: %7s\n\n━━━━━━━━━━━━━━━━━━━━\n⚙️ Prefix: %8\n🤖 Bot: %9\n👑 Owner: ┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়✿⃝🪬❈┉┄\n━━━━━━━━━━━━━━━━━━━━`
    }
};

// আপনার দেওয়া স্পেশাল ইমেজ লিঙ্কসমূহ
const helpImages = [
    "https://i.imgur.com/6b6DGcW.jpeg",
    "https://i.imgur.com/FQQq8WH.jpeg",
    "https://i.imgur.com/CY5sgsk.jpeg"
];

function downloadImages(callback) {
    const randomUrl = helpImages[Math.floor(Math.random() * helpImages.length)];
    const filePath = path.join(__dirname, "cache", "help_premium.jpg");
    
    request(randomUrl)
        .pipe(fs.createWriteStream(filePath))
        .on("close", () => callback([filePath]));
}

module.exports.run = function ({ api, event, args, getText }) {
    const { commands } = global.client;
    const { threadID, messageID } = event;
    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};  
    const prefix = threadSetting.PREFIX || global.config.PREFIX;
    const botName = "𝐁𝐄𝐋𝐀𝐋 𝐁𝐎𝐓 𝐗𝟔𝟔𝟔 ✡️";
    const sig = "┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়✿⃝🪬❈┉┄";

    // ১. নির্দিষ্ট কমান্ডের ডিটেইলস দেখলে
    if (args[0] && commands.has(args[0].toLowerCase())) {  
        const command = commands.get(args[0].toLowerCase());  
        const detailText = getText("moduleInfo",  
            command.config.name.toUpperCase(),  
            command.config.usages || "No usages",  
            command.config.description || "No description",  
            command.config.hasPermssion == 0 ? "User" : "Admin",  
            command.config.credits || "Unknown",  
            command.config.commandCategory || "General",  
            command.config.cooldowns || 0,  
            prefix,  
            botName
        );  

        downloadImages(files => {  
            api.sendMessage({ body: detailText, attachment: files.map(f => fs.createReadStream(f)) }, threadID, () => {  
                files.forEach(f => fs.unlinkSync(f));  
            }, messageID);  
        });  
        return;  
    }  

    // ২. ক্যাটাগরি অনুযায়ী ধাপে ধাপে সব কমান্ড দেখলে
    const categories = {};
    for (let [name, value] of commands) {
        const cat = value.config.commandCategory || "General";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(name);
    }

    let listMsg = `┏━━━━━━━━━━━━━━━━━━━┓\n   🔱  𝐁𝐄𝐋𝐀𝐋 𝐁𝐎𝐓 𝐗𝟔𝟔𝟔  🔱\n┗━━━━━━━━━━━━━━━━━━━┛\n\n`;

    for (const category in categories) {
        listMsg += `✨ ━━『 ${category.toUpperCase()} 』━━ ✨\n`;
        listMsg += `  ❯ ${categories[category].join(", ")}\n\n`;
    }

    listMsg += `┏━━━━━━━━━━━━━━━━━━━━━┓\n`;
    listMsg += `  👤 𝐎𝐰𝐧𝐞𝐫 : ${sig}\n`;
    listMsg += `  📦 𝐓𝐨𝐭𝐚𝐥 : ${commands.size} Commands\n`;
    listMsg += `  🛡️ 𝐒𝐭𝐚𝐭𝐮𝐬 : Premium Master Mode\n`;
    listMsg += `┗━━━━━━━━━━━━━━━━━━━━━┛`;

    downloadImages(files => {  
        api.sendMessage({ 
            body: listMsg, 
            attachment: files.map(f => fs.createReadStream(f)) 
        }, threadID, () => {  
            files.forEach(f => fs.unlinkSync(f));  
        }, messageID);  
    });  
};
    
