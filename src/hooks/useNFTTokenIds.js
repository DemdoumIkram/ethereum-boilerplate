
import { useEffect, useState } from "react";
import { useMoralis, useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import { useIPFS } from "./useIPFS";

export const useNFTTokenIds = (options) => {
  const { token} = useMoralisWeb3Api();
  const { chainId, isInitialized } = useMoralis();
  const { resolveLink } = useIPFS();
  const [NFTTokenIds, setNFTTokenIds] = useState([]);
  const [data, setData] = useState();
  const [totalNFTs, setTotalNFTs] = useState();
  const [fetchSuccess, setFetchSuccess] = useState(true);
  
  

  useEffect(() => {
    console.log('isini',isInitialized)
    if (!isInitialized || !chainId) return null;
    const { address } = options;
    console.log("token",token)
    console.log("chainId",chainId)
    token.getAllTokenIds({ address: address, chain: chainId }).then((nftss)=> setData(nftss));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, chainId]);

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
              
/*          !!Temporary work around to avoid CORS issues when retrieving NFT images!!
            Create a proxy server as per https://dev.to/terieyenike/how-to-create-a-proxy-server-on-heroku-5b5c
            Replace <your url here> with your proxy server_url below
            Remove comments :)

              try {
                await fetch(`<your url here>/${NFT.token_uri}`)
                .then(response => response.json())
                .then(data => {
                  NFT.image = resolveLink(data.image);
                });
              } catch (error) {
                setFetchSuccess(false);
              }

 */
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
