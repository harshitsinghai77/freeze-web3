import { ethers } from "ethers";

export const loadProvider = async () => {
  let provider = null;
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
  } else {
    provider = new ethers.providers.JsonRpcProvider("http://localhost:7545");
  }

  await provider.send("eth_requestAccounts");
  const signer = provider.getSigner();
  return { provider, signer };
};
