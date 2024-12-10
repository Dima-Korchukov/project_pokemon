import { useContext } from "react";
import { AuthUserApi } from "../../services/auth.service";
import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import useCustomToast from "../../hooks/useToaster";

export const Login = () => {
  const { account, getAccount, connectMetamask } = useContext(AuthContext);
  const { showSuccessToast, showErrorToast } = useCustomToast();

  const navigate = useNavigate();
  const handleSignIn = async () => {
    try {
      const address = account || (await getAccount());
      const { nonce } = await AuthUserApi.generateNonce(address);
      await connectMetamask(nonce);
      showSuccessToast("Successfully signed in!");
      navigate("/pokemon-list");
    } catch (error) {
      showErrorToast("Failed to connect Metamask. Check console for details.");
      console.error("Authentication error:", error);
    }
  };

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          padding: "40px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            marginBottom: "20px",
            color: "#333",
          }}
        >
          Welcome to the Game!
        </Typography>
        <Typography
          variant="body1"
          sx={{
            marginBottom: "30px",
            color: "#666",
            fontSize: "1.1rem",
          }}
        >
          Please sign in with your Metamask account to start your adventure.
        </Typography>
        <Button
          onClick={handleSignIn}
          variant="contained"
          color="primary"
          sx={{
            padding: "12px 24px",
            fontSize: "1rem",
            borderRadius: "30px",
            fontWeight: "bold",
          }}
        >
          Sign In with Metamask
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
