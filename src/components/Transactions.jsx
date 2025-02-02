import React, { useState } from "react";
import { useMoralis, useMoralisQuery, useMoralisWeb3Api } from "react-moralis";
import { Table, Tag, Space } from "antd";
import moment from "moment";
import { ETHLogo } from "./Chains/Logos";
import useContractAddress from "hooks/useContractAddress";

const styles = {
  table: {
    margin: "0 auto",
    width: "1000px",
  },
};

function NFTMarketTransactions() {
  const { account } = useMoralis();
  const queryItemImages = useMoralisQuery("ItemImages");
  const fetchItemImages = JSON.parse(
    JSON.stringify(queryItemImages.data, [
      "nftContract",
      "tokenId",
      "name",
      "image",
    ])
  );
  const { suffix } = useContractAddress();
  const queryMarketItems = useMoralisQuery(suffix + "CreatedMarketItems");
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
  )
    .filter(
      (item) => item.seller === account || item.owner === account
    )
    .sort((a, b) =>
      a.updatedAt < b.updatedAt ? 1 : b.updatedAt < a.updatedAt ? -1 : 0
    );

  function getImage(addrs, id) {
    const img = fetchItemImages.find(
      (element) =>
        element.nftContract === addrs &&
        element.tokenId === id
    );
    return img?.image;
  }

  function getName(addrs, id) {
    const nme = fetchItemImages.find(
      (element) =>
        element.nftContract === addrs &&
        element.tokenId === id
    );
    return nme?.name;
  }

  const data = fetchMarketItems?.map((item, index) => ({
    key: index,
    date: moment(item.updatedAt).format("DD-MM-YYYY HH:mm"),
    collection: item.nftContract,
    item: item.tokenId,
    tags: [item.seller, item.sold],
    price: item.price / ("1e" + 18)
  }));

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Item",
      key: "item",
      dataIndex: "item",
      render: (text, record) => (
        <Space size="middle">
          <img src={getImage(record.collection, record.item)} style={{ width: "40px", borderRadius: "4px" }} />
          <span>#{record.item}</span>
        </Space>
      ),
    },
    {
      title: "Collection",
      key: "collection",
      dataIndex: "collection",
      /*  render: (text, record) => (
          <Space size="middle">
            <span>{getName(record.collection, record.item)}</span>
          </Space>
        ),*/
    },
    {
      title: "Transaction Status",
      key: "tags",
      dataIndex: "tags",
      render: (tags) => (
        <>
          {tags.map((tag) => {
            let color = "geekblue";
            let status = "BUY";
            if (tag === false) {
              color = "volcano";
              status = "waiting";
            } else if (tag === true) {
              color = "green";
              status = "confirmed";
            }
            if (tag === account) {
              status = "SELL";
            }
            return (
              <Tag color={color} key={tag}>
                {status.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Price",
      key: "price",
      dataIndex: "price",
      render: (e) => (
        <Space size="middle">
          <ETHLogo />
          <span>{e}</span>
        </Space>
      ),
    }
  ];

  return (
    <>
      <div>
        <div style={styles.table}>
          <Table columns={columns} dataSource={data} />
        </div>
      </div>
    </>
  );

}

export default NFTMarketTransactions;