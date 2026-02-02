module.exports.config = {
  'name': "romjan",
  'version': "1.0.0",
  'hasPermssion': 0x0,
  'credits': "BELAL BOTX666",
  'description': "Ramadan asar time ck",
  'commandCategory': '0',
  'cooldowns': 0x5
};
module.exports.run = function ({
  event: _0x2a784a,
  api: _0x5612d8
}) {
  const _0x3be651 = Date.parse("March 1, 2025 00:00:00") - Date.parse(new Date());
  const _0x3a4dbd = Math.floor(_0x3be651 / 1000 % 60);
  const _0x39214c = Math.floor(_0x3be651 / 1000 / 60 % 60);
  const _0x2776a9 = Math.floor(_0x3be651 / 3600000 % 24);
  const _0x4f0031 = Math.floor(_0x3be651 / 86400000);
  return _0x5612d8.sendMessage("অ্ঁগ্ঁরি্ঁম্ঁ র্ঁম্ঁজা্ঁন্ঁ মো্ঁবা্ঁর্ঁক্ঁ \n\n❣︎❣︎❣︎❣︎❣︎❣︎❣︎❣︎❣︎❣︎❣︎❣︎❣︎❣︎❣︎❣︎❣︎❣︎❣︎\n\nخوف خدا دیکھنا ہے تو مسلمان کا دیکھ جو روزے میں وضو کا پانی منہ میں لیکر بھی پیتا نہیں ہے\n\n❣︎❣︎❣︎❣︎❣︎❣︎❣︎❣︎❣︎❣︎❣︎❣︎❣︎❣︎❣︎❣︎❣︎❣︎❣︎\n\nরমজান আসতে সময় বাকি " + _0x4f0031 + " দিন " + _0x2776a9 + " ঘন্টা " + _0x39214c + " মিনিট " + _0x3a4dbd + " সেকেন্ড মাএ", _0x2a784a.threadID, _0x2a784a.messageID);
};
