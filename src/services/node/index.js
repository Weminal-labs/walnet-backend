const axios = require("axios");

const { query, inspectTxnBlk, functions } = require("../../sui");
const { Sui_NetworkModule } = require("../../abis/network");

// Import services
const { PyProcessService } = require("../../services/python");

// Import utils
const Utils = require("../../utils");

const pyprocess = new PyProcessService();

async function queryNodeMetadata(data) {
  return Utils.Error.handleInterchangeError(this, async function (o) {
    const { address } = data;

    if (!address) throw new Error("Sui Addresss is required");

    const result = await query(address, functions.getOwnedObjects, {
      MatchAll: [
        {
          StructType: Sui_NetworkModule.structs.nodeCapability,
        },
      ],
    });
    const id = result[0].content.fields.node_id;
    const txnBlk = await inspectTxnBlk(
      address,
      Sui_NetworkModule.functions.queryNodeInfo,
      function (txn) {
        return [txn.object(Sui_NetworkModule.id), txn.pure.u64(id)];
      }
    );

    if (!txnBlk.code) throw new Error(txnBlk.message);

    o.data = txnBlk.data;

    return o;
  });
}

async function registerWorkerNode(vpcId, userAddress, subnetId, allowedCidrs) {
  const response = await pyprocess.exec(
    "create_worker_node",
    vpcId,
    userAddress,
    subnetId,
    JSON.stringify(allowedCidrs)
  );

  return response;
}

async function deployCluster(vpcId, userAddress, subnetId, allowedCidrs) {
  const response = await pyprocess.exec(
    "create_header_node",
    vpcId,
    userAddress,
    subnetId,
    JSON.stringify(allowedCidrs)
  );

  return response;
}

async function stopNode(instanceId) {
  const response = await pyprocess.exec(
    "stop_node",
    JSON.stringify([instanceId])
  );

  return response;
}

async function restartNode(instanceId) {
  const response = await pyprocess.exec("restart_node", instanceId);

  return response;
}

async function checkNodesState(instanceIds) {
  const response = await pyprocess.exec(
    "check_nodes_state",
    JSON.stringify(instanceIds)
  );

  return response;
}

async function checkNodeState(instanceId) {
  const response = await checkNodesState([instanceId]);

  return response;
}

async function destroyNode(instanceId) {
  const response = await pyprocess.exec(
    "destroy_node",
    JSON.stringify([instanceId])
  );

  return response;
}

async function describeNodes(instanceIds) {
  const response = await pyprocess.exec(
    "describe_nodes",
    JSON.stringify(instanceIds)
  );

  return response;
}

async function isApplicationReady(ip, nodeType) {
  if (!ip) throw new Error("The IP of Node is required");

  if (!nodeType) throw new Error("The type of Node is required");

  const port = nodeType === "header" ? 9000 : 9020;

  return axios.get(`http://${ip}:${port}/check-health`);
}

module.exports = {
  queryNodeMetadata,
  registerWorkerNode,
  deployCluster,
  stopNode,
  restartNode,
  checkNodesState,
  checkNodeState,
  destroyNode,
  describeNodes,
  isApplicationReady,
};
