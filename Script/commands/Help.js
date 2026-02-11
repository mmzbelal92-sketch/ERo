const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports.config = {
    name: "help",
    version: "7.5.0",
    hasPermssion: 0,
    credits: "BELAL BOTX666",
    description: "সহজ এবং সাধারণ ইংরেজি ফন্টে হেল্প লিস্ট",
    commandCategory: "system",
    usages: "[Command Name]",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    const { commands } = global.client;
    const { threadID, messageID } = event;
    const prefix = global.config.PREFIX;
    
    const helpImages = [
        "https://i.imgur.com/6b6DGcW.jpeg",
        "https://i.imgur.com/FQQq8WH.jpeg"
    ];

    const randomUrl = helpImages[Math.floor(Math.random() * helpImages.length)];
    const cachePath = path.join(__dirname, "cache", "help_clean.jpg");

    if (!fs.existsSync(path.join(__dirname, "cache"))) fs.mkdirSync(path.join(__dirname, "cache"));

    // ১. নির্দিষ্ট কমান্ডের ডিটেইলস
    if (args[0] && commands.has(args[0].toLowerCase())) {
        const cmd = commands.get(args[0].toLowerCase()).config;
        const detailMsg = `[ Command Info ]\n--------------------------\nName: ${cmd.name}\nDescription: ${cmd.description}\nUsage: ${cmd.usages}\nCategory: ${cmd.commandCategory}\nCooldown: ${cmd.cooldowns}s\nPermission: ${cmd.hasPermssion == 0 ? "User" : "Admin"}\n--------------------------\nOwner: চাঁদের পাহাড় ✡️`;

        const imgStream = request(encodeURI(randomUrl)).pipe(fs.createWriteStream(cachePath));
        imgStream.on("close", () => {
            api.sendMessage({ body: detailMsg, attachment: fs.createReadStream(cachePath) }, threadID, () => {
                if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
            }, messageID);
        });
        return;
    }

    // ২. সাধারণ হেল্প লিস্ট ডিজাইন
    const categories = {};
    for (let [name, value] of commands) {
        const cat = value.config.commandCategory || "General";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(name);
    }

    let helpMsg = `--- BELAL BOT X666 ---\n--------------------------\n`;

    for (const category in categories) {
        helpMsg += `[ ${category.toUpperCase()} ]\n`;
        helpMsg += `> ${categories[category].sort().join(", ")}\n\n`;
    }

    helpMsg += `--------------------------\n`;
    helpMsg += `Owner: চাঁদের পাহাড় ✡️\n`;
    helpMsg += `Total: ${commands.size} Commands\n`;
    helpMsg += `Usage: ${prefix}help [Command Name]`;

    const imgStream = request(encodeURI(randomUrl)).pipe(fs.createWriteStream(cachePath));
    imgStream.on("close", () => {
        api.sendMessage({ 
            body: helpMsg, 
            attachment: fs.createReadStream(cachePath) 
        }, threadID, () => {
            if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
        }, messageID);
    });
};
