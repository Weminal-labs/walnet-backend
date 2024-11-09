const { SuiClient } = require("@mysten/sui/client");

const NETWORK = "testnet";
const SUI_NETWORK_ENPOINT = `https://fullnode.${NETWORK}.sui.io`;
const SUI_VIEW_TXN_ENPOINT = `https://suiscan.xyz/${NETWORK}/tx`;
const SUI_VIEW_OBJECT_ENPOINT = `https://suiscan.xyz/${NETWORK}/object`;

const suiClient = new SuiClient({
  url: SUI_NETWORK_ENPOINT,
});

function sign() {}

module.exports = {
  suiClient,
  SUI_NETWORK_ENPOINT,
  SUI_VIEW_OBJECT_ENPOINT,
  SUI_VIEW_TXN_ENPOINT,
};
