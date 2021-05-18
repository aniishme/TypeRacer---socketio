const socket = io("/multiplayer");
const userList = document.querySelector(".users");
const oppWordsTyped = document.querySelector(".total_words");
const oppWpm = document.querySelector(".wpm");
const oppIncorrect = document.querySelector(".incorrect");

const { roomid } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const username =
  prompt("Enter any username: ") || `user${Math.round(Math.random() * 100)}`;

socket.emit("joinRoom", { roomid, username });

socket.on("joineduser", (users) => {
  showConnectedUsers(users);
});
socket.on("userdisconnect", (users) => {
  showConnectedUsers(users);
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

start.addEventListener("click", startCountDown);

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
}

socket.on("countdown", (time) => {
  start.disabled = true;
  if (time === 0) {
    timer.innerHTML = "Go...";
    startTimer();
  } else {
    timer.innerHTML = time;
  }
});

socket.on("starttimer", (time) => {
  showStats(time);
  sendToServer(time);
  if (time === 0) {
    timer.innerHTML = "Over...";
    input.disabled = true;
  } else {
    timer.innerHTML = time;
  }
});

socket.on("oppstats", (stats) => {
  oppWordsTyped.innerHTML = stats.totalWords;
  oppWpm.innerHTML = stats.correctWpm;
  oppIncorrect.innerHTML = stats.incorrectWords;
});
