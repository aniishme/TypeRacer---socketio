const Timer = require("tiny-timer");

let joinedusers = [];

function connectToMultiplayer(io) {
  const nspmp = io.of("/multiplayer");
  nspmp.on("connection", (socket) => {
    socket.on("joinRoom", ({ roomid, username }) => {
      if (usersOnRoom(roomid).length < 2) {
        socket.join(roomid);
        joinUser(roomid, username, socket.id);
        nspmp.to(roomid).emit("joineduser", usersOnRoom(roomid));
      } else {
        nspmp.to(socket.id).emit("roomfull", "/");
        socket.disconnect();
      }
      socket.on("countdown", () => {
        const timer = new Timer({ interval: 1000, stopwatch: false });
        timer.start(7000);
        timer.on("tick", (ms) => {
          nspmp.to(roomid).emit("countdown", Math.round(ms / 1000));
        });
      });
      socket.on("starttimer", () => {
        const timer = new Timer({ interval: 1000, stopwatch: false });
        timer.start(60000);
        timer.on("tick", (ms) => {
          nspmp.to(roomid).emit("starttimer", Math.round(ms / 1000));
        });
      });
      socket.on("oppstats", (stats) => {
        socket.to(roomid).emit("oppstats", stats);
      });
      socket.on("restart", () => {
        nspmp.to(roomid).emit("restart");
      });

      socket.on("disconnecting", () => {
        disconnectUser(socket.id);
        nspmp.to(roomid).emit("userdisconnect", usersOnRoom(roomid));
      });
    });
  });
}

function joinUser(roomid, username, id) {
  let user = {
    roomid,
    username,
    id,
  };
  joinedusers.push(user);
}

function disconnectUser(id) {
  const dcUser = joinedusers.filter((user) => user.id === id);
  const index = joinedusers.indexOf(dcUser);
  joinedusers.splice(index, 1);
}

function usersOnRoom(roomid) {
  const roomusers = joinedusers.filter((user) => user.roomid === roomid);
  return roomusers;
}

module.exports = connectToMultiplayer;
