const pokemonSchema = require("./pokemon.schema").schema;
const mongoose = require("mongoose");
const gameSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  playerPokemon: {
    type: pokemonSchema,
    required: true,
    ref: "Pokemon",
  },
  computerPokemon: {
    type: pokemonSchema,
    required: true,
    ref: "Pokemon",
  },
  attackerId: {
    type: Number,
    required: true,
  },
  playerHp: {
    type: Number,
    required: true,
  },
  computerHp: {
    type: Number,
    required: true,
  },
  winner: {
    type: String,
  },
  userAddress: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  endedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("GameSession", gameSessionSchema);
