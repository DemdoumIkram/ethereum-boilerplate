import React from "react";
import { Card, Typography, Button, Alert } from "antd";
import { useWeb3Contract } from "react-moralis";
import { abi } from "../contracts/SecondContractV3.json";
import useContractAddress from "hooks/useContractAddress";
import { useWhiteList } from "hooks/useWhiteList";

export default function QuickStart() {
  const { nftAddress } = useContractAddress();
  const { onlyWhitelisted } = useWhiteList();
  const { runContractFunction, isLoading } = useWeb3Contract({
    functionName: 'mint',
    contractAddress: nftAddress,
    abi,
    params: { _mintAmount: 1 }
  })
  return (
    <div style={{ display: "flex" }}>
      <Card
        bordered={false}
        style={{
          width: 600,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography.Title level={3}>NFT Minter</Typography.Title>
        <img
          src="https://gateway.pinata.cloud/ipfs/QmaWzXnGrnsBfDgeK3hKHNGaRYaDbs5o5XsgNNftFgfV16/reveal.png"
          alt="Test"
          style={{ marginBottom: "2rem", height: "350px" }}
        />
        {onlyWhitelisted &&
          <Alert
            message="Only whitelisted users are allowed to mint."
            type="info"
          />
        }
        <Button
          type="primary"
          shape="round"
          size="large"
          style={{ width: "100%" }}
          loading={isLoading}
          onClick={() => { console.log("hha"); runContractFunction() }}
        >
          MINT
        </Button>
      </Card>
    </div>
  );
}
