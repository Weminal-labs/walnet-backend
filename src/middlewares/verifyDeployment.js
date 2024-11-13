// const axios = require("axios");

// const { suiClient, functions, inspectTxnBlk } = require("../sui");

// Import abis
// const { Sui_NetworkModule } = require("../abis/network");

// Import services
const {
  queryNodeMetadata,
  queryClustersMetadata,
} = require("../services/node");

// Import utils
const Utils = require("../utils");

/**
 * Use to verify if user has deployed a cluster. If he/she have
 * deployed it, he/she could be do something like `submit task`.
 * @param req
 * @param res
 * @param next
 * @returns
 */
function verifyDeployment(req, res, next) {
  return Utils.Error.handleResponseError(this, res, async function (o) {
    const address = req.headers["user-address"];

    // const requestBody = {
    //   jsonrpc: "2.0",
    //   id: 1,
    //   method: "sui_getBalance",
    //   params: [{ owner: address }],
    // };

    //
    const response = await queryClustersMetadata({ address });

    if (!response.code) {
      o.code = 401;
      throw new Error(response.message);
    }

    // const result = response.data.results;

    // const values = Utils.Convert.convertMultiply(result[0].returnValues);

    // values[1] === address
    if (response.data) {
      return next();
    } else {
      o.code = 401;
      throw new Error("You haven't deployed any node yet");
    }
  });
}

module.exports = verifyDeployment;
