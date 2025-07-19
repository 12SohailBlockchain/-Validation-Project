require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    sepolia: {
        url: "https://snowy-thrilling-yard.ethereum-sepolia.quiknode.pro/2af760681b4ae525e425b6c7da4c033cd4315647/",
        accounts: [
          `ce7e5002a28b4432d9ec390683bd3446ec8f190dd4baa29841c405909339bbba`,
        ],
    }
  },
  etherscan: {
    apiKey: {
      sepolia: "I4N8FCZ7BAG1TW8JYFZK91BBSSCXKATPFW",
    },
  },
};