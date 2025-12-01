require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

const { MNEMONIC, INFURA_PROJECT_ID } = process.env;

// Buat instance provider SEKALI SAJA (singleton)
const sepoliaProvider = new HDWalletProvider(
  MNEMONIC,
  `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`
);

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    sepolia: {
      provider: () => sepoliaProvider, // gunakan instance yang sama
      network_id: 11155111,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  compilers: {
    solc: {
      version: "0.8.9",
    },
  },
};
