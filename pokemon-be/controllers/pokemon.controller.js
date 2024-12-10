const express = require("express");
const router = express.Router();
const pokemonService = require("../services/pokemon.service");

router.get("/all", async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;

    const games = await pokemonService.getAllPokemon(page, pageSize);

    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/types", async (req, res) => {
  try {
    const types = await pokemonService.getAllTypes();
    res.json(types);
  } catch (err) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
