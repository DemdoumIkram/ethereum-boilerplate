
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { abi } from "../contracts/SecondContractV3.json";
import useContractAddress from "./useContractAddress";

export const useWhiteList = () => {
  const { Moralis, isWeb3Enabled, } = useMoralis();
  const [onlyWhitelisted, setOnlyWhitelisted] = useState();
  const [isPaused, setIsPaused] = useState();
  const { nftAddress } = useContractAddress();

  useEffect(async () => {
    if (!Moralis || !isWeb3Enabled || !nftAddress) return null;
    try {
      const message1 = await Moralis.executeFunction({
        functionName: 'isPaused',
        contractAddress: nftAddress,
        abi,
      });
      setIsPaused(message1)
      const message2 = await Moralis.executeFunction({
        functionName: 'onlyWhitelisted',
        contractAddress: nftAddress,
        abi,
      });
      setOnlyWhitelisted(message2)
      console.log(message1, message2)
    } catch (e) {
      console.error(e)
    }
  }, [Moralis, isWeb3Enabled, nftAddress]);

  return { onlyWhitelisted, isPaused };
};
