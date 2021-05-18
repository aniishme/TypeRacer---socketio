window.onbeforeunload = function () {
  return "Data will be lost if you leave the page, are you sure?";
};

//constants
const socket = io("/multiplayer");
const userList = document.querySelector(".users");
const oppWordsTyped = document.querySelector("#opp_total_words");
const oppWpm = document.querySelector("#opp_wpm");
const oppIncorrect = document.querySelector("#opp_incorrect");
const start = document.querySelector("button");

// Generate Room id and join room
const { roomid } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const username =
  prompt("Enter any username: ") || `user${Math.round(Math.random() * 100)}`;

socket.emit("joinRoom", { roomid, username });

//Socket Emitters
function sendToServer(time) {
  let { totalWords, correctWpm, incorrectWords } = calculateStats(time);
  socket.emit("oppstats", { totalWords, correctWpm, incorrectWords });
}

function startCountDown() {
  socket.emit("countdown");
}
function startTimer() {
  socket.emit("starttimer");
  input.disabled = false;
  input.focus();
  input.select();
}

function restart() {
  socket.emit("restart");
}

//Socket Listners

socket.on("joineduser", (users) => {
  showConnectedUsers(users);
  if (users[0].id === socket.id) {
    if (users.length < 2) {
      timer.innerHTML = "Waiting for another player";
    } else {
      start.classList.add("showstart");
      timer.innerHTML = "Click start to begin";
    }
  } else {
    timer.innerHTML = "Waiting for admin to start";
  }
});
socket.on("userdisconnect", (users) => {
  showConnectedUsers(users);
  if (users[0].id === socket.id) {
    if (users.length < 2) {
      timer.innerHTML = "Waiting for another player";
      start.classList.remove("showstart");
    } else {
      start.classList.add("showstart");
      timer.innerHTML = "Click start to begin";
    }
  } else {
    timer.innerHTML = "Waiting for admin to start";
  }
});
socket.on("roomfull", (destination) => {
  alert("Cannot join, Room is already full");
  window.location.href = destination;
});

function showConnectedUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    const markup = `<p>${user.username}<p>`;
    li.innerHTML = markup;
    userList.appendChild(li);
  });
}

socket.on("countdown", (time) => {
  start.disabled = true;
  start.innerHTML = "Restart";
  if (time === 0) {
    timer.innerHTML = "Go...";
    startTimer();
  } else {
    timer.innerHTML = time;
  }
});

let oppWpms;
socket.on("starttimer", (time) => {
  showStats(time);
  sendToServer(time);
  const { totalWords, correctWpm, incorrectWords } = calculateStats(time);
  console.log("Wpm: ", correctWpm);
  console.log("oppWpm: ", oppWpms);
  if (time === 0) {
    timer.innerHTML = "Over...";
    input.disabled = true;
    start.disabled = false;

    if (correctWpm > oppWpms) {
      timer.innerHTML = "You Won...";
    } else if (oppWpms > correctWpm) {
      timer.innerHTML = "You Lost...";
    } else {
      timer.innerHTML = "Tied...";
    }
  } else {
    timer.innerHTML = time;
  }
});

socket.on("oppstats", (stats) => {
  oppWpms = stats.correctWpm;
  oppWordsTyped.innerHTML = `Words Typed: ${stats.totalWords}`;
  oppWpm.innerHTML = `Wpm: ${stats.correctWpm}`;
  oppIncorrect.innerHTML = `Incorrect Words: ${stats.incorrectWords}`;
});

socket.on("restart", () => {
  typed = [];
  checkCorrectness(input);
  const wordsElem = document.querySelectorAll(".word");
  wordsElem.forEach((word) => {
    if (word.classList.contains("red")) {
      word.classList.remove("red");
    } else if (word.classList.contains("green")) {
      word.classList.remove("green");
    }
  });
  wordsElem[0].scrollIntoView();
  showStats(0);
  oppWordsTyped.innerHTML = `Words Typed: ${0}`;
  oppWpm.innerHTML = `Wpm: ${0}`;
  oppIncorrect.innerHTML = `Incorrect Words: ${0}`;
});

//Event Listners

start.addEventListener("click", () => {
  if (start.innerText === "Start") {
    startCountDown();
  } else if (start.innerText === "Restart") {
    restart();
    startCountDown();
  }
});
