const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const authRoutes = require("./controllers/auth.controller");
const gameRoutes = require("./controllers/game.controller");
const pokemonRoutes = require("./controllers/pokemon.controller");
const authMiddleware = require("./middleware/auth.middleware");

require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());

connectDB();

app.use("/auth", authRoutes);
app.use("/game", authMiddleware, gameRoutes);
app.use("/pokemon", pokemonRoutes);

module.exports = app;
