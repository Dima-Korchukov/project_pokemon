import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";

export const Counter = ({ score }) => {
  const [displayedScore, setDisplayedScore] = useState(score);
  const [color, setColor] = useState("blue");

  useEffect(() => {
    const duration = 1000;
    const start = displayedScore;
    const end = score;
    const stepTime = Math.abs(Math.floor(duration / (end - start)));
    let currentScore = start;

    setColor("red");

    const timer = setInterval(() => {
      if (currentScore < end) {
        currentScore++;
        setDisplayedScore(currentScore);
      } else if (currentScore > end) {
        currentScore--;
        setDisplayedScore(currentScore);
      } else {
        clearInterval(timer);
        setColor("white");
      }
    }, stepTime);

    return () => {
      clearInterval(timer);
      setColor("white");
    };
  }, [score]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 2,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: "10px 20px",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: color,
          fontWeight: "bold",
          fontFamily: "Roboto, sans-serif",
          transition: "color 0.5s ease-in-out",
        }}
      >
        HP: {displayedScore}
      </Typography>
    </Box>
  );
};
Counter.propTypes = {
  score: PropTypes.number.isRequired,
};
