import { useState, useEffect } from "react";
import PokemonCard from "../../components/PokemonCard";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { PokemonsApi } from "../../services/pokemon.service";
import { GameApi } from "../../services/game.service";
import { Button } from "@mui/material";
import Loader from "../../components/generall/loader";
const PokemonList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pokemons, setPokemons] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const refreshPokemons = async (currentPage = 1) => {
    try {
      const response = await PokemonsApi.getAllPokemons(currentPage, pageSize);
      setPokemons(response.data);
      setTotalPages(Math.ceil(response.pagination.total / pageSize));
    } catch (error) {
      console.error("Failed to fetch pokemons:", error);
    }
  };

  useEffect(() => {
    refreshPokemons(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSelect = async (pokemon) => {
    setLoading(true);
    try {
      const response = await GameApi.start(pokemon.id);
      navigate(`/battle/${response.sessionId}`);
    } catch (err) {
      if (err.status === 401) {
        navigate("/login");
      }
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  if (loading) return <Loader />;
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          marginBottom: 2,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4" textAlign="center">
          Choose Your Pokémon
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
          onClick={handleSignOut}
        >
          Sign out
        </Button>
      </Box>
      <Grid container spacing={3}>
        {pokemons.map((pokemon) => (
          <Grid item xs={12} sm={6} md={4} key={pokemon.id}>
            <PokemonCard
              pokemon={pokemon}
              onSelect={() => handleSelect(pokemon)}
            />
          </Grid>
        ))}
      </Grid>
      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        color="primary"
        sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}
      />
    </Box>
  );
};

export default PokemonList;
