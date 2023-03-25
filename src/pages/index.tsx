// src/pages/index.tsx
import type { NextPage } from "next";
import Head from "next/head";
import NextLink from "next/link";
import { VStack, Heading, Box, LinkOverlay, LinkBox } from "@chakra-ui/layout";
import { Text, Button } from "@chakra-ui/react";
// import { ethers } from "ethers";
import { useEffect, useState } from "react";

const ethers = require("ethers");

declare let window: any;

const Home: NextPage = () => {
  const [currentAccount, setCurrentAccount] = useState<string | undefined>();
  const [balance, setBalance] = useState<string | undefined>();
  const [chainId, setChainId] = useState<number | undefined>();
  const [chainName, setChainName] = useState<string | undefined>();

  useEffect(() => {
    if (!currentAccount || !ethers.utils.isAddress(currentAccount)) return;

    if (!window.ethereum) return;

    const provider = new ethers.provide.Web3Provider(window.ethereum);

    provider.getBalance(currentAccount).then((result: number) => {
      setBalance(ethers.utils.formatEthers(result));
    });

    provider.getNetwork().then((result: any) => {
      setChainId(result.chainId);
      setChainName(result.name);
    });
  }, [currentAccount]);

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
