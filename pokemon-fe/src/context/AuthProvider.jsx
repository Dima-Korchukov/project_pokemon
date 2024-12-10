import { createContext, useState } from "react";
import PropTypes from "prop-types";
import { ethers } from "ethers";
import { AuthUserApi } from "../services/auth.service";
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [signature, setSignature] = useState(null);

  const getAccount = async () => {
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");

    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setAccount(address);
    return address;
  };

  const connectMetamask = async (message) => {
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const nonceMessage = `Nonce: ${message}`;
    const signature = await signer.signMessage(nonceMessage);
    const address = await signer.getAddress();

    const response = await AuthUserApi.verifySignature(address, signature);
    localStorage.setItem("token", response.token);
    setSignature(signature);
  };

  return (
    <AuthContext.Provider
      value={{ account, signature, getAccount, connectMetamask }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
