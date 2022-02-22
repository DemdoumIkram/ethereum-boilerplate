import React from "react";
import { Card, Typography, Button } from "antd";
import { useWeb3Contract } from "react-moralis";
import { abi } from "../contracts/SecondContract.json";

export default function QuickStart() {
  const { runContractFunction, isLoading } = useWeb3Contract({
    functionName: 'mint',
    contractAddress: "0x121949edf57aFC7A57D64ab3e232000281E270b6",
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
