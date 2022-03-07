Moralis.Cloud.define("hello", async (request) => {
    const {msg} = request.params;
    return msg;
  });
  
Moralis.Cloud.define("setOnlyWhitelisted", async (request) => {
    const logger = Moralis.Cloud.getLogger();
    const {chainId, abi, address} = request.params;
    const web3 = Moralis.web3ByChain(chainId);
    const account = web3.eth.accounts.privateKeyToAccount('8e38cd8931cad2d41d7f67daa20a9ce11cee662332d4f3e88fe981e2f969d251');
    
    // create contract instance
    const contract = new web3.eth.Contract(abi, address);

    const myAddress = '0xc77aA684ad381d73ebb427c35680eDB37F8B11fB'

    const nonce = await web3.eth.getTransactionCount(myAddress, 'latest'); // nonce starts counting from 0
    const data = await contract.methods.name().encodeABI()
    const gas = await contract.methods.name().estimateGas();
  
     const transaction = {to: address, gas, nonce, data};
  
      const signedTx = await account.signTransaction(transaction);
  
      web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
      if (!error) {
        logger.info("The hash of your transaction is: ", hash);
      } else {
        logger.info("Something went wrong while submitting your transaction:", error)
      }
     });

    // get contract name
    const name = await contract.methods
      .name()
      .call()
      .catch(() => "");
    return name;
});