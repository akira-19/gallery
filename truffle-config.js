const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic ="property flush police undo warfare pulp awful obscure match know paddle acoustic";
const infura_url = "https://ropsten.infura.io/v3/a0e6bae2d4be4f749b0525b8f300a214"
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
      gas: 6500000
    }
      ,
    ropsten:{
      provider: function(){
          return new HDWalletProvider(mnemonic, infura_url)
      },
      network_id:3,
      gas: 6500000
    }
  },
  compilers: {
      solc: {
       version: "0.5.4"
     }
  }
};
