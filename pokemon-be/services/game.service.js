const GameSession = require("../models/game.schema");
const pokemonSchema = require("../models/pokemon.schema");

const getAttackerId = (player, computer) => {
  return player.base.Speed > computer.base.Speed ? player.id : computer.id;
};

exports.initializeGame = async (playerPokemonId, userAddress) => {
  const playerPokemon = await pokemonSchema.findOne({ id: playerPokemonId });
  if (!playerPokemon) {
    throw new Error("Player's Pokémon not found");
  }

  const existingSession = await GameSession.findOne({
    userAddress,
    "playerPokemon.id": playerPokemonId,
    endedAt: null,
  });

  if (existingSession) {
    return {
      sessionId: existingSession.sessionId,
      playerPokemon: existingSession.playerPokemon,
      computerPokemon: existingSession.computerPokemon,
    };
  }

  const computerPokemon = await pokemonSchema
    .aggregate([
      { $match: { type: { $not: { $in: playerPokemon.type } } } },
      { $sample: { size: 1 } },
    ])
    .then((results) => results[0]);

  const sessionId = `${Date.now()}-${Math.random()}`;
  const gameSession = new GameSession({
    sessionId,
    playerPokemon: playerPokemon,
    computerPokemon: computerPokemon,
    playerHp: playerPokemon?.base?.HP ?? 100,
    computerHp: computerPokemon?.base?.HP ?? 100,
    attackerId: getAttackerId(playerPokemon, computerPokemon),
    userAddress,
  });
  await gameSession.save();

  return {
    sessionId,
    playerPokemon,
    computerPokemon,
  };
};
exports.getGameSession = async (sessionId) => {
  const gameSession = await GameSession.findOne({ sessionId }).lean();

  if (!gameSession) throw new Error("Game session not found");
  return gameSession;
};

const finishGame = async (sessionId, winner) => {
  const gameSession = await GameSession.findOneAndUpdate(
    { sessionId },
    { winner, endedAt: new Date() },
    { new: true }
  );
  if (!gameSession) throw new Error("Game session not found");
  return gameSession;
};

exports.updateGameSession = async (sessionId, playerHp, computerHp) => {
  const gameSession = await GameSession.findOneAndUpdate(
    { sessionId },
    { playerHp, computerHp },
    { new: true }
  );

  if (!gameSession) throw new Error("Game session not found");
  return gameSession;
};

exports.calculateDamage = (attacker, defender, attackPower) => {
  const level = 2;
  const damage = Math.floor(
    ((((2 * level) / 5 + 2) *
      attackPower *
      (attacker.base.Attack / defender.base.Defense)) /
      50 +
      2) *
      Math.random()
  );

  return damage;
};

exports.switchAttacker = async (sessionId) => {
  const gameSession = await exports.getGameSession(sessionId);
  const attackerId = gameSession.attackerId;
  const { playerPokemon, computerPokemon } = gameSession;

  let newAttackerId;

  if (attackerId === playerPokemon.id) {
    newAttackerId = computerPokemon.id;
  } else if (attackerId === computerPokemon.id) {
    newAttackerId = playerPokemon.id;
  } else {
    throw new Error("Invalid attacker ID");
  }

  await GameSession.findOneAndUpdate(
    { sessionId },
    { $set: { attackerId: newAttackerId } },
    { new: true }
  );

  return newAttackerId;
};

exports.processAttack = async (sessionId) => {
  const gameSession = await exports.getGameSession(sessionId);
  const { playerPokemon, computerPokemon, attackerId, endedAt } = gameSession;

  if (endedAt) {
    throw new Error("Game session has ended");
  }

  const { attacker, defender } = getAttackerDefender(
    attackerId,
    playerPokemon,
    computerPokemon,
    gameSession
  );

  const damage = exports.calculateDamage(
    attacker,
    defender,
    attacker.base.Attack
  );

  if (damage > 0) {
    defender.hp -= damage;
  }

  const { newPlayerHp, newComputerHp } = calculateNewHp(
    defender,
    playerPokemon,
    computerPokemon,
    gameSession
  );

  await checkGameOver(newPlayerHp, newComputerHp, sessionId);
  const { winner, endedAt: endedAtTime } = await exports.updateGameSession(
    sessionId,
    newPlayerHp,
    newComputerHp
  );

  const nextAttackerId = await exports.switchAttacker(sessionId);

  return {
    damage,
    playerPokemon,
    newPlayerHp,
    newComputerHp,
    computerPokemon,
    winner,
    endedAt: endedAtTime,
    attackerId: nextAttackerId,
  };
};

const getAttackerDefender = (
  attackerId,
  playerPokemon,
  computerPokemon,
  gameSession
) => {
  let attacker, defender;

  if (attackerId === playerPokemon.id) {
    attacker = { ...playerPokemon, hp: gameSession.playerHp };
    defender = { ...computerPokemon, hp: gameSession.computerHp };
  } else if (attackerId === computerPokemon.id) {
    attacker = { ...computerPokemon, hp: gameSession.computerHp };
    defender = { ...playerPokemon, hp: gameSession.playerHp };
  } else {
    throw new Error("Invalid attacker ID");
  }

  return { attacker, defender };
};

const calculateNewHp = (
  defender,
  playerPokemon,
  computerPokemon,
  gameSession
) => {
  const newPlayerHp =
    playerPokemon.id === defender.id
      ? Math.max(0, defender.hp)
      : Math.max(0, gameSession.playerHp);

  const newComputerHp =
    computerPokemon.id === defender.id
      ? Math.max(0, defender.hp)
      : Math.max(0, gameSession.computerHp);
  return { newPlayerHp, newComputerHp };
};

const checkGameOver = async (newPlayerHp, newComputerHp, sessionId) => {
  if (newPlayerHp <= 0) {
    await finishGame(sessionId, "🤖");
  }
  if (newComputerHp <= 0) {
    await finishGame(sessionId, "🧑");
  }
};
