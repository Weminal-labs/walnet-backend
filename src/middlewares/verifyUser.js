const axios = require("axios");

const { suiClient } = require("../sui");

// Import utils
const Utils = require("../utils");

const hexRegex = /^0x[0-9a-fA-F]{64}$/;

function verifyUser(req, res, next) {
  return Utils.Error.handleResponseError(this, res, async function (o) {
    const address = req.headers["user-address"];

    if (!address) {
      o.code = 401;
      throw new Error("Address is required");
    }

    if (!hexRegex.test(address)) {
      o.code = 400;
      throw new Error(`${address} is not a valid address`);
    }

    // const requestBody = {
    //   jsonrpc: "2.0",
    //   id: 1,
    //   method: "sui_getBalance",
    //   params: [{ owner: address }],
    // };

    const response = await suiClient.getBalance({ owner: address });

    // const response = await axios.post(
    //   SUI_NETWORK_ENPOINT,
    //   {
    //     jsonrpc: "2.0",
    //     id: 1,
    //     method: "suix_getOwnedObjects",
    //     params: [
    //       "0xa2f0bc1bfa16d294bb22107ba154ea09c21cd3c3451e33d4cc80ee5d5873cf76",
    //       {
    //         filter: {
    //           MatchAll: [
    //             {
    //               StructType:
    //                 "0x7e12d67a52106ddd5f26c6ff4fe740ba5dea7cfc138d5b1d33863ba9098aa6fe::blob::Blob",
    //               // AddressOwner: address,
    //             },
    //           ],
    //         },
    //         options: {
    //           showType: false,
    //           showOwner: false,
    //           showPreviousTransaction: false,
    //           showDisplay: false,
    //           showContent: true,
    //           showBcs: false,
    //           showStorageRebate: false,
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    // const data = response.data;

    // console.log(data);

    if (response) {
      return next();
    } else {
      o.code = 401;
      throw new Error("Unauthenticated");
    }
  });
}

module.exports = verifyUser;
