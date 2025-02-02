import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Account from "components/Account/Account";
import Chains from "components/Chains";
import NFTBalance from "components/NFTBalance";
import { Layout } from "antd";
import "antd/dist/antd.css";
import NativeBalance from "components/NativeBalance";
import "./style.less";
import Text from "antd/lib/typography/Text";
import MenuItems from "./components/MenuItems";
import NFTTokenIds from "components/NFTTokenIds";
import React from "react";
import NFTMarketTransactions from "components/Transactions";
import Home from "components/Home";
import Presale from "components/Presale";
import logo from "Logo.png";
import { useWhiteList } from "hooks/useWhiteList";
import useContractAddress from "hooks/useContractAddress";

const { Header, Footer } = Layout;

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
    marginTop: "130px",
    padding: "10px",
  },
  header: {
    position: "fixed",
    zIndex: 1,
    width: "100%",
    //background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
    borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
  },
  headerRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
  },
};
const App = ({ isServerInfo }) => {
  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } = useMoralis();
  const { isPaused } = useWhiteList();
  const { suffix } = useContractAddress();

  useEffect(() => {
    const connectorId = window.localStorage.getItem("connectorId");
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3({ provider: connectorId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  return (
    <Layout
      style={{
        height: "100vh",
        overflow: "auto",
        background: "linear-gradient(#241832, #001529)",
      }}>
      <Router>
        <Header theme="dark" style={styles.header}>
          <Logo />
          <MenuItems />
          <div style={styles.headerRight}>
            <Chains />
            {/*<TokenPrice
              address="0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
              chain="eth"
              image="https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg/"
              size="40px"
            /> */}
            <NativeBalance />
            <Account />
          </div>
        </Header>

        <div style={styles.content}>
          <Switch>
            {/*<Route exact path="/quickstart">
              <QuickStart isServerInfo={isServerInfo} />
            </Route>
            <Route path="/wallet">
              <Wallet />
            </Route>
            <Route path="/1inch">
              <Tabs defaultActiveKey="1" style={{ alignItems: "center" }}>
                <Tabs.TabPane tab={<span>Ethereum</span>} key="1">
                  <DEX chain="eth" />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<span>Binance Smart Chain</span>} key="2">
                  <DEX chain="bsc" />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<span>Polygon</span>} key="3">
                  <DEX chain="polygon" />
                </Tabs.TabPane>
              </Tabs>
            </Route>
            <Route path="/erc20balance">
              <ERC20Balance />
            </Route>
            <Route path="/onramp">
              <Ramper />
            </Route>
            <Route path="/erc20transfers">
              <ERC20Transfers />
          </Route>*/}
            <Route exact path="/home">
              {isPaused != undefined && isPaused === false &&
                <Home />}
              {isPaused != undefined && isPaused === true &&
                <Presale />}
            </Route>
            <Route path="/nftMarket">
              {suffix &&
                <NFTTokenIds suffix={suffix} />
              }
            </Route>
            <Route path="/nftBalance">
              <NFTBalance />
            </Route>
            <Route path="/transactions">
              <NFTMarketTransactions />
            </Route>
            <Route path="/">
              <Redirect to="/home" />
            </Route>
            {/*
            <Redirect to="/home" />
            <Route path="/contract">
              <Contract />
            </Route>

            <Route path="/ethereum-boilerplate">
              <Redirect to="/quickstart" />
            </Route>
            <Route path="/nonauthenticated">
              <>Please login using the "Authenticate" button</>
        </Route>*/}
          </Switch>
        </div>
      </Router>
    </Layout>
  );
};

export const Logo = () => (
  <div style={{ display: "flex" }}>
    <img src={logo} alt="" style={{ width: "70px" }}></img>
  </div>
);

export default App;
