const Timer = require("tiny-timer");

const onConnection = (socket) => {
  socket.on("starttimer", () => {
    const timer = new Timer({ interval: 1000, stopwatch: false });
    timer.start(60000);
    timer.on("tick", (ms) => {
      socket.emit("starttimer", Math.round(ms / 1000));
    });
  });

  socket.on("userdata", (data) => {
    socket.broadcast.emit(data);
  });
};

module.exports = onConnection;
