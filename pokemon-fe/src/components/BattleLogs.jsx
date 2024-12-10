import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { keyframes } from "@emotion/react";
import { Grid } from "@mui/material";
import { useEffect, useRef } from "react";

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const BattleLogs = ({ logs }) => {
  const logsContainerRef = useRef(null);

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop =
        logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Box
      sx={{
        marginTop: 4,
        padding: 2,
        maxHeight: "300px",
        overflowY: "auto",
        borderTop: "1px solid #ccc",
        backgroundColor: "#f9f9f9",
        borderRadius: 2,
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      }}
      ref={logsContainerRef}
    >
      <Typography variant="h6" sx={{ textAlign: "center", marginBottom: 2 }}>
        Battle Logs
      </Typography>
      {logs.length === 0 ? (
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ textAlign: "center" }}
        >
          No logs yet...
        </Typography>
      ) : (
        logs.map((log, index) => (
          <Grid
            key={index}
            container
            direction="column"
            sx={{
              animation: `${fadeIn} 0.5s ease-in`,
              marginBottom: 1,
              padding: 1,
              borderRadius: 1,
              backgroundColor: "#fff",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Grid item>
              <Typography variant="body2" color="textPrimary">
                {log}
              </Typography>
            </Grid>
          </Grid>
        ))
      )}
    </Box>
  );
};

BattleLogs.propTypes = {
  logs: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default BattleLogs;
