const packageId = process.env.NETWORK_PACKAGE_ID;

const modules = {
  network: process.env.NETWORK_PACKAGE_NAME,
};

const Sui_NetworkModule = {
  id: packageId,
  name: modules.network,
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
