
import { useEffect, useState } from "react";
import { useMoralis, useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import useContractAddress from "./useContractAddress";
import { useIPFS } from "./useIPFS";

export const useNFTTokenIds = (options) => {
  const { nftAddress } = useContractAddress();
  const { token } = useMoralisWeb3Api();
  const { chainId, isInitialized } = useMoralis();
  const { resolveLink } = useIPFS();
  const [NFTTokenIds, setNFTTokenIds] = useState([]);
  const [data, setData] = useState();
  const [totalNFTs, setTotalNFTs] = useState();
  const [fetchSuccess, setFetchSuccess] = useState(true);



  useEffect(() => {
    if (!isInitialized || !chainId || !nftAddress) return null;
    token.getAllTokenIds({ address: nftAddress, chain: chainId }).then((nftss) => setData(nftss));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, chainId, nftAddress]);

  useEffect(async () => {
    console.log(data)
    if (data?.result) {
      const NFTs = data.result;
      setTotalNFTs(data.total);
      setFetchSuccess(true);
      for (let NFT of NFTs) {
        if (NFT?.metadata) {
          NFT.metadata = JSON.parse(NFT.metadata);
          NFT.image = resolveLink(NFT.metadata?.image);
        } else if (NFT?.token_uri) {
          try {
            await fetch(NFT.token_uri)
              .then((response) => response.json())
              .then((data) => {
                NFT.image = resolveLink(data.image);
              });
          } catch (error) {
            setFetchSuccess(false);
          }
        }
      }
      setNFTTokenIds(NFTs);
    }
  }, [data]);

  return {
    NFTTokenIds,
    totalNFTs,
    fetchSuccess,
  };
};
