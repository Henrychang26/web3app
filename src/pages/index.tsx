// src/pages/index.tsx
import type { NextPage } from "next";
import Head from "next/head";
import NextLink from "next/link";
import { VStack, Heading, Box, LinkOverlay, LinkBox } from "@chakra-ui/layout";
import { Text, Button } from "@chakra-ui/react";
// import { ethers } from "ethers";
import { useEffect, useState } from "react";
import ReadERC20 from "components/ReadERC20";
import TransferERC20 from "components/TransferERC20";

const ethers = require("ethers");

declare let window: any;

const Home: NextPage = () => {
  const [currentAccount, setCurrentAccount] = useState<string | undefined>();
  const [balance, setBalance] = useState<string | undefined>();
  const [chainId, setChainId] = useState<number | undefined>();
  const [chainName, setChainName] = useState<string | undefined>();

  function handleAccountChanged(accounts: any) {
    if (accounts.length === 0) {
      console.log("please connect to MetaMask");
    } else if (accounts[0] !== currentAccount) {
      setCurrentAccount(accounts[0]);
    }
  }

  function handleChainChanged(_chainId: any) {
    if (_chainId === chainId) {
      console.log("connect to different chain");
    } else {
      setChainId(_chainId);
    }
  }

  useEffect(() => {
    if (!currentAccount || !ethers.utils.isAddress(currentAccount)) return;

    if (!window.ethereum) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    window.ethereum
      .request({ method: "eth_accounts" })
      .then(handleAccountChanged)
      .catch((err: any) => console.error(err));

    window.ethereum.on("accountsChanged", handleAccountChanged);

    window.ethereum.request({ method: "eth_chainId" });
    // Do something with the chainId
    window.ethereum.on("chainChanged", handleChainChanged);

    provider.getBalance(currentAccount).then((result: number) => {
      setBalance(ethers.utils.formatEther(result));
    });

    provider.getNetwork().then((result: any) => {
      setChainId(result.chainId);
      setChainName(result.name);
    });
  }, [currentAccount, chainId]);

  // useEffect(() => {
  //   window.ethereum
  //     .request({ method: "eth_chainId" })
  //     .then(handleChainChanged)
  //     .catch((err: any) => console.log(err));

  //   window.ethereum.on("chainChanged", handleChainChanged);
  // }, []);

  const onClickConnect = () => {
    if (!window.ethereum) {
      console.log("Please install MetaMask");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    provider
      .send("eth_requestAccounts", [])
      .then((accounts: any) => {
        if (accounts.length > 0) setCurrentAccount(accounts[0]);
      })
      .catch((e: string) => console.log(e));
  };

  const onClickDisconnect = () => {
    console.log("onClickDisConnect");
    setBalance(undefined);
    setCurrentAccount(undefined);
  };

  return (
    <>
      <Head>
        <title>My DAPP</title>
      </Head>

      <Heading as="h3" my={4}>
        Explore Web3
      </Heading>
      <VStack>
        <Box w="100%" my={4}>
          {currentAccount ? (
            <Button type="button" w="100%" onClick={onClickDisconnect}>
              Account:{currentAccount}
            </Button>
          ) : (
            <Button type="button" w="100%" onClick={onClickConnect}>
              Connect MetaMask
            </Button>
          )}
        </Box>
        {currentAccount ? (
          <Box mb={0} p={4} w="100%" borderWidth="1px" borderRadius="lg">
            <Heading my={4} fontSize="xl">
              Account info
            </Heading>
            <Text>ETH Balance of current account: {balance}</Text>
            <Text>
              Chain Info: ChainId {chainId} name {chainName}
            </Text>
            <ReadERC20
              addressContract="0x5FbDB2315678afecb367f032d93F642f64180aa3"
              currentAccount={currentAccount}
            />
            <TransferERC20
              addressContract="0x5FbDB2315678afecb367f032d93F642f64180aa3"
              currentAccount={currentAccount}
            />
          </Box>
        ) : (
          <></>
        )}
        ...
      </VStack>
    </>
  );
};

export default Home;
