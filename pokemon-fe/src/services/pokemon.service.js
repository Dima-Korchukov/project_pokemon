import axios from "axios";
import { getAllPokemonUrl } from "../utils/network";

export class PokemonsApi {
  static async getAllPokemons(page = 1, size = 10) {
    const response = await axios.get(getAllPokemonUrl(page, size));
    return response.data;
  }
}
