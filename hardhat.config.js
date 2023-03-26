require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.10',
  paths: {
    artifacts: "./src/artifacts",
  },
  networks: {
    local: {
      chainId: 31337,
      url: "http://127.0.0.1:8545",         //Your RPC URL
      accounts: ["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],          //Your private key
    },
    polygon: {
      chainId: 80001,
      url: process.env.ALCHEMY_MUMBAI,
      accounts: [process.env.PRIVATE_KEY],
    },
    goerli: {
      chainId: 05,
      url: process.env.ALCHEMY_GOERLI,
      accounts: [process.env.PRIVATE_KEY],
    }
  },
};
