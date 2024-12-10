exports.calculateDamage = (attacker, defender, power) => {
  const randomFactor = Math.random();
  if (randomFactor < 0.1) return 0;

  return (
    ((((2 * 50) / 5 + 2) *
      power *
      (attacker.stats.attack / defender.stats.defense)) /
      50 +
      2) *
    randomFactor
  );
};
