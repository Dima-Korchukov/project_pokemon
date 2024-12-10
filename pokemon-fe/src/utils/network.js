const appStatus = import.meta.env.VITE_APP;
const devServerUrl = import.meta.env.VITE_DEV_SERVER_URL;
const prodServerUrl = import.meta.env.VITE_PROD_SERVER_URL;

//base
export const baseUrl = appStatus === "dev" ? devServerUrl : prodServerUrl;
export const socketBaseUrl = `${baseUrl}`;
//auth
export const baseAuthUrl = `${baseUrl}/auth`;
export const generateNonceUrl = `${baseAuthUrl}/request-nonce`;
export const verifySignatureUrl = `${baseAuthUrl}/verify-signature`;

//pokemon
export const basePokemonUrl = `${baseUrl}/pokemon`;
export const getAllPokemonUrl = (page = 1, size = 10) =>
  `${basePokemonUrl}/all?page=${page}&pageSize=${size}`;

//game
export const baseGameUrl = `${baseUrl}/game`;
export const startGameUrl = `${baseGameUrl}/start`;
