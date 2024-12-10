import { useState, useEffect } from "react";
import { GameApi } from "../services/game.service";
import { socketService } from "../services/socket.service";

const useBattle = (id, showInfoToast, showToast, navigate) => {
  const [battleState, setBattleState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [battleLogs, setBattleLogs] = useState([]);

  const updateBattleState = (state) => {
    setBattleState(state);
  };

  useEffect(() => {
    GameApi.connectToBattle(id);
    socketService.on("gameState", updateBattleState);
    socketService.on("attackResult", (result) => {
      setBattleState((prevState) => ({
        ...prevState,
        playerHp: result.newPlayerHp,
        computerHp: result.newComputerHp,
        attackerId: result.attackerId,
      }));

      if (result.endedAt) {
        showInfoToast(`Game ended. Winner: ${result.winner}`);
        setTimeout(() => navigate("/pokemon-list"), 5000);
      } else {
        const logMessage = `${
          result.attackerId === result.computerPokemon.id ? "🤖" : "🧑"
        } received ${result.damage} damage`;
        setBattleLogs((prevLogs) => [...prevLogs, logMessage]);
        showToast(logMessage);
        setLoading(false);
      }
    });

    return () => {
      socketService.off("gameState", updateBattleState);
      socketService.off("attackResult");
    };
  }, []);

  return { battleState, setBattleState, loading, setLoading, battleLogs };
};

export default useBattle;
