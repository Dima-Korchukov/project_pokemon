import { GameApi } from "../../services/game.service";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { useNavigate, useParams } from "react-router-dom";
import useCustomToast from "../../hooks/useToaster";
import { Counter } from "../../components/generall/animatedCounter";
import useBattle from "../../hooks/useBattle";
import { useCallback, useEffect } from "react";
import Loader from "../../components/generall/loader";
import PokemonCard from "../../components/PokemonCard";
import BattleLogs from "../../components/BattleLogs";

const BattleScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast, showInfoToast, showErrorToast } = useCustomToast();
  const { battleState, loading, setLoading, battleLogs } = useBattle(
    id,
    showInfoToast,
    showToast,

    navigate
  );

  const isPlayerTurn =
    battleState?.attackerId === battleState?.playerPokemon.id;

  const handleAttack = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      await GameApi.attack(id, {
        attackerId: battleState.attackerId,
        Attack: isPlayerTurn
          ? battleState.playerPokemon.Attack
          : battleState.computerPokemon.Attack,
      });
    } catch (error) {
      showErrorToast(`Attack failed: ${error}`);
      setLoading(false);
    }
  }, [loading, id, battleState, isPlayerTurn]);

  useEffect(() => {
    if (!battleState?.attackerId || battleState?.endedAt) return;

    if (battleState.attackerId !== battleState.playerPokemon.id) {
      const autoAttackTimeout = setTimeout(() => handleAttack(), 1000);
      return () => clearTimeout(autoAttackTimeout);
    }
  }, [battleState]);

  if (!battleState) return <Loader />;
  return (
    <Box>
      <Typography align="center" variant="h4">
        Battle
      </Typography>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h6" align="center">
            Player
          </Typography>
          <PokemonCard pokemon={battleState.playerPokemon} />

          <Counter score={battleState.playerHp} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" align="center">
            Computer
          </Typography>

          <PokemonCard pokemon={battleState.computerPokemon} />

          <Counter score={battleState.computerHp} />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Button
          onClick={handleAttack}
          variant="contained"
          color="primary"
          sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
          disabled={!isPlayerTurn || loading}
        >
          Attack
        </Button>
      </Box>
      <BattleLogs logs={battleLogs} />
    </Box>
  );
};

export default BattleScreen;
