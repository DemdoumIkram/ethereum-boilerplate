const { expect } = require("chai");
const SecondContract = artifacts.require(
  "SecondContractV3"
);

// Start test block
contract("SecondContractV3", (accounts) => {
  beforeEach(async () => {
    // Deploy a new Box contract for each test
    this.erc1155Instance = await SecondContract.new({
      from: accounts[0],
    });
    await this.erc1155Instance.initialize();
    await this.erc1155Instance.setPaused(false);
    // await this.erc1155Instance.setOnlyWhitelisted(false);
  });

  it("should mint the correct base URI", async () => {
    expect((await this.erc1155Instance.uri(0)).toString()).to.equal(
      "ipfs://QmddF2G4pjXbHFRqkavT3bSQiMJ4wctxbUvPtwMEJ4hYJz/reveal.json"
    );
  });
});
