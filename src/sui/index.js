const { SuiClient, getFullnodeUrl } = require("@mysten/sui/client");
const { SuiGraphQLClient } = require("@mysten/sui/graphql");
const { graphql } = require("@mysten/sui/graphql/schemas/2024.4");
const { Transaction } = require("@mysten/sui/transactions");
const {
  Ed25519Keypair,
  DEFAULT_ED25519_DERIVATION_PATH,
} = require("@mysten/sui/keypairs/ed25519");

const NETWORK = "testnet";
const SUI_NETWORK_ENDPOINT = getFullnodeUrl(NETWORK);
const SUI_VIEW_TXN_ENPOINT = `https://suiscan.xyz/${NETWORK}/tx`;
const SUI_VIEW_OBJECT_ENPOINT = `https://suiscan.xyz/${NETWORK}/object`;

const suiClient = new SuiClient({ url: SUI_NETWORK_ENDPOINT });
const suiGQLClient = new SuiGraphQLClient({
  url: `https://sui-${NETWORK}.mystenlabs.com/graphql`,
});

const keypair = Ed25519Keypair.deriveKeypair(
  process.env.MNEMONIC,
  DEFAULT_ED25519_DERIVATION_PATH
);
const suiPrivateKey = keypair.getSecretKey();
const suiPublicKey = keypair.getPublicKey();
const suiAddress = suiPublicKey.toSuiAddress();

async function query(address, queryFunc, filter) {
  try {
    const response = await axios.post(
      SUI_NETWORK_ENDPOINT,
      {
        jsonrpc: "2.0",
        id: 1,
        method: queryFunc,
        params: [
          address,
          {
            filter: filter,
            options: {
              showType: false,
              showOwner: false,
              showPreviousTransaction: false,
              showDisplay: false,
              showContent: true,
              showBcs: false,
              showStorageRebate: false,
            },
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );

    const result = response.data.result;
    const data = result.data;

    return data.map((_d) => _d.data);
  } catch (error) {
    console.error("Error fetching user transactions:", error);
  }
}

async function sign(address, target, args, typeArgs = []) {
  const txn = new Transaction();

  txn.moveCall({
    target,
    arguments: args,
    typeArguments: typeArgs,
  });

  const response = await suiClient.signAndExecuteTransaction({
    signer: address,
    transaction: txn,
  });

  return response;
}

module.exports = {
  suiClient,
  suiGQLClient,
  SUI_NETWORK_ENDPOINT,
  SUI_VIEW_OBJECT_ENPOINT,
  SUI_VIEW_TXN_ENPOINT,
  suiPrivateKey,
  suiPublicKey,
  suiAddress,
  sign,
  query,
};
