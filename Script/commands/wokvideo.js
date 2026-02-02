/** Don't change credits bro i will fix¯\_(ツ)_/¯ **/
module.exports.config = {
 name: "wok",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "BELAL BOTX666",
 description: "SAD VEDIO",
 commandCategory: "video",
 usages: "sad vedio",
 cooldowns: 5,
 dependencies: {
 "request":"",
 "fs-extra":"",
 "axios":""
 }
};

module.exports.run = async({api,event,args,client,Users,Threads,__GLOBAL,Currencies}) => {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
 var hi = ["Wok] \n┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়✿⃝🪬❈┉┄"];
 var know = hi[Math.floor(Math.random() * hi.length)];
 var link = [ 
"https://i.imgur.com/qMRb8gV.mp4",
  "https://i.imgur.com/NyP2t3P.mp4",
  "https://i.imgur.com/T8VYQPf.mp4",
  "https://i.imgur.com/IxvfFMU.mp4",
  "https://i.imgur.com/Qzn0SkJ.mp4",
  "https://i.imgur.com/scsmUOU.mp4",
  "https://i.imgur.com/2VYKap2.mp4",
  "https://i.imgur.com/9txmYB9.mp4",
  "https://i.imgur.com/7Du8tpN.mp4",
  "https://i.imgur.com/zDYJppV.mp4",
  "https://i.imgur.com/YXvcTnI.mp4",
  "https://i.imgur.com/vmyKKEP.mp4",
  "https://i.imgur.com/J3p5uso.mp4",
  "https://i.imgur.com/fAlm0xd.mp4",
  "https://i.imgur.com/jwY1tI4.mp4",
];
 var callback = () => api.sendMessage({body:`「 ${know} 」`,attachment: fs.createReadStream(__dirname + "/cache/15.mp4")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/15.mp4")); 
 return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/15.mp4")).on("close",() => callback());
 };
