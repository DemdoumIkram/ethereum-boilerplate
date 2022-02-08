const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const SecondContract = artifacts.require('SecondContract');

module.exports = async function (deployer) {
    const instance = await deployProxy(SecondContract, [], { deployer, kind: 'uups' });
    console.log('Deployed', instance.address);
    await instance.setPaused(false);
    await instance.setOnlyWhitelisted(false);
}; 