const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  nonce: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Player", playerSchema);