const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "faceswap",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "Belal x Gemini",
    description: "দুইটি ছবির মধ্যে মুখ পরিবর্তন (Face Swap) করুন",
    commandCategory: "image",
    usages: "[২টি ছবি একসাথে পাঠান বা রিপ্লাই দিন]",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    let sourceUrl, targetUrl;

    // ১. মিরাই বটের জন্য অ্যাটাচমেন্ট চেক লজিক
    if (event.type === "message_reply" && event.messageReply.attachments.length >= 2) {
        sourceUrl = event.messageReply.attachments[0].url;
        targetUrl = event.messageReply.attachments[1].url;
    } else if (event.attachments && event.attachments.length >= 2) {
        sourceUrl = event.attachments[0].url;
        targetUrl = event.attachments[1].url;
    } else {
        return api.sendMessage("⚠️ বেলাল ভাই, ২ টি ছবি একসাথে দিন অথবা ২ টি ছবি আছে এমন মেসেজে রিপ্লাই দিন।\n\n(১ম ছবি: যার মুখ নিবেন, ২য় ছবি: যাতে মুখ বসাবেন)", threadID, messageID);
    }

    api.sendMessage("⏳ 𝗙𝗮𝗰𝗲 𝘀𝘄𝗮𝗽𝗽𝗶𝗻𝗴 𝗶𝗻 𝗽𝗿𝗼𝗴𝗿𝗲𝘀𝘀... \nআপনার জন্য নিখুঁতভাবে মুখ পরিবর্তন করা হচ্ছে, একটু অপেক্ষা করুন।", threadID, messageID);

    try {
        const apiKey = "hello_world";
        const encodedSource = encodeURIComponent(sourceUrl);
        const encodedTarget = encodeURIComponent(targetUrl);
        
        const apiUrl = `https://mahbub-ullash.cyberbot.top/api/faceswap?api_key=${apiKey}&sourceUrl=${encodedSource}&targetUrl=${encodedTarget}`;

        const tempPath = path.join(__dirname, "cache", `faceswap_${Date.now()}.png`);
        
        // ছবি ডাউনলোড এবং সেভ করার প্রসেস
        const response = await axios({
            method: 'get',
            url: apiUrl,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(tempPath);
        response.data.pipe(writer);

        writer.on('finish', () => {
            return api.sendMessage({
                body: "✨ 𝗥𝗲𝘀𝘂𝗹𝘁: 𝗙𝗮𝗰𝗲 𝗦𝘄𝗮𝗽 𝗗𝗼𝗻𝗲!\nআপনার রাজকীয় এডিটটি তৈরি হয়ে গেছে।\n──────────────────\n✡️⃝🅰🅳🅼🅸🇳─͢͢চৃাঁদেৃঁরৃঁ পাৃঁহা্ঁড়ৃঁ✡️",
                attachment: fs.createReadStream(tempPath)
            }, threadID, () => {
                if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
            }, messageID);
        });

        writer.on('error', (err) => {
            console.error(err);
            api.sendMessage("❌ ইমেজ প্রসেস করার সময় একটি ত্রুটি ঘটেছে।", threadID, messageID);
        });

    } catch (error) {
        console.error(error);
        api.sendMessage("❌ এপিআই সার্ভারে সমস্যা অথবা ছবিতে কোনো মুখ খুঁজে পাওয়া যায়নি।", threadID, messageID);
    }
};
        
