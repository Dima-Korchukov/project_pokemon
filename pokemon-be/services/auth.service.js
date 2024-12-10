const Player = require("../models/player.schema");
const jwt = require("jsonwebtoken");
const { Web3 } = require("web3");
const web3 = new Web3();

exports.generateNonce = async (address) => {
  const player = await Player.findOneAndUpdate(
    { address },
    { nonce: Math.floor(Math.random() * 10000) },
    { upsert: true, new: true }
  );
  return player.nonce;
};

exports.verifySignature = async (address, signature) => {
  const player = await Player.findOne({ address });
  if (!player) throw new Error("Player not found");

  const message = `Nonce: ${player.nonce}`;
  const signer = web3.eth.accounts.recover(message, signature);

  if (signer.toLowerCase() !== address.toLowerCase()) {
    throw new Error("Invalid signature");
  }

  const token = jwt.sign({ address }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  player.nonce = Math.floor(Math.random() * 10000);
  await player.save();

  return token;
};
