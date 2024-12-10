const Pokemon = require("../models/pokemon.schema");

exports.getAllTypes = async () => {
  const types = await Pokemon.distinct("type");
  return types;
};

exports.getAllPokemon = async (page = 1, pageSize = 10) => {
  const start = (page - 1) * pageSize;

  const pokemonList = await Pokemon.find().skip(start).limit(pageSize);

  const total = await Pokemon.countDocuments();

  const pagination = {
    page,
    pageSize,
    total,
  };
  return {
    data: pokemonList,
    pagination,
  };
};

exports.getPokemonCount = async () => {
  const count = await Pokemon.countDocuments();
  return count;
};
