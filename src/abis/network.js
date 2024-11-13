const packageId = process.env.NETWORK_PACKAGE_ID;
const networkId = process.env.NETWORK_ID;
const nodeRegistryId = process.env.NODE_REGISTRY_ID;

const modules = {
  network: process.env.NETWORK_PACKAGE_NAME,
};

const Sui_NetworkModule = {
  id: packageId,
  name: modules.network,
  networkId,
  nodeRegistryId,
  structs: {
    node: `${packageId}::${modules.network}::Node`,
    cluster: `${packageId}::${modules.network}::Cluster`,
    task: `${packageId}::${modules.network}::Task`,
    nodeCapability: `${packageId}::${modules.network}::NodeCapability`,
  },
  functions: {
    queryNodeInfo: `${packageId}::${modules.network}::query_node_info`,
  },
};

module.exports = { Sui_NetworkModule };
