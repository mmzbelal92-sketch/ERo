const fs = require("fs-extra");
const { loadImage, createCanvas } = require("canvas");
const path = require("path");

module.exports.config = {
  name: "ttt",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "EDEN (Mirai Version)",
  description: "এআই বা বন্ধুর সাথে টিক ট্যাক টো খেলুন।",
  commandCategory: "game",
  usages: "x/o | --mode 2 @mention | delete",
  cooldowns: 5,
};

const AIMove = { current: null };

// --- গেম লজিক ফাংশনসমূহ ---
function startBoard(isX) {
  return {
    board: Array.from({ length: 3 }, () => Array(3).fill(0)),
    isX,
    gameOn: true
  };
}

async function displayBoard(data) {
  const cachePath = path.join(__dirname, "cache", `ttt-${Date.now()}.png`);
  if (!fs.existsSync(path.join(__dirname, "cache"))) fs.mkdirpSync(path.join(__dirname, "cache"));
  
  const canvas = createCanvas(1200, 1200);
  const ctx = canvas.getContext("2d");

  const bg = await loadImage("https://i.postimg.cc/nhDWmj1h/background.png");
  const O = await loadImage("https://i.postimg.cc/rFP6xLXQ/O.png");
  const X = await loadImage("https://i.postimg.cc/HLbFqcJh/X.png");

  ctx.drawImage(bg, 0, 0, 1200, 1200);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const piece = data.board[i][j];
      const x = 54 + 366 * j;
      const y = 54 + 366 * i;
      if (piece === 1) ctx.drawImage(data.isX ? O : X, x, y, 360, 360);
      if (piece === 2) ctx.drawImage(data.isX ? X : O, x, y, 360, 360);
    }
  }

  fs.writeFileSync(cachePath, canvas.toBuffer("image/png"));
  return cachePath;
}

function getAvailable(data) {
  const moves = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (!data.board[i][j]) moves.push([i, j]);
  return moves;
}

function checkWin(board, player) {
  for (let i = 0; i < 3; i++) {
    if (board[i].every(v => v === player)) return true;
    if (board.every(row => row[i] === player)) return true;
  }
  if ([0, 1, 2].every(i => board[i][i] === player)) return true;
  if ([0, 1, 2].every(i => board[i][2 - i] === player)) return true;
  return false;
}

function solveAIMove(depth, turn, data) {
  if (checkWin(data.board, 1)) return 1;
  if (checkWin(data.board, 2)) return -1;
  const moves = getAvailable(data);
  if (!moves.length) return 0;

  let max = -Infinity, min = Infinity;
  for (const move of moves) {
    data.board[move[0]][move[1]] = turn;
    const score = solveAIMove(depth + 1, turn === 1 ? 2 : 1, data);
    if (turn === 1) {
      if (score > max) {
        max = score;
        if (depth === 0) AIMove.current = move;
      }
    } else {
      min = Math.min(min, score);
    }
    data.board[move[0]][move[1]] = 0;
  }
  return turn === 1 ? max : min;
}

// --- মিরাই কমান্ড মডিউল ---
module.exports.run = async function ({ api, event, args, Users }) {
  const { threadID, senderID, mentions, messageID } = event;
  global.client.ttt ??= new Map();

  if (args[0] === "delete") {
    global.client.ttt.delete(threadID);
    return api.sendMessage("গেম ডিলিট করা হয়েছে।", threadID, messageID);
  }

  // Multiplayer Mode
  if (args[0] === "--mode" && args[1] === "2") {
    const mentionID = Object.keys(mentions)[0];
    if (!mentionID || mentionID === senderID) return api.sendMessage("কাউকে মেনশন করুন!", threadID, messageID);

    const data = {
      board: Array.from({ length: 3 }, () => Array(3).fill(0)),
      player1: senderID,
      player2: mentionID,
      currentTurn: senderID,
      multi: true,
      gameOn: true
    };

    global.client.ttt.set(threadID, data);
    const n1 = await Users.getNameUser(senderID);
    const n2 = await Users.getNameUser(mentionID);

    return api.sendMessage(`${n1} চ্যালেঞ্জ করেছে ${n2} কে!\n${n1} এর চাল। ১-৯ এর মধ্যে একটি সংখ্যা দিন।`, threadID, (err, info) => {
      global.client.handleReply.push({ name: this.config.name, messageID: info.messageID, author: senderID });
    }, messageID);
  }

  // AI Mode
  const isX = args[0] === "x";
  const data = startBoard(isX);
  if (!isX) {
    const move = [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)];
    data.board[move[0]][move[1]] = 1;
  }

  global.client.ttt.set(threadID, data);
  const imgPath = await displayBoard(data);
  return api.sendMessage({ body: "এআই এর বিরুদ্ধে গেম শুরু! ১-৯ লিখুন।", attachment: fs.createReadStream(imgPath) }, threadID, (err, info) => {
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    global.client.handleReply.push({ name: this.config.name, messageID: info.messageID, author: senderID });
  }, messageID);
};

module.exports.handleReply = async function ({ api, event, handleReply, Users }) {
  const { threadID, senderID, body, messageID } = event;
  const data = global.client.ttt.get(threadID);
  if (!data || !data.gameOn) return;

  if (data.multi && senderID !== data.currentTurn) return api.sendMessage("আপনার চাল নয়!", threadID, messageID);
  if (!data.multi && senderID !== handleReply.author) return;

  const num = parseInt(body);
  if (isNaN(num) || num < 1 || num > 9) return api.sendMessage("১-৯ এর মধ্যে ঘর বেছে নিন!", threadID, messageID);

  const row = Math.floor((num - 1) / 3);
  const col = (num - 1) % 3;
  if (data.board[row][col] !== 0) return api.sendMessage("এই ঘরটি আগেই নেওয়া হয়েছে!", threadID, messageID);

  let result = "";
  if (data.multi) {
    data.board[row][col] = senderID === data.player1 ? 1 : 2;
    if (checkWin(data.board, 1)) result = `${await Users.getNameUser(data.player1)} জিতেছে!`;
    else if (checkWin(data.board, 2)) result = `${await Users.getNameUser(data.player2)} জিতেছে!`;
    else if (getAvailable(data).length === 0) result = "ড্র হয়েছে!";
    else data.currentTurn = data.currentTurn === data.player1 ? data.player2 : data.player1;
  } else {
    data.board[row][col] = 2;
    if (checkWin(data.board, 2)) result = "আপনি জিতেছেন!";
    else if (getAvailable(data).length === 0) result = "ড্র হয়েছে!";
    else {
      solveAIMove(0, 1, data);
      if (AIMove.current) data.board[AIMove.current[0]][AIMove.current[1]] = 1;
      if (checkWin(data.board, 1)) result = "এআই জিতেছে!";
    }
  }

  const imgPath = await displayBoard(data);
  api.sendMessage({ body: result || "পরের চাল দিন!", attachment: fs.createReadStream(imgPath) }, threadID, (err, info) => {
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    if (!result) global.client.handleReply.push({ name: this.config.name, messageID: info.messageID, author: handleReply.author });
    else global.client.ttt.delete(threadID);
  }, messageID);
};
