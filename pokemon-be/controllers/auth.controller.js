const express = require("express");
const router = express.Router();
const authService = require("../services/auth.service");

router.post("/request-nonce", async (req, res) => {
  try {
    const { address } = req.body;
    const nonce = await authService.generateNonce(address);
    res.json({ nonce });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/verify-signature", async (req, res) => {
  try {
    const { address, signature } = req.body;
    const token = await authService.verifySignature(address, signature);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;
