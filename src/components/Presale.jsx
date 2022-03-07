import React from "react";
import { Card, Typography, Button, Modal } from "antd";
import { useMoralis } from "react-moralis";
import axios from 'axios';
const whiteListLimit = 10;

export default function Presale() {
  const { Moralis, chainId, account } = useMoralis();

  //function to load ip address from the API
  const getIpAddress = async () => {
    const res = await axios.get('https://api.ipify.org?format=json')
    console.log(res.data);
    return res.data.ip;
  }

  function alertModal(success, content) {
    let secondsToGo = 5;
    const modal = success ? Modal.success({ title: "Success!", content }) : Modal.error({ title: "Error!", content });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  const whiteListUser = async () => {
    /*  if( Moralis && chainId){
      const { nftAddress } = useContractAddress();
      const ratings = await Moralis.Cloud.run("setOnlyWhitelisted", {
        address: nftAddress ,
        abi,
        chainId
      });
      console.log(ratings)}*/

    const users = Moralis.Object.extend("whiteList");
    const queryAll = new Moralis.Query(users);
    const whiteList = await queryAll.find();
    if (whiteList.length < whiteListLimit) {
      if (account) {
        const ipAddress = await getIpAddress();
        const queryIpAddress = new Moralis.Query(users);
        queryIpAddress.equalTo("ipAddress", ipAddress);
        const dataIpAddress = await queryIpAddress.first();
        if (dataIpAddress !== undefined) {
          alertModal(false, 'This IP address is already whitelisted')
          console.log(dataIpAddress)
        } else {
          const query = new Moralis.Query(users);
          query.equalTo("userAddress", account);
          const data = await query.first();
          if (data !== undefined) {
            alertModal(false, 'This user is already whitelisted')
            console.log(data)
          } else {
            const newUser = new users();
            newUser.set("userAddress", account);
            newUser.set("chainId", chainId);
            newUser.set("ipAddress", ipAddress);

            await newUser.save();
            alertModal(true, 'Congratulations, you are on the whitelist now !')
          }
        }
      } else {
        alertModal(false, 'No wallet is connected')
      }
    } else {
      alertModal(false, 'WhiteList limit is reached')
    }
  }

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
        <Typography.Title level={3}> NFT Presale</Typography.Title>

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
          loading={false}
          onClick={() => { console.log("hha"); whiteListUser() }}
        >
          Subscribe to the WhiteList
        </Button>
      </Card>
    </div>
  );
}
