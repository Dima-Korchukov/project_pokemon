import PropTypes from "prop-types";

import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Chip,
} from "@mui/material";

const PokemonCard = ({ pokemon, onSelect }) => (
  <Card
    sx={{
      borderRadius: 4,
      cursor: "pointer",
    }}
  >
    <CardMedia
      component="img"
      sx={{ objectFit: "contain", backgroundColor: "#f4f6f8", p: 2 }}
      height="180"
      image={pokemon.image.hires}
      alt={pokemon.name.english}
    />
    <CardContent sx={{ textAlign: "center" }}>
      <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
        {pokemon.name.english}
      </Typography>
      <Box sx={{ mt: 1, mb: 1 }}>
        {pokemon.type.map((type) => (
          <Chip
            key={type}
            label={type}
            color="primary"
            variant="outlined"
            sx={{ mr: 0.5 }}
          />
        ))}
      </Box>
      <Typography variant="body2" color="text.secondary">
        <strong>HP:</strong> {pokemon.base.HP}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        <strong>Attack:</strong> {pokemon.base.Attack}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        <strong>Defense:</strong> {pokemon.base.Defense}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        <strong>Speed:</strong> {pokemon.base.Speed}
      </Typography>
    </CardContent>
    {onSelect && (
      <CardActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={onSelect}
          variant="contained"
          color="primary"
          sx={{ width: "90%", borderRadius: 3 }}
        >
          Start
        </Button>
      </CardActions>
    )}
  </Card>
);

PokemonCard.propTypes = {
  pokemon: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.shape({
      english: PropTypes.string.isRequired,
      japanese: PropTypes.string.isRequired,
      chinese: PropTypes.string.isRequired,
      french: PropTypes.string.isRequired,
    }).isRequired,
    type: PropTypes.arrayOf(PropTypes.string).isRequired,
    base: PropTypes.shape({
      HP: PropTypes.number.isRequired,
      Attack: PropTypes.number.isRequired,
      Defense: PropTypes.number,
      ["Sp. Attack"]: PropTypes.number,
      ["Sp. Defense"]: PropTypes.number,
      Speed: PropTypes.number,
    }).isRequired,
    species: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    evolution: PropTypes.shape({
      next: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
    }),
    profile: PropTypes.shape({
      height: PropTypes.string.isRequired,
      weight: PropTypes.string.isRequired,
      egg: PropTypes.arrayOf(PropTypes.string).isRequired,
      ability: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
        .isRequired,
      gender: PropTypes.string.isRequired,
    }).isRequired,
    image: PropTypes.shape({
      sprite: PropTypes.string.isRequired,
      thumbnail: PropTypes.string.isRequired,
      hires: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onSelect: PropTypes.func,
};

export default PokemonCard;
