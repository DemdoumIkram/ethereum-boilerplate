import { useLocation } from "react-router";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";
import { useWhiteList } from "hooks/useWhiteList";
import purse from "assets/icons/purse.png";
import explorer from "assets/icons/internet-explorer.png";
import transaction from "assets/icons/transaction.png";
import startup from "assets/icons/startup.png";

function MenuItems() {
  const { pathname } = useLocation();
  const { onlyWhitelisted } = useWhiteList();

  return (
    <Menu
      theme="light"
      mode="horizontal"
      style={{
        display: "flex",
        fontSize: "17px",
        fontWeight: "500",
        width: "100%",
        justifyContent: "center",
      }}
      defaultSelectedKeys={[pathname]}
    >
      {/*<Menu.Item key="/quickstart">
        <NavLink to="/quickstart">🚀 Quick Start</NavLink>
      </Menu.Item>
      <Menu.Item key="/wallet">
        <NavLink to="/wallet">👛 Wallet</NavLink>
      </Menu.Item>
      <Menu.Item key="/1inch">
        <NavLink to="/1inch">🏦 Dex</NavLink>
      </Menu.Item>
      <Menu.Item key="onramp">
        <NavLink to="/onramp">💵 Fiat</NavLink>
      </Menu.Item>
      <Menu.Item key="/erc20balance">
        <NavLink to="/erc20balance">💰 Balances</NavLink>
      </Menu.Item>
      <Menu.Item key="/erc20transfers">
        <NavLink to="/erc20transfers">💸 Transfers</NavLink>
      </Menu.Item>*/}
      {onlyWhitelisted && onlyWhitelisted === false ?
        <Menu.Item key="/home">
          <NavLink to="/home">
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={startup} alt="" style={{ marginRight: "5px", width: '16px', height: '16px' }}></img>NFT Minter
            </div>
          </NavLink>
        </Menu.Item>
        :
        <Menu.Item key="/presale">
          <NavLink to="/presale">
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={startup} alt="" style={{ marginRight: "5px", width: '16px', height: '16px' }}></img>NFT Presale
            </div>
          </NavLink>
        </Menu.Item>
      }
      <Menu.Item key="/nftMarket">
        <NavLink to="/nftMarket">
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={explorer} alt="" style={{ marginRight: "5px", width: '16px', height: '16px' }}></img>Explorer
          </div>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="/nftBalance">
        <NavLink to="/nftBalance">
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={purse} alt="" style={{ marginRight: "5px", width: '16px', height: '16px' }}></img>Your Collection
          </div>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="/transactions">
        <NavLink to="/transactions">
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={transaction} alt="" style={{ marginRight: "5px", width: '16px', height: '16px' }}></img>Transactions
          </div>
        </NavLink>
      </Menu.Item>
      {/*<Menu.Item key="/contract">
        <NavLink to="/contract">📄 Contract</NavLink>
      </Menu.Item>*/}
    </Menu>
  );
}

export default MenuItems;
