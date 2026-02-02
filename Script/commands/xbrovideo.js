/** Don't change credits bro i will fix¯\_(ツ)_/¯ **/
module.exports.config = {
 name: "xbro",
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
 var hi = ["X BRO] \n┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়✿⃝🪬❈┉┄"];
 var know = hi[Math.floor(Math.random() * hi.length)];
 var link = [ 
 "https://i.imgur.com/giKJlOB.mp4",
  "https://i.imgur.com/GJRpFP7.mp4",
  "https://i.imgur.com/IvXcCMx.mp4",
  "https://i.imgur.com/LYeHtTY.mp4",
  "https://i.imgur.com/DORQ8JG.mp4",
  "https://i.imgur.com/GxSgHOA.mp4",
  "https://i.imgur.com/ok6OSr1.mp4",
  "https://i.imgur.com/hJZ8cFG.mp4",
  "https://i.imgur.com/J8UzgFX.mp4",
  "https://i.imgur.com/Y96D5C6.mp4",
  "https://i.imgur.com/nmJ2HWk.mp4",
  "https://i.imgur.com/dkul1H4.mp4",
  "https://i.imgur.com/HrDQxwz.mp4",
  "https://i.imgur.com/KEQJKhj.mp4",
  "https://i.imgur.com/jAlNviD.mp4",
  "https://i.imgur.com/zsk9wFY.mp4",
  "https://i.imgur.com/wWKFTYQ.mp4",
  "https://i.imgur.com/4lPTQxb.mp4",
  "https://i.imgur.com/P6vgcRQ.mp4",
  "https://i.imgur.com/Qb1kDre.mp4",
  "https://i.imgur.com/rgYTOy8.mp4"
];
 var callback = () => api.sendMessage({body:`「 ${know} 」`,attachment: fs.createReadStream(__dirname + "/cache/15.mp4")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/15.mp4")); 
 return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/15.mp4")).on("close",() => callback());
 };
