const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/classic/", (req, res) => {
  res.sendFile(__dirname + "/typing.html");
});
app.get("/multiplayer/", (req, res) => {
  res.sendFile(__dirname + "/multityping.html");
});

const nsp = io.of(`/classic`);
nsp.on("connection", require("./controllers/singlePlayerHandler"));

require("./controllers/multiPlayerHandler.js")(io);

server.listen(3000, () => {
  console.log("Server started at port 3000");
});
