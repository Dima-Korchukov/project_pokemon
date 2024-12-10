const express = require("express");
const router = express.Router();
const gameService = require("../services/game.service");

router.post("/start", async (req, res) => {
  try {
    const { playerPokemonId } = req.body;
    const userAddress = req.user.address;
    const gameData = await gameService.initializeGame(
      playerPokemonId,
      userAddress
    );
    res.json(gameData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
