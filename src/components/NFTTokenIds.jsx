import React, { useState } from "react";
import { useMoralis, useMoralisQuery, useWeb3ExecuteFunction } from "react-moralis";
import { Card, Image, Tooltip, Modal, Badge, Skeleton, Alert, Spin } from "antd";
import { FileSearchOutlined, SendOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { getExplorer, getNativeByChain } from "helpers/networks";
import { useVerifyMetadata } from "hooks/useVerifyMetadata";
import { useNFTTokenIds } from "hooks/useNFTTokenIds";

const { Meta } = Card;

const styles = {
  NFTs: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "flex-start",
    margin: "0 auto",
    maxWidth: "1000px",
    width: "100%",
    gap: "10px",
  },
};

function NFTTokenIds({ inputValue }) {
  const { NFTTokenIds } = useNFTTokenIds({ address: inputValue })
  const { Moralis, chainId, account } = useMoralis();
  const [nftToBuy, setNftToBuy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisibility] = useState(false);
  const [receiverToSend, setReceiver] = useState(null);
  const [amountToSend, setAmount] = useState(null);
  const [nftToSend, setNftToSend] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { verifyMetadata } = useVerifyMetadata();
  const nativeName = getNativeByChain(chainId);
  const queryMarketItems = useMoralisQuery("createdMarketItemss");
  const fetchMarketItems = JSON.parse(
    JSON.stringify(queryMarketItems.data, [
      "objectId",
      "createdAt",
      "price",
      "nftContract",
      "itemId",
      "sold",
      "tokenId",
      "seller",
      "owner",
      "confirmed",
    ])
  );
  const purchaseItemFunction = "createMarketSale";
  const [contractABI, setContractABI] = useState('[ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "itemId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "nftContract", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "seller", "type": "address" }, { "indexed": false, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "price", "type": "uint256" }, { "indexed": false, "internalType": "bool", "name": "sold", "type": "bool" } ], "name": "MarketItemCreated", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "itemId", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "owner", "type": "address" } ], "name": "MarketItemSold", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "nftContract", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "uint256", "name": "price", "type": "uint256" } ], "name": "createMarketItem", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "nftContract", "type": "address" }, { "internalType": "uint256", "name": "itemId", "type": "uint256" } ], "name": "createMarketSale", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "fetchMarketItems", "outputs": [ { "components": [ { "internalType": "uint256", "name": "itemId", "type": "uint256" }, { "internalType": "address", "name": "nftContract", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "address payable", "name": "seller", "type": "address" }, { "internalType": "address payable", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "price", "type": "uint256" }, { "internalType": "bool", "name": "sold", "type": "bool" } ], "internalType": "struct marketPlaceBoilerPlate.MarketItem[]", "name": "", "type": "tuple[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "bytes", "name": "", "type": "bytes" } ], "name": "onERC1155BatchReceived", "outputs": [ { "internalType": "bytes4", "name": "", "type": "bytes4" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "bytes", "name": "", "type": "bytes" } ], "name": "onERC1155Received", "outputs": [ { "internalType": "bytes4", "name": "", "type": "bytes4" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "bytes", "name": "", "type": "bytes" } ], "name": "onERC721Received", "outputs": [ { "internalType": "bytes4", "name": "", "type": "bytes4" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" } ]'); //Smart Contract ABI here
  const [marketAddress, setMarketAddress] = useState("0x9f6eA2398F5A4195eF4bcC63eb5288F38c2344e0"); //Smart Contract Address Here
  const contractABIJson = JSON.parse(contractABI);
  const contractProcessor = useWeb3ExecuteFunction();


  async function purchase() {
    setLoading(true);
    const tokenDetails = getMarketItem(nftToBuy);
    const itemID = tokenDetails.itemId;
    const tokenPrice = tokenDetails.price;
    const ops = {
      contractAddress: marketAddress,
      functionName: purchaseItemFunction,
      abi: contractABIJson,
      params: {
        nftContract: nftToBuy.token_address,
        itemId: itemID,
      },
      msgValue: tokenPrice,
    };
    console.log(ops)

    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        alert('Bought this nft')
        console.log("success");
        setLoading(false);
        setVisibility(false);
        updateSoldMarketItem();
        /**succPurchase();*/
      },
      onError: (error) => {
        alert(error)
        setLoading(false);
        /* failPurchase();*/
      },
    });
  }

  const handleBuyClick = (nft) => {
    setNftToBuy(nft);
    console.log(nft.image);
    setVisibility(true);
  };

  async function updateSoldMarketItem() {
    const id = getMarketItem(nftToBuy).objectId;
    const marketList = Moralis.Object.extend("createdMarketItemss");
    const query = new Moralis.Query(marketList);
    await query.get(id).then((obj) => {
      obj.set("sold", true);
      obj.set("owner", account);
      obj.save();
    });
  }

  const getMarketItem = (nft) => {
    const result = fetchMarketItems?.find(
      (e) =>
        e.nftContract === nft?.token_address &&
        e.tokenId === nft?.token_id &&
        e.sold === false &&
        e.confirmed === true
    );
    return result;
  };

  console.log("NFTTokenIds", NFTTokenIds);
  return (
    <div style={{ padding: "15px", maxWidth: "1030px", width: "100%" }}>
      <h1>🖼 NFT Balances</h1>
      <div style={styles.NFTs}>
        <Skeleton loading={!NFTTokenIds}>
          {NFTTokenIds &&
            NFTTokenIds.map((nft, index) => {
              //Verify Metadata
              nft = verifyMetadata(nft);
              return (
                <Card
                  hoverable
                  actions={[
                    <Tooltip title="View On Blockexplorer">
                      <FileSearchOutlined
                        onClick={() => window.open(`${getExplorer(chainId)}address/${nft.token_address}`, "_blank")}
                      />
                    </Tooltip>,
                    <Tooltip title="Buy NFT">
                      <ShoppingCartOutlined onClick={() => handleBuyClick(nft)} />
                    </Tooltip>,
                  ]}
                  style={{ width: 240, border: "2px solid #e7eaf3" }}
                  cover={
                    <Image
                      preview={false}
                      src={nft?.image || "error"}
                      fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                      alt=""
                      style={{ height: "300px" }}
                    />
                  }
                  key={index}
                >
                  {getMarketItem(nft) && (
                    <Badge.Ribbon text="Buy Now" color="green"></Badge.Ribbon>
                  )}
                  <Meta title={nft.name} description={nft.token_address} />
                </Card>
              );
            })}
        </Skeleton>
      </div>
      {getMarketItem(nftToBuy) ? (
        <Modal
          title={`Buy ${nftToBuy?.name} #${nftToBuy?.token_id}`}
          visible={visible}
          onCancel={() => setVisibility(false)}
          onOk={() => purchase()}
          okText="Buy"
        >
          <Spin spinning={loading}>
            <div
              style={{
                width: "250px",
                margin: "auto",
              }}
            >
              <Badge.Ribbon
                color="green"
                text={`${getMarketItem(nftToBuy).price / ("1e" + 18)
                  } ${nativeName}`}
              >
                <img
                  src={nftToBuy?.image}
                  style={{
                    width: "250px",
                    borderRadius: "10px",
                    marginBottom: "15px",
                  }}
                />
              </Badge.Ribbon>
            </div>
          </Spin>
        </Modal>
      ) : (
        <Modal
          title={`Buy ${nftToBuy?.name} #${nftToBuy?.token_id}`}
          visible={visible}
          onCancel={() => setVisibility(false)}
          onOk={() => setVisibility(false)}
        >
          <img
            src={nftToBuy?.image}
            style={{
              width: "250px",
              margin: "auto",
              borderRadius: "10px",
              marginBottom: "15px",
            }}
          />
          <Alert
            message="This NFT is currently not for sale"
            type="warning"
          />
        </Modal>
      )}
    </div>
  );
}

export default NFTTokenIds;
