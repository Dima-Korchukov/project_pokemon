import { startGameUrl } from "../utils/network";
import authorizedInstance from "../utils/auth.req";
import { socketService } from "./socket.service";

export class GameApi {
  static async start(playerPokemonId) {
    const response = await authorizedInstance.post(startGameUrl, {
      playerPokemonId,
    });

    return response.data;
  }

  static connectToBattle(sessionId) {
    socketService.connect(sessionId);
  }

  static async attack(sessionId, attackData) {
    socketService.emit("playerAttack", { sessionId, attackData });
  }
}
