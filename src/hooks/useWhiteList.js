
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { abi } from "../contracts/SecondContractV3.json";
import useContractAddress from "./useContractAddress";

export const useWhiteList = () => {
  const { Moralis, isWeb3Enabled, } = useMoralis();
  const [onlyWhitelisted, setOnlyWhitelisted] = useState();
  const { nftAddress } = useContractAddress();

  useEffect(async () => {
    if (!Moralis || !isWeb3Enabled || !nftAddress) return null;
    try {
      const message = await Moralis.executeFunction({
        functionName: 'isPaused',
        contractAddress: nftAddress,
        abi,
      });
      setOnlyWhitelisted(message)
      console.log(message)
    } catch (e) {
      console.error(e)
    }
  }, [Moralis, isWeb3Enabled, nftAddress]);

  return { onlyWhitelisted };
};
