const { expect } = require("chai");
const { deployProxy, upgradeProxy } = require("@openzeppelin/truffle-upgrades");
const ERC1155CustomUpgradeableV1 = artifacts.require(
  "SecondContract"
);
const ERC1155CustomUpgradeableV2 = artifacts.require(
  "SecondContractV2"
);

// Start test block
contract("SecondContractV2", (accounts) => {
  beforeEach(async () => {
    // Deploy a new Box contract for each test
    this.existing = await deployProxy(ERC1155CustomUpgradeableV1, [], {
      kind: "uups",
      from: accounts[0],
    });

    await this.existing.setPaused(false);
    await this.existing.setOnlyWhitelisted(false);

    this.erc1155Instance = await upgradeProxy(
      this.existing.address,
      ERC1155CustomUpgradeableV2,
      {
        kind: "uups",
        from: accounts[0],
      }
    );
  });

  it("should mint the correct base URI", async () => {
    expect((await this.erc1155Instance.uri(0)).toString()).to.equal(
      "ipfs://QmddF2G4pjXbHFRqkavT3bSQiMJ4wctxbUvPtwMEJ4hYJz/reveal.json"
    );
  });

  it("should mint 1 NFT with tokenId 0", async () => {
    await this.erc1155Instance.mint(1);
    expect(
      (await this.erc1155Instance.addressMintedBalance(accounts[0])).toString()
    ).to.equal("2");
  });
});
