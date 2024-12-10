const Pokemon = require("../models/pokemon.schema");
const { pokedex } = require("../static/pokedex.js");
async function seedDatabase() {
  try {
    console.log("Seeding database...");
    const recordCount = await Pokemon.countDocuments();
    if (recordCount > 0) {
      console.log("Database already seeded. Skipping...");
      return;
    }

    await Pokemon.insertMany(pokedex);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

exports.seedDatabase = seedDatabase;
