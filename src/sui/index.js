const axios = require("axios");

const { SuiClient, getFullnodeUrl } = require("@mysten/sui/client");
const { SuiGraphQLClient } = require("@mysten/sui/graphql");
const { graphql } = require("@mysten/sui/graphql/schemas/2024.4");
const { Transaction } = require("@mysten/sui/transactions");
const {
  Ed25519Keypair,
  DEFAULT_ED25519_DERIVATION_PATH,
} = require("@mysten/sui/keypairs/ed25519");

// Import utils
const Utils = require("../utils");

const NETWORK = process.env.NETWORK_TYPE;
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

async function call(address, queryFunc, filter) {
  let responseData;

  return Utils.Error.handleInterchangeError(this, async function (o) {
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

    responseData = response.data;

    if (responseData.error) {
      o.message = "Call failfully: " + responseData.error.message;
      throw new Error(`Call Error}`);
    }

    if (responseData.result.data.length === 0) {
      o.message = "Call failfully: " + "Not found";
      throw new Error(`Call Error`);
    }

    o.data = responseData.result.data;
    o.message = "Call successfully";

    return o;
  });
}

async function sign(address, target, getArgs, typeArgs) {
  return Utils.Error.handleInterchangeError(this, async function (o) {
    const txn = new Transaction();

    txn.moveCall({
      target,
      arguments: getArgs(txn),
      typeArguments: typeArgs,
    });

    const response = await suiClient.signAndExecuteTransaction({
      signer: address,
      transaction: txn,
    });

    o.data = response;

    return o;
  });
}

async function inspectTxnBlk(address, target, getArgs, typeArgs) {
  return Utils.Error.handleInterchangeError(this, async function (o) {
    const txn = new Transaction();

    txn.moveCall({
      target,
      arguments: getArgs(txn),
      typeArguments: typeArgs,
    });

    const response = await suiClient.devInspectTransactionBlock({
      sender: address,
      transactionBlock: txn,
    });

    if (response.error) throw new Error(response.error);

    o.data = response;

    return o;
  });
}

const functions = {
  getOwnedObjects: "suix_getOwnedObjects",
};

module.exports = {
  suiClient,
  suiGQLClient,
  SUI_NETWORK_ENDPOINT,
  SUI_VIEW_OBJECT_ENPOINT,
  SUI_VIEW_TXN_ENPOINT,
  suiPrivateKey,
  suiPublicKey,
  suiAddress,
  functions,
  sign,
  call,
  inspectTxnBlk,
};
