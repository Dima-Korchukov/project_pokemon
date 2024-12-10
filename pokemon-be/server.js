const gameService = require("./services/game.service");
const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: "*",
});

io.on("connection", (socket) => {
  console.log("User connected");

  const token = socket.handshake.auth.token;
  const sessionId = socket.handshake.auth.sessionId;
  if (!token || !sessionId) {
    socket.emit("error", { message: "Unauthorized" });
    socket.disconnect();
    return;
  }

  gameService
    .getGameSession(sessionId)
    .then((session) => {
      socket.join(sessionId);
      socket.emit("gameState", session);
    })
    .catch((err) => {
      socket.emit("error", { message: err.message });
      socket.disconnect();
    });

  socket.on("playerAttack", async (data) => {
    try {
      const { sessionId, attackData } = data;
      const result = await gameService.processAttack(sessionId, attackData);
      io.to(sessionId).emit("attackResult", result);
    } catch (err) {
      socket.emit("error", { message: err.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
server.listen(PORT, () => {
  const fullUrl = `http://localhost:${PORT}`;
  console.log(`Server running at ${fullUrl}`);
});
