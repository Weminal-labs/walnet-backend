const axios = require("axios");

const { call, inspectTxnBlk, functions } = require("../../sui");
const { Sui_NetworkModule } = require("../../abis/network");

// Import services
const PyProcess = require("../../classes/pyprocess");

// Import utils
const Utils = require("../../utils");

const pyprocess = new PyProcess();

async function queryClustersMetadata(data) {
  return Utils.Error.handleInterchangeError(this, async function (o) {
    const { address } = data;

    if (!address) throw new Error("Sui Addresss is required");

    const response = await call(address, functions.getOwnedObjects, {
      MatchAll: [
        {
          StructType: Sui_NetworkModule.structs.clusterCapability,
        },
      ],
    });

    if (!response.code) throw new Error(response.message);

    // Array of Id
    const clusters_id = response.data[0].data.content.fields.clusters_id;

    if (!clusters_id || clusters_id.length === 0)
      throw new Error("You don't have any cluster deployed");

    // !!! Important Note
    // In the future, backend will consider which
    // cluster is suitable for handle task, and will
    // take id of that cluster to get ip of node to handle task.
    const randomClusterId =
      clusters_id[Utils.Number(0, clusters_id.length - 1)];
    if (!randomClusterId) {
      throw new Error("Don't find any cluster id");
    }
    o.data = randomClusterId;
    // const txnBlk = await inspectTxnBlk(
    //   address,
    //   Sui_NetworkModule.functions.queryClusterInfo,
    //   function (txn) {
    //     return [
    //       txn.object(Sui_NetworkModule.networkId),
    //       txn.pure.u64(randomClusterId),
    //     ];
    //   }
    // );

    // if (!txnBlk.code) throw new Error(txnBlk.message);

    // o.data = txnBlk.data;

    return o;
  });
}

async function queryNodeMetadata(data) {
  return Utils.Error.handleInterchangeError(this, async function (o) {
    const { address } = data;

    if (!address) throw new Error("Sui Addresss is required");

    const response = await call(address, functions.getOwnedObjects, {
      MatchAll: [
        {
          StructType: Sui_NetworkModule.structs.nodeCapability,
        },
      ],
    });

    if (!response.code) throw new Error(response.message);

    const nodeId = response.data[0].data.content.fields.node_id;
    const txnBlk = await inspectTxnBlk(
      address,
      Sui_NetworkModule.functions.queryNodeInfo,
      function (txn) {
        return [txn.object(Sui_NetworkModule.networkId), txn.pure.u64(nodeId)];
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

async function describeNodeswithType(nodeType) {
  const response = await pyprocess.exec(
    "describe_nodes_with_type",
    nodeType ? nodeType : ""
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
  queryClustersMetadata,
  deployCluster,
  stopNode,
  restartNode,
  checkNodesState,
  checkNodeState,
  destroyNode,
  describeNodes,
  describeNodeswithType,
  isApplicationReady,
};
