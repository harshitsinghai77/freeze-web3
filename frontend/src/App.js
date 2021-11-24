import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { Box, Grommet, Button, Text, Grid, TextInput, Spinner } from "grommet";

import { loadProvider } from "./utils/web3Connect";
import { loadHelloWorldContract } from "./utils/load-contract";

const theme = {
  global: {
    colors: {
      brand: "#228BE6",
    },
    font: {
      family: "Roboto",
      size: "14px",
      height: "20px",
    },
  },
};

function App() {
  const [web3Provider, setWeb3Provider] = useState();
  const [web3Signer, setWeb3Signer] = useState();
  const [contract, setContract] = useState();
  const [balance, setBalance] = useState();
  const [userBalance, setUserBalance] = useState();
  const [account, setAccount] = useState();
  const [addFundValue, setAddFundValue] = useState();
  const [loader, setLoader] = useState();

  useEffect(() => {
    connectWallet();
  }, []);

  const setAccountListener = (provider) => {
    provider.provider.on("accountsChanged", async (accounts) => {
      setAccount(accounts[0]);
      await updateBalance();
    });
  };

  useEffect(() => {
    const getAccount = async () => {
      const account = await web3Signer.getAddress();
      let userBalance = await web3Signer.getBalance();
      userBalance = ethers.utils.formatEther(userBalance);
      setAccount(account);
      setUserBalance(parseInt(userBalance).toFixed(2));
    };
    web3Signer && getAccount();
  }, [web3Signer]);

  const updateBalance = useCallback(async () => {
    if (!web3Signer) return;
    let userBalance = await web3Signer.getBalance();
    userBalance = ethers.utils.formatEther(userBalance);
    setUserBalance(parseInt(userBalance).toFixed(2));
  }, [web3Signer]);

  const connectWallet = async () => {
    const { provider, signer } = await loadProvider();
    const helloWorldContract = loadHelloWorldContract(signer);
    setAccountListener(provider);
    setContract(helloWorldContract);
    setWeb3Provider(provider);
    setWeb3Signer(signer);
  };

  const loadBalance = useCallback(async () => {
    if (!web3Provider && !contract) return;
    let balance = await web3Provider.getBalance(contract.address);
    balance = ethers.utils.formatEther(balance);
    setBalance(balance);
  }, [web3Provider, contract]);

  const addFunds = useCallback(async () => {
    if (!addFundValue || addFundValue <= 0) return;
    const amount = ethers.utils.parseEther(addFundValue);
    const addFundTransaction = await contract.addFunds({
      from: account,
      value: amount,
    });
    await addFundTransaction.wait();
    await loadBalance();
    await updateBalance();
  }, [contract, addFundValue, account, loadBalance, updateBalance]);

  const withdrawFunds = async () => {
    if (!web3Provider && !contract) return;
    let withdrawAmount = ethers.utils.parseEther("3");
    const withdrawTransaction = await contract.withdraw(withdrawAmount);
    setLoader(true);
    await withdrawTransaction.wait();
    await loadBalance();
    await updateBalance();
    setLoader(false);
  };

  useEffect(() => {
    contract && web3Provider && loadBalance();
  }, [contract, web3Provider, loadBalance]);

  return (
    <Grommet theme={theme} full>
      <Box fill>
        <Box flex align="center" justify="center">
          <Button secondary label="Connect Wallet" onClick={connectWallet} />
          <Text size="medium" margin="small">
            Address {account}
          </Text>
          <Text size="large" margin="small">
            Your Balance <strong>{userBalance}</strong> ETH
          </Text>
          <Text size="xlarge" margin="small">
            Pool Current Balance <strong>{balance}</strong> ETH
          </Text>

          <Grid columns={["small", "small"]} gap="small">
            <Button primary label="Deposit" onClick={addFunds} />
            <TextInput
              placeholder="type here"
              type="number"
              value={addFundValue}
              onChange={(event) => setAddFundValue(event.target.value)}
            />
            <Button secondary label="Withdrawal" onClick={withdrawFunds} />
            {loader && <Spinner />}
          </Grid>
        </Box>
      </Box>
    </Grommet>
  );
}

export default App;
