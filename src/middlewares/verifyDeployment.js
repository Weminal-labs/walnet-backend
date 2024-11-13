const axios = require("axios");

const { suiClient } = require("../sui");

// Import services
const { queryNodeMetadata } = require("../services/node");

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
    const response = await queryNodeMetadata({ address });

    if (response) {
      return next();
    } else {
      o.code = 401;
      throw new Error("Unauthenticated");
    }
  });
}

module.exports = verifyDeployment;
