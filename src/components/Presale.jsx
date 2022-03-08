import React, { useState } from "react";
import { Card, Typography, Button, Modal } from "antd";
import { useMoralis } from "react-moralis";
import axios from 'axios';
import { connectors } from "./Account/config";
import Text from "antd/lib/typography/Text";

const whiteListLimit = 10;

const styles = {
  connector: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    height: "auto",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    padding: "20px 5px",
    cursor: "pointer",
  },
  icon: {
    alignSelf: "center",
    fill: "rgb(40, 13, 95)",
    flexShrink: "0",
    marginBottom: "8px",
    height: "30px",
  },
}

export default function Presale() {
  const { Moralis, chainId, account, isAuthenticated, authenticate } = useMoralis();
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);

  //function to load ip address from the API
  const getIpAddress = async () => {
    const res = await axios.get('https://api.ipify.org?format=json')
    console.log(res.data);
    return res.data.ip;
  }

  function alertModal(success, content) {
    let secondsToGo = 5;
    const modal = success ? Modal.success({ title: "Success!", content }) : Modal.error({ title: "Error!", content });
    modal.update({ centered: true })
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
      if (account && isAuthenticated) {
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
        setIsAuthModalVisible(true)
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
          onClick={() => { whiteListUser() }}
        >
          Subscribe to the WhiteList
        </Button>
      </Card>
      <Modal
        visible={isAuthModalVisible}
        footer={null}
        onCancel={() => setIsAuthModalVisible(false)}
        centered
        bodyStyle={{
          padding: "15px",
          fontSize: "17px",
          fontWeight: "500",
        }}
        style={{ fontSize: "16px", fontWeight: "500" }}
        width="340px"
      >
        <div style={{ padding: "10px", display: "flex", justifyContent: "center", fontWeight: "700", fontSize: "20px" }}>
          Connect Wallet
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          {connectors.map(({ title, icon, connectorId }, key) => (
            <div
              style={styles.connector}
              key={key}
              onClick={async () => {
                try {
                  await authenticate({ provider: connectorId });
                  window.localStorage.setItem("connectorId", connectorId);
                  setIsAuthModalVisible(false);
                } catch (e) {
                  console.error(e);
                }
              }}
            >
              <img src={icon} alt={title} style={styles.icon} />
              <Text style={{ fontSize: "14px" }}>{title}</Text>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
