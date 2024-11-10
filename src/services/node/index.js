const { query, functions } = require("../../sui");
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
          StructType: Sui_NetworkModule.structs.node,
        },
      ],
    });

    if (!result.code) throw new Error(result.message);

    o.data = result.data;

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

async function deployCluster() {}

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
};
