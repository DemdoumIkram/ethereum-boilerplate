const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

const SecondContract = artifacts.require('SecondContractV3');

module.exports = async function (deployer) {
    /*    const instance = await deployProxy(SecondContract, [], { deployer, kind: 'uups' });
        console.log('Deployed', instance.address);
        await instance.setPaused(false);
        await instance.setOnlyWhitelisted(false);*/
    this.erc1155Instance = await upgradeProxy(
        "0xE8988756957799676F65b498c2F54C6D527976D1",
        SecondContract,
        {
            kind: "uups",
            from: "0xc77aA684ad381d73ebb427c35680eDB37F8B11fB",
        }
    );
}; 